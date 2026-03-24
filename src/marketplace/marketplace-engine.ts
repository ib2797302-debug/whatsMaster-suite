/**
 * MARKETPLACE ENGINE - THEME PLUGIN MANAGEMENT
 * 
 * Moteur de marketplace pour les Theme-Plugins Métier.
 * Gestion de l'installation, la validation sécurité et le cycle de vie des plugins.
 */

import {
  ThemePluginBundle,
  ThemePluginManifest,
  InstallationContext,
  HealthStatus,
  BYOCConfig,
  AutonomousAgentConfig
} from '../types/autonomous-os';

export class MarketplaceEngine {
  private installedPlugins: Map<string, ThemePluginBundle>;
  private availablePlugins: Map<string, ThemePluginBundle>;
  private securityAuditors: Map<string, SecurityAuditor>;
  private allowThirdParty: boolean;
  private requireAudit: boolean;

  constructor(config: { 
    allowThirdPartyPlugins: boolean;
    requireSecurityAudit: boolean;
  }) {
    this.installedPlugins = new Map();
    this.availablePlugins = new Map();
    this.securityAuditors = new Map();
    this.allowThirdParty = config.allowThirdPartyPlugins;
    this.requireAudit = config.requireSecurityAudit;

    this.initializeDefaultAuditors();
    console.log('[MARKETPLACE] Engine initialized');
  }

  /**
   * Installe un plugin dans le système
   * Valide la sécurité, exécute les hooks d'installation
   */
  async installPlugin(
    plugin: ThemePluginBundle,
    context: InstallationContext
  ): Promise<void> {
    // Vérification des permissions
    if (!this.allowThirdParty && !this.isOfficialPlugin(plugin)) {
      throw new Error('Third-party plugins are not allowed');
    }

    // Validation du manifest
    this.validateManifest(plugin.manifest);

    // Audit de sécurité si requis
    if (this.requireAudit && plugin.manifest.securityAudit.status !== 'passed') {
      const auditResult = await this.performSecurityAudit(plugin);
      if (auditResult.status !== 'passed') {
        throw new Error(`Security audit failed: ${auditResult.reportUrl || 'No report available'}`);
      }
    }

    // Vérification de compatibilité
    this.checkCompatibility(plugin, context);

    // Exécution du hook d'installation
    try {
      await plugin.installHook(context);
    } catch (error) {
      throw new Error(`Installation hook failed: ${(error as Error).message}`);
    }

    // Enregistrement du plugin
    this.installedPlugins.set(plugin.manifest.id, plugin);

    console.log(`[MARKETPLACE] Plugin '${plugin.manifest.name}' installed successfully`);
  }

  /**
   * Désinstalle un plugin
   * Exécute les hooks de nettoyage
   */
  async uninstallPlugin(pluginId: string): Promise<void> {
    const plugin = this.installedPlugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    // Exécution du hook de désinstallation
    try {
      await plugin.uninstallHook({
        tenantId: 'system',
        byocConfig: { provider: 'onprem', region: 'local', encryptionKeyManagement: 'whatsmaster-managed', dataResidency: 'Local-OnPrem', backupStrategy: { frequency: 'daily', immutable: false, geoRedundant: false }, sovereignShield: { enabled: false, blockForeignAccess: false, auditLogLocation: '' } },
        existingAgents: [],
        memoryStore: {}
      });
    } catch (error) {
      console.warn(`[MARKETPLACE] Uninstall hook warning: ${(error as Error).message}`);
    }

    // Suppression du plugin
    this.installedPlugins.delete(pluginId);

    console.log(`[MARKETPLACE] Plugin '${plugin.manifest.name}' uninstalled`);
  }

  /**
   * Exécute un health check sur tous les plugins installés
   */
  async runHealthChecks(): Promise<Map<string, HealthStatus>> {
    const results = new Map<string, HealthStatus>();

    for (const [id, plugin] of this.installedPlugins.entries()) {
      try {
        const status = await plugin.healthCheck();
        results.set(id, status);
      } catch (error) {
        results.set(id, {
          status: 'unhealthy',
          checks: [{ name: 'health_check', passed: false, message: (error as Error).message }],
          latencyMs: 0,
          lastChecked: Date.now()
        });
      }
    }

    return results;
  }

  /**
   * Liste les plugins disponibles dans la marketplace
   */
  async listAvailablePlugins(): Promise<ThemePluginManifest[]> {
    return Array.from(this.availablePlugins.values()).map(p => p.manifest);
  }

  /**
   * Liste les plugins installés
   */
  listInstalledPlugins(): ThemePluginManifest[] {
    return Array.from(this.installedPlugins.values()).map(p => p.manifest);
  }

  /**
   * Recherche un plugin par ID
   */
  getPlugin(pluginId: string): ThemePluginBundle | undefined {
    return this.installedPlugins.get(pluginId);
  }

  /**
   * Ajoute un plugin au catalogue disponible
   */
  async addPluginToCatalog(plugin: ThemePluginBundle): Promise<void> {
    // Validation préalable
    this.validateManifest(plugin.manifest);

    // Audit automatique si plugin tiers
    if (!this.isOfficialPlugin(plugin) && this.requireAudit) {
      const auditResult = await this.performSecurityAudit(plugin);
      plugin.manifest.securityAudit = auditResult;
    }

    this.availablePlugins.set(plugin.manifest.id, plugin);
    console.log(`[MARKETPLACE] Plugin '${plugin.manifest.name}' added to catalog`);
  }

  // Helpers privés
  private isOfficialPlugin(plugin: ThemePluginBundle): boolean {
    return plugin.manifest.vendor.name === 'WhatsMaster' && plugin.manifest.vendor.verified;
  }

  private validateManifest(manifest: ThemePluginManifest): void {
    // Validation des champs obligatoires
    if (!manifest.id || !manifest.name || !manifest.version) {
      throw new Error('Invalid manifest: missing required fields');
    }

    // Validation du format d'ID (reverse DNS)
    const idPattern = /^[a-z][a-z0-9]*\.[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/;
    if (!idPattern.test(manifest.id)) {
      throw new Error(`Invalid plugin ID format: ${manifest.id}. Expected reverse DNS notation.`);
    }

    // Validation de la version (semver)
    const semverPattern = /^\d+\.\d+\.\d+(-[a-zA-Z0-9]+)?$/;
    if (!semverPattern.test(manifest.version)) {
      throw new Error(`Invalid version format: ${manifest.version}. Expected SemVer.`);
    }

    // Validation du pricing
    if (manifest.pricing.model !== 'free' && !manifest.pricing.amount) {
      throw new Error('Paid plugins must have an amount specified');
    }
  }

  private checkCompatibility(plugin: ThemePluginBundle, context: InstallationContext): void {
    const { compatibility } = plugin.manifest;

    // Vérification de la version OS minimale
    const osVersion = '1.0.0'; // Version courante de l'OS
    if (this.compareVersions(osVersion, compatibility.minOsVersion) < 0) {
      throw new Error(
        `Plugin requires OS version ${compatibility.minOsVersion} or higher. Current: ${osVersion}`
      );
    }

    // Vérification des capacités requises
    // Dans une implémentation réelle, vérifier contre les capacités du système
    console.log(`[MARKETPLACE] Compatibility check passed for ${plugin.manifest.id}`);
  }

  private compareVersions(v1: string, v2: string): number {
    const parts1 = v1.replace(/-[a-zA-Z0-9]+$/, '').split('.').map(Number);
    const parts2 = v2.replace(/-[a-zA-Z0-9]+$/, '').split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const n1 = parts1[i] || 0;
      const n2 = parts2[i] || 0;
      if (n1 > n2) return 1;
      if (n1 < n2) return -1;
    }

    return 0;
  }

  private async performSecurityAudit(plugin: ThemePluginBundle): Promise<{
    status: 'passed' | 'pending' | 'failed';
    date: string;
    auditor: string;
    reportUrl?: string;
  }> {
    // Sélection d'un auditeur disponible
    const auditor = Array.from(this.securityAuditors.values())[0];
    if (!auditor) {
      throw new Error('No security auditor available');
    }

    console.log(`[MARKETPLACE] Running security audit on ${plugin.manifest.id}`);

    // Exécution de l'audit (simulé)
    const result = await auditor.audit(plugin);

    return {
      status: result.passed ? 'passed' : 'failed',
      date: new Date().toISOString(),
      auditor: auditor.name,
      reportUrl: result.reportUrl
    };
  }

  private initializeDefaultAuditors(): void {
    // Auditeurs de sécurité intégrés
    this.securityAuditors.set('owasp-zap', new OWASPAuditor());
    this.securityAuditors.set('snyk', new SnykAuditor());
  }
}

/**
 * Interface pour les auditeurs de sécurité
 */
interface SecurityAuditor {
  name: string;
  audit(plugin: ThemePluginBundle): Promise<{ passed: boolean; reportUrl?: string }>;
}

/**
 * Auditeur basé sur OWASP ZAP
 */
class OWASPAuditor implements SecurityAuditor {
  name = 'OWASP ZAP';

  async audit(plugin: ThemePluginBundle): Promise<{ passed: boolean; reportUrl?: string }> {
    // Simulation d'un audit OWASP
    // En production: exécution réelle de scans de sécurité
    
    const hasCriticalIssues = false; // Résultat simulé
    
    return {
      passed: !hasCriticalIssues,
      reportUrl: hasCriticalIssues ? undefined : `https://audit.whatsmaster.io/reports/${plugin.manifest.id}-owasp`
    };
  }
}

/**
 * Auditeur basé sur Snyk
 */
class SnykAuditor implements SecurityAuditor {
  name = 'Snyk';

  async audit(plugin: ThemePluginBundle): Promise<{ passed: boolean; reportUrl?: string }> {
    // Simulation d'un audit Snyk des dépendances
    // En production: analyse réelle du code et des dépendances
    
    const hasVulnerabilities = false; // Résultat simulé
    
    return {
      passed: !hasVulnerabilities,
      reportUrl: hasVulnerabilities ? undefined : `https://audit.whatsmaster.io/reports/${plugin.manifest.id}-snyk`
    };
  }
}
