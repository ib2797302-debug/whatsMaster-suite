/**
 * WhatsMaster Suite - Core Theme Plugin Engine
 * 
 * Moteur central pour l'exécution des Theme-Plugins Métier
 * Architecture: Enterprise Multinationale (Salesforce/SAP/Microsoft inspired)
 * Version: 2026.1.0 - Production Ready
 */

import { z } from 'zod';
import { EventEmitter } from 'events';
import type { 
  ThemePluginManifest, 
  ThemePluginInstance, 
  PluginHealthStatus,
  AgenticWorkflowNode,
  BioProfile,
  FinOpsMetrics
} from '../../types/theme-plugin';

// ============================================================================
// CONFIGURATION GLOBALE
// ============================================================================

export interface ThemeEngineConfig {
  /** Mode d'exécution: 'sandbox' | 'production' | 'development' */
  mode: 'sandbox' | 'production' | 'development';
  
  /** Limites de ressources par plugin */
  resourceLimits: {
    maxMemoryMB: number;
    maxExecutionTimeMs: number;
    maxConcurrentWorkflows: number;
    maxAPICallsPerMinute: number;
  };
  
  /** Configuration de sécurité */
  security: {
    enableSandboxing: boolean;
    allowedExternalDomains: string[];
    requireEncryption: boolean;
    auditLogging: boolean;
  };
  
  /** Configuration IA */
  ai: {
    defaultLLMProvider: string;
    fallbackProviders: string[];
    maxTokenBudget: number;
    enableCostOptimization: boolean;
    carbonAwareRouting: boolean;
  };
}

// ============================================================================
// SCHÉMAS DE VALIDATION (Zod)
// ============================================================================

const ManifestSchema = z.object({
  id: z.string().regex(/^com\.[a-z0-9.-]+\.[a-z0-9-]+$/),
  name: z.string().min(3).max(100),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  description: z.string().max(500),
  vendor: z.object({
    name: z.string(),
    certification: z.enum(['verified', 'partner', 'community']),
    contact: z.string().email().optional()
  }),
  licensing: z.object({
    type: z.enum(['freemium', 'proprietary', 'open_source']),
    model: z.enum(['per_user', 'per_tenant', 'usage_based', 'one_time']),
    price: z.object({
      amount: z.number().positive(),
      currency: z.enum(['EUR', 'USD', 'GBP']),
      period: z.enum(['monthly', 'yearly', 'one_time']).optional()
    }).optional(),
    trialDays: z.number().int().positive().optional()
  }),
  compliance: z.object({
    gdprReady: z.boolean(),
    soc2Compliant: z.boolean(),
    iso27001Compliant: z.boolean(),
    hipaaCompliant: z.boolean().optional(),
    pciDssCompliant: z.boolean().optional(),
    dataResidency: z.array(z.string()).min(1)
  }),
  dependencies: z.array(z.object({
    pluginId: z.string(),
    minVersion: z.string(),
    required: z.boolean().default(false),
    feature: z.string()
  })).optional(),
  capabilities: z.array(z.enum([
    'agentic_workforce',
    'bio_memory',
    'voice_first',
    'graph_rag',
    'finops_aware',
    'offline_capable'
  ])).optional()
});

// ============================================================================
// MOTEUR PRINCIPAL
// ============================================================================

export class ThemePluginEngine extends EventEmitter {
  private config: ThemeEngineConfig;
  private plugins: Map<string, ThemePluginInstance> = new Map();
  private healthChecks: Map<string, NodeJS.Timeout> = new Map();
  private metrics: Map<string, PluginMetrics> = new Map();
  
  constructor(config: ThemeEngineConfig) {
    super();
    this.config = config;
    this.validateConfig();
  }
  
  private validateConfig(): void {
    if (this.config.resourceLimits.maxMemoryMB < 64) {
      throw new Error('Memory limit must be at least 64MB');
    }
    if (this.config.resourceLimits.maxExecutionTimeMs < 1000) {
      throw new Error('Execution time limit must be at least 1000ms');
    }
  }
  
  /**
   * Enregistrer un nouveau Theme-Plugin
   */
  async register(plugin: ThemePluginInstance): Promise<void> {
    const pluginId = plugin.manifest.id;
    
    // Validation du manifest
    const validation = ManifestSchema.safeParse(plugin.manifest);
    if (!validation.success) {
      throw new Error(`Invalid manifest for ${pluginId}: ${validation.error.message}`);
    }
    
    // Vérifier les dépendances
    await this.validateDependencies(plugin);
    
    // Initialiser le plugin
    await this.initializePlugin(plugin);
    
    // Démarrer les health checks
    this.startHealthCheck(plugin);
    
    // Émettre l'événement
    this.emit('plugin:registered', { pluginId, timestamp: Date.now() });
    
    console.log(`✅ Plugin registered: ${plugin.manifest.name} v${plugin.manifest.version}`);
  }
  
  /**
   * Valider les dépendances d'un plugin
   */
  private async validateDependencies(plugin: ThemePluginInstance): Promise<void> {
    const deps = plugin.manifest.dependencies || [];
    
    for (const dep of deps) {
      if (dep.required && !this.plugins.has(dep.pluginId)) {
        throw new Error(
          `Missing required dependency: ${dep.pluginId} (feature: ${dep.feature})`
        );
      }
      
      if (this.plugins.has(dep.pluginId)) {
        const depPlugin = this.plugins.get(dep.pluginId)!;
        if (this.compareVersions(depPlugin.manifest.version, dep.minVersion) < 0) {
          throw new Error(
            `Dependency version mismatch: ${dep.pluginId} requires >= ${dep.minVersion}, got ${depPlugin.manifest.version}`
          );
        }
      }
    }
  }
  
  /**
   * Comparer deux versions sémantiques
   */
  private compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
      if (parts1[i] > parts2[i]) return 1;
      if (parts1[i] < parts2[i]) return -1;
    }
    return 0;
  }
  
  /**
   * Initialiser un plugin (lifecycle hooks)
   */
  private async initializePlugin(plugin: ThemePluginInstance): Promise<void> {
    try {
      // Hook: onPreInit
      if (plugin.hooks?.onPreInit) {
        await plugin.hooks.onPreInit();
      }
      
      // Initialiser les connecteurs
      if (plugin.connectorPack?.connectors) {
        for (const connector of plugin.connectorPack.connectors) {
          if (connector.enabled) {
            await connector.init?.();
          }
        }
      }
      
      // Initialiser les workflows
      if (plugin.workflowPack?.workflows) {
        for (const workflow of plugin.workflowPack.workflows) {
          if (workflow.enabled) {
            this.validateWorkflow(workflow);
          }
        }
      }
      
      // Hook: onPostInit
      if (plugin.hooks?.onPostInit) {
        await plugin.hooks.onPostInit();
      }
      
      // Stocker le plugin
      this.plugins.set(plugin.manifest.id, plugin);
      this.metrics.set(plugin.manifest.id, {
        executions: 0,
        errors: 0,
        avgResponseTime: 0,
        lastHealthCheck: Date.now(),
        status: 'healthy'
      });
      
    } catch (error) {
      this.emit('plugin:init_error', { 
        pluginId: plugin.manifest.id, 
        error,
        timestamp: Date.now()
      });
      throw error;
    }
  }
  
  /**
   * Valider la structure d'un workflow
   */
  private validateWorkflow(workflow: any): void {
    if (!workflow.id || !workflow.name) {
      throw new Error('Workflow must have id and name');
    }
    
    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      throw new Error('Workflow must have nodes array');
    }
    
    // Validation des noeuds
    for (const node of workflow.nodes) {
      if (!node.id || !node.type) {
        throw new Error(`Invalid node in workflow ${workflow.id}`);
      }
    }
  }
  
  /**
   * Démarrer les health checks périodiques
   */
  private startHealthCheck(plugin: ThemePluginInstance): void {
    const pluginId = plugin.manifest.id;
    
    // Nettoyer l'ancien check si existe
    if (this.healthChecks.has(pluginId)) {
      clearInterval(this.healthChecks.get(pluginId));
    }
    
    // Nouveau health check toutes les 30s
    const interval = setInterval(async () => {
      try {
        const status = await this.performHealthCheck(plugin);
        const metrics = this.metrics.get(pluginId)!;
        metrics.lastHealthCheck = Date.now();
        metrics.status = status ? 'healthy' : 'degraded';
        
        if (!status) {
          this.emit('plugin:health_degraded', { pluginId, timestamp: Date.now() });
        }
      } catch (error) {
        const metrics = this.metrics.get(pluginId)!;
        metrics.status = 'unhealthy';
        this.emit('plugin:health_failed', { pluginId, error, timestamp: Date.now() });
      }
    }, 30000);
    
    this.healthChecks.set(pluginId, interval);
  }
  
  /**
   * Exécuter un health check complet
   */
  private async performHealthCheck(plugin: ThemePluginInstance): Promise<boolean> {
    try {
      // Hook custom health check
      if (plugin.hooks?.onHealthCheck) {
        const result = await plugin.hooks.onHealthCheck();
        if (!result.healthy) return false;
      }
      
      // Vérifier les connecteurs actifs
      if (plugin.connectorPack?.connectors) {
        for (const connector of plugin.connectorPack.connectors) {
          if (connector.enabled && connector.healthCheck) {
            const healthy = await connector.healthCheck();
            if (!healthy) return false;
          }
        }
      }
      
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Exécuter un workflow d'un plugin
   */
  async executeWorkflow<T = any>(
    pluginId: string,
    workflowId: string,
    context: Record<string, any>
  ): Promise<T> {
    const startTime = Date.now();
    const plugin = this.plugins.get(pluginId);
    
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginId}`);
    }
    
    const workflow = plugin.workflowPack?.workflows?.find(w => w.id === workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId} in plugin ${pluginId}`);
    }
    
    if (!workflow.enabled) {
      throw new Error(`Workflow disabled: ${workflowId}`);
    }
    
    try {
      // Vérifier les limites de ressources
      await this.checkResourceLimits(pluginId);
      
      // Exécuter le workflow
      const result = await this.runWorkflowNodes(workflow, context);
      
      // Mettre à jour les métriques
      const executionTime = Date.now() - startTime;
      this.updateMetrics(pluginId, { success: true, executionTime });
      
      return result as T;
    } catch (error) {
      this.updateMetrics(pluginId, { success: false, executionTime: Date.now() - startTime });
      this.emit('workflow:error', { pluginId, workflowId, error, context });
      throw error;
    }
  }
  
  /**
   * Exécuter les noeuds d'un workflow en séquence/parallèle
   */
  private async runWorkflowNodes(
    workflow: any,
    initialContext: Record<string, any>
  ): Promise<any> {
    let context = { ...initialContext };
    let lastResult: any = null;
    
    for (const node of workflow.nodes) {
      try {
        // Vérifier les conditions d'exécution
        if (node.condition && !this.evaluateCondition(node.condition, context)) {
          continue;
        }
        
        // Exécuter le noeud selon son type
        switch (node.type) {
          case 'action':
            lastResult = await this.executeActionNode(node, context);
            break;
          case 'decision':
            lastResult = await this.executeDecisionNode(node, context);
            break;
          case 'ai_prompt':
            lastResult = await this.executeAINode(node, context);
            break;
          case 'api_call':
            lastResult = await this.executeAPINode(node, context);
            break;
          case 'data_transform':
            lastResult = await this.executeTransformNode(node, context);
            break;
          case 'wait':
            await this.executeWaitNode(node);
            break;
          default:
            throw new Error(`Unknown node type: ${node.type}`);
        }
        
        // Mettre à jour le contexte
        if (node.outputVar) {
          context[node.outputVar] = lastResult;
        }
        
        // Gérer les erreurs avec retry policy
        if (lastResult?.error && node.retryPolicy) {
          lastResult = await this.handleRetry(node, context);
        }
        
      } catch (error) {
        if (node.onError?.action === 'stop') {
          throw error;
        } else if (node.onError?.action === 'continue') {
          context['lastError'] = error;
          continue;
        }
        throw error;
      }
    }
    
    return lastResult;
  }
  
  /**
   * Exécuter un noeud d'action
   */
  private async executeActionNode(node: any, context: Record<string, any>): Promise<any> {
    const action = node.config?.action;
    if (!action) throw new Error('Action node missing action config');
    
    // Résoudre les variables du contexte
    const params = this.resolveTemplate(action.params, context);
    
    // Exécuter l'action
    return action.handler(params);
  }
  
  /**
   * Exécuter un noeud de décision
   */
  private async executeDecisionNode(node: any, context: Record<string, any>): Promise<any> {
    const branches = node.config?.branches || [];
    
    for (const branch of branches) {
      if (this.evaluateCondition(branch.condition, context)) {
        return this.runWorkflowNodes(
          { nodes: branch.nodes },
          context
        );
      }
    }
    
    // Branche par défaut
    if (node.config?.defaultBranch) {
      return this.runWorkflowNodes(
        { nodes: node.config.defaultBranch.nodes },
        context
      );
    }
    
    return null;
  }
  
  /**
   * Exécuter un noeud IA (prompt LLM)
   */
  private async executeAINode(node: any, context: Record<string, any>): Promise<any> {
    const promptConfig = node.config?.prompt;
    if (!promptConfig) throw new Error('AI node missing prompt config');
    
    // Résoudre le template du prompt
    const prompt = this.resolveTemplate(promptConfig.template, context);
    
    // Sélectionner le modèle optimal (cost-aware)
    const model = this.selectOptimalModel(promptConfig, context);
    
    // Appeler le LLM
    const response = await this.callLLM(model, prompt, promptConfig.options);
    
    // Parser la réponse
    if (promptConfig.responseSchema) {
      return this.parseStructuredResponse(response, promptConfig.responseSchema);
    }
    
    return response;
  }
  
  /**
   * Sélectionner le modèle LLM optimal (coût/performance)
   */
  private selectOptimalModel(promptConfig: any, context: Record<string, any>): string {
    // Logique de routage intelligent
    if (this.config.ai.enableCostOptimization) {
      // Si tâche simple -> modèle économique
      if (promptConfig.complexity === 'low') {
        return 'gpt-4o-mini';
      }
      // Si urgence -> modèle rapide
      if (context.priority === 'high') {
        return 'gpt-4-turbo';
      }
      // Si sensible au carbone -> modèle green
      if (this.config.ai.carbonAwareRouting && context.carbonSensitive) {
        return 'green-llm-v2';
      }
    }
    
    return promptConfig.model || this.config.ai.defaultLLMProvider;
  }
  
  /**
   * Appeler un LLM (mock pour l'instant)
   */
  private async callLLM(model: string, prompt: string, options?: any): Promise<string> {
    // Simulation d'appel LLM
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return `Response from ${model}: ${prompt.substring(0, 50)}...`;
  }
  
  /**
   * Exécuter un noeud d'appel API
   */
  private async executeAPINode(node: any, context: Record<string, any>): Promise<any> {
    const apiConfig = node.config?.api;
    if (!apiConfig) throw new Error('API node missing api config');
    
    const url = this.resolveTemplate(apiConfig.url, context);
    const method = apiConfig.method || 'GET';
    const headers = this.resolveTemplate(apiConfig.headers || {}, context);
    const body = apiConfig.body ? this.resolveTemplate(apiConfig.body, context) : undefined;
    
    // Rate limiting
    await this.checkRateLimit(apiConfig.connectorId);
    
    // Appel API
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
  
  /**
   * Exécuter un noeud de transformation de données
   */
  private async executeTransformNode(node: any, context: Record<string, any>): Promise<any> {
    const transform = node.config?.transform;
    if (!transform) throw new Error('Transform node missing transform config');
    
    // Appliquer la fonction de transformation
    return transform(context);
  }
  
  /**
   * Exécuter un noeud d'attente
   */
  private async executeWaitNode(node: any): Promise<void> {
    const duration = node.config?.duration || 1000;
    await new Promise(resolve => setTimeout(resolve, duration));
  }
  
  /**
   * Évaluer une condition
   */
  private evaluateCondition(condition: any, context: Record<string, any>): boolean {
    if (!condition) return true;
    
    // Support des opérateurs: eq, ne, gt, lt, gte, lte, in, notIn, contains, exists
    const { field, operator, value } = condition;
    const fieldValue = this.getNestedValue(context, field);
    
    switch (operator) {
      case 'eq': return fieldValue === value;
      case 'ne': return fieldValue !== value;
      case 'gt': return fieldValue > value;
      case 'lt': return fieldValue < value;
      case 'gte': return fieldValue >= value;
      case 'lte': return fieldValue <= value;
      case 'in': return value.includes(fieldValue);
      case 'notIn': return !value.includes(fieldValue);
      case 'contains': return fieldValue?.includes(value);
      case 'exists': return fieldValue !== undefined && fieldValue !== null;
      default: return false;
    }
  }
  
  /**
   * Obtenir une valeur imbriquée dans un objet
   */
  private getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }
  
  /**
   * Résoudre un template avec des variables de contexte
   */
  private resolveTemplate(template: any, context: Record<string, any>): any {
    if (typeof template === 'string') {
      return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
        const value = this.getNestedValue(context, path);
        return value !== undefined ? String(value) : '';
      });
    }
    
    if (typeof template === 'object' && template !== null) {
      const resolved: any = Array.isArray(template) ? [] : {};
      for (const [key, value] of Object.entries(template)) {
        resolved[key] = this.resolveTemplate(value, context);
      }
      return resolved;
    }
    
    return template;
  }
  
  /**
   * Parser une réponse structurée
   */
  private parseStructuredResponse(response: string, schema: any): any {
    try {
      // Extraire JSON de la réponse
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON found in response');
    } catch (error) {
      throw new Error(`Failed to parse structured response: ${error}`);
    }
  }
  
  /**
   * Gérer les retries avec backoff exponentiel
   */
  private async handleRetry(node: any, context: Record<string, any>): Promise<any> {
    const retryPolicy = node.retryPolicy;
    const maxAttempts = retryPolicy.maxAttempts || 3;
    const baseDelay = retryPolicy.baseDelay || 1000;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Réexécuter le noeud
        return await this.executeActionNode(node, context);
      } catch (error) {
        if (attempt === maxAttempts) {
          throw error;
        }
        
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Max retry attempts reached');
  }
  
  /**
   * Vérifier les limites de ressources
   */
  private async checkResourceLimits(pluginId: string): Promise<void> {
    const limits = this.config.resourceLimits;
    const metrics = this.metrics.get(pluginId);
    
    if (!metrics) return;
    
    // Vérifier le temps d'exécution moyen
    if (metrics.avgResponseTime > limits.maxExecutionTimeMs) {
      throw new Error(`Execution time exceeded limit: ${limits.maxExecutionTimeMs}ms`);
    }
  }
  
  /**
   * Vérifier le rate limiting
   */
  private async checkRateLimit(connectorId: string): Promise<void> {
    // Implémentation simplifiée du rate limiting
    const limit = this.config.resourceLimits.maxAPICallsPerMinute;
    
    // Logique de token bucket ou sliding window à implémenter
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  /**
   * Mettre à jour les métriques d'un plugin
   */
  private updateMetrics(
    pluginId: string, 
    data: { success: boolean; executionTime: number }
  ): void {
    const metrics = this.metrics.get(pluginId);
    if (!metrics) return;
    
    metrics.executions++;
    if (!data.success) {
      metrics.errors++;
    }
    
    // Moyenne mobile pour le temps de réponse
    const alpha = 0.1;
    metrics.avgResponseTime = 
      metrics.avgResponseTime * (1 - alpha) + data.executionTime * alpha;
  }
  
  /**
   * Obtenir les métriques d'un plugin
   */
  getPluginMetrics(pluginId: string): PluginMetrics | undefined {
    return this.metrics.get(pluginId);
  }
  
  /**
   * Obtenir tous les plugins enregistrés
   */
  getRegisteredPlugins(): ThemePluginInstance[] {
    return Array.from(this.plugins.values());
  }
  
  /**
   * Désenregistrer un plugin
   */
  async unregister(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return;
    
    // Hook: onPreDestroy
    if (plugin.hooks?.onPreDestroy) {
      await plugin.hooks.onPreDestroy();
    }
    
    // Nettoyer les health checks
    if (this.healthChecks.has(pluginId)) {
      clearInterval(this.healthChecks.get(pluginId));
      this.healthChecks.delete(pluginId);
    }
    
    // Supprimer le plugin
    this.plugins.delete(pluginId);
    this.metrics.delete(pluginId);
    
    this.emit('plugin:unregistered', { pluginId, timestamp: Date.now() });
  }
  
  /**
   * Arrêter le moteur proprement
   */
  async shutdown(): Promise<void> {
    console.log('🛑 Shutting down Theme Plugin Engine...');
    
    // Désenregistrer tous les plugins
    for (const pluginId of this.plugins.keys()) {
      await this.unregister(pluginId);
    }
    
    this.emit('engine:shutdown', { timestamp: Date.now() });
  }
}

// ============================================================================
// TYPES AUXILIAIRES
// ============================================================================

interface PluginMetrics {
  executions: number;
  errors: number;
  avgResponseTime: number;
  lastHealthCheck: number;
  status: 'healthy' | 'degraded' | 'unhealthy';
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ThemePluginEngine;
