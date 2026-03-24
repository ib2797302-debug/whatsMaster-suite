/**
 * WHATSMASTER AUTONOMOUS OS - CORE TYPES (2026 STANDARD)
 * 
 * Définit le contrat pour le premier Système d'Exploitation Conversationnel Autonome.
 * Inspiré par les standards A2A (Agent-to-Agent), W3C DID, et Green Software Foundation.
 */

// ============================================================================
// PILIER 1: AGENTIC WORKFORCE (Standard A2A)
// ============================================================================

export type AgentRole = 'orchestrator' | 'specialist' | 'executor' | 'critic' | 'liaison';
export type AgentState = 'idle' | 'thinking' | 'acting' | 'negotiating' | 'blocked' | 'completed';

export interface AgentCapability {
  id: string;
  name: string;
  type: 'reasoning' | 'action' | 'knowledge' | 'communication';
  confidenceThreshold: number; // 0.0 to 1.0
  costPerCall: number; // En crédits internes
}

export interface A2AProtocolMessage {
  conversationId: string;
  senderAgentId: string;
  receiverAgentId: string;
  intent: string;
  payload: any;
  contextVector?: number[]; // Embedding du contexte pour récupération rapide
  timestamp: number;
  signature: string; // Signature cryptographique pour non-répudiation
}

export interface AutonomousAgentConfig {
  id: string;
  role: AgentRole;
  persona: {
    name: string;
    tone: 'professional' | 'empathetic' | 'assertive' | 'concise';
    bioProfile?: BioSignature; // Lien vers le pilier Mémoire Vivante
  };
  capabilities: AgentCapability[];
  permissions: string[]; // Scopes RBAC
  autoNegotiationEnabled: boolean; // Peut négocier avec d'autres agents sans humain
  budgetLimit: {
    daily: number;
    perTask: number;
    currency: 'credits' | 'USD' | 'EUR';
  };
}

export interface AgentNegotiationResult {
  agreementReached: boolean;
  taskDistribution: Record<string, string>; // AgentID -> TaskDescription
  estimatedCompletionTime: number;
  totalEstimatedCost: number;
}

// ============================================================================
// PILIER 2: MÉMOIRE VIVANTE (Jumeau Numérique Cognitif)
// ============================================================================

export interface BioSignature {
  // Données psychographiques et comportementales (anonymisées et sécurisées)
  cognitiveStyle: 'analytical' | 'creative' | 'pragmatic' | 'social';
  emotionalBaseline: {
    valence: number; // -1 (négatif) à 1 (positif)
    arousal: number; // 0 (calme) à 1 (excité)
  };
  communicationPreferences: {
    verbosity: 'low' | 'medium' | 'high';
    preferredChannels: ('whatsapp' | 'email' | 'voice' | 'dashboard')[];
    responseTimeExpectation: 'immediate' | 'fast' | 'relaxed';
  };
  values: string[]; // Ex: ['sustainability', 'innovation', 'security']
  lastUpdated: number;
  consentVersion: string;
}

export interface CognitiveMemoryNode {
  id: string;
  type: 'episodic' | 'semantic' | 'procedural' | 'bio-emotional';
  content: any;
  vectorEmbedding: number[];
  graphRelations: string[]; // IDs des nœuds connectés dans le GraphRAG
  decayRate: number; // Vitesse d'oubli (pour nettoyage auto)
  accessLevel: 'public' | 'private' | 'encrypted';
  ownerId: string; // Tenant ou User ID
}

export interface LivingMemoryContext {
  userId: string;
  shortTerm: CognitiveMemoryNode[]; // Fenêtre contextuelle immédiate
  longTermSummary: string; // Résumé généré par IA
  bioState: BioSignature;
  retrievedKnowledge: any[]; // Résultats GraphRAG
  emotionalTrajectory: number[]; // Historique récent de l'humeur
}

// ============================================================================
// PILIER 3: SOUVERAINETÉ BYOC (Bring Your Own Cloud)
// ============================================================================

export type DataResidencyZone = 'EU-West' | 'US-East' | 'APAC-SG' | 'Local-OnPrem' | 'Decentralized-IPFS';

export interface BYOCConfig {
  provider: 'aws' | 'azure' | 'gcp' | 'onprem' | 'ipfs';
  region: string;
  encryptionKeyManagement: 'customer-managed' | 'whatsmaster-managed' | 'hsm';
  dataResidency: DataResidencyZone;
  backupStrategy: {
    frequency: 'hourly' | 'daily' | 'realtime';
    immutable: boolean; // WORM compliance
    geoRedundant: boolean;
  };
  sovereignShield: {
    enabled: boolean;
    blockForeignAccess: boolean; // Bloque accès hors zone de résidence
    auditLogLocation: string; // URL du stockage des logs d'audit indépendant
  };
}

export interface DecentralizedIdentity {
  did: string; // Decentralized Identifier (W3C Standard)
  verifiableCredentials: string[]; // JWTs signés
  publicKey: string;
  controller: string;
}

// ============================================================================
// PILIER 4: IA RESPONSABLE & FINOPS (Green & Cost Aware)
// ============================================================================

export type ModelTier = 'economy' | 'balanced' | 'premium' | 'specialized';

export interface CarbonFootprintMetrics {
  co2GramsPerToken: number;
  energyKWh: number;
  waterLiters: number; // Refroidissement datacenter
  offsetStatus: 'pending' | 'purchased' | 'verified';
}

export interface RoutingPolicy {
  id: string;
  name: string;
  conditions: {
    maxCostPerRequest?: number;
    maxLatencyMs?: number;
    maxCarbonIntensity?: number; // gCO2eq/kWh
    requiredAccuracy?: number;
    dataSensitivity?: 'low' | 'medium' | 'high' | 'critical';
  };
  action: {
    preferredModels: string[];
    fallbackStrategy: 'cascade' | 'fail-fast' | 'human-handover';
    cachingEnabled: boolean;
    compressionEnabled: boolean;
  };
}

export interface FinOpsDashboardData {
  totalSpend: number;
  spendByModel: Record<string, number>;
  spendByTenant: Record<string, number>;
  projectedMonthEnd: number;
  savingsOpportunities: Array<{
    recommendation: string;
    estimatedSaving: number;
    effort: 'low' | 'medium' | 'high';
  }>;
  carbonScore: number; // 0-100 (100 = neutre)
}

// ============================================================================
// PILIER 5: MARKETPLACE MÉTIER (Theme-Plugins)
// ============================================================================

export interface ThemePluginManifest {
  id: string;
  name: string;
  version: string;
  vendor: {
    name: string;
    verified: boolean;
    contact: string;
  };
  description: string;
  categories: string[];
  pricing: {
    model: 'free' | 'subscription' | 'usage-based' | 'enterprise';
    amount?: number;
    currency?: string;
    trialDays?: number;
  };
  compatibility: {
    minOsVersion: string;
    requiredCapabilities: string[];
  };
  securityAudit: {
    status: 'passed' | 'pending' | 'failed';
    date: string;
    auditor: string;
    reportUrl?: string;
  };
}

export interface ThemePluginBundle {
  manifest: ThemePluginManifest;
  branding: any; // Voir theme-plugin.ts
  dashboard: any;
  workflows: any;
  copilot: any;
  connectors: any;
  permissions: any;
  
  // Nouveau: Installation autonome
  installHook: (context: InstallationContext) => Promise<void>;
  uninstallHook: (context: InstallationContext) => Promise<void>;
  healthCheck: () => Promise<HealthStatus>;
}

export interface InstallationContext {
  tenantId: string;
  byocConfig: BYOCConfig;
  existingAgents: AutonomousAgentConfig[];
  memoryStore: any;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Array<{
    name: string;
    passed: boolean;
    message?: string;
  }>;
  latencyMs: number;
  lastChecked: number;
}

// ============================================================================
// CORE OS INTERFACES
// ============================================================================

export interface AutonomousOSConfig {
  agentic: {
    maxConcurrentAgents: number;
    negotiationTimeoutMs: number;
    a2aProtocolVersion: 'v1.0';
  };
  memory: {
    vectorDimension: number;
    retentionDays: number;
    bioIntegrationEnabled: boolean;
  };
  sovereignty: {
    defaultBYOC: BYOCConfig;
    enforceDataResidency: boolean;
  };
  greenFinops: {
    defaultRoutingPolicy: string;
    carbonBudgetMonthly: number; // Tonnes CO2
    costBudgetMonthly: number;
  };
  marketplace: {
    allowThirdPartyPlugins: boolean;
    requireSecurityAudit: boolean;
  };
}

export interface IAutonomousOS {
  // Gestion des Agents
  spawnAgent(config: AutonomousAgentConfig): Promise<string>;
  terminateAgent(agentId: string): Promise<void>;
  negotiateTask(task: string, availableAgents: string[]): Promise<AgentNegotiationResult>;
  
  // Gestion de la Mémoire
  getLivingContext(userId: string): Promise<LivingMemoryContext>;
  storeMemory(node: CognitiveMemoryNode): Promise<void>;
  updateBioSignature(userId: string, updates: Partial<BioSignature>): Promise<void>;
  
  // Souveraineté
  provisionBYOC(config: BYOCConfig): Promise<DecentralizedIdentity>;
  rotateEncryptionKeys(tenantId: string): Promise<void>;
  
  // FinOps & Green
  routeRequest(prompt: string, policyId: string): Promise<{ model: string; cost: number; carbon: number }>;
  getFinOpsDashboard(tenantId: string): Promise<FinOpsDashboardData>;
  
  // Marketplace
  installPlugin(plugin: ThemePluginBundle): Promise<void>;
  listAvailablePlugins(): Promise<ThemePluginManifest[]>;
}
