/**
 * Types pour les Theme-Plugins Métier WhatsMaster Suite
 * 
 * ARCHITECTURE INDÉPENDANTE - Inspirée des leaders mondiaux (Salesforce, SAP, Oracle, Microsoft)
 * 
 * Chaque theme-plugin est un module AUTONOME et AUTO-CONTENU qui :
 * - Fonctionne SANS dépendance aux plugins existants
 * - Embarque TOUTES ses dépendances métier (UI, KPI, workflows, IA, connecteurs, permissions)
 * - Peut être activé/désactivé indépendamment
 * - Est portable entre différents environnements
 * - Suit les standards enterprise (ISO 27001, SOC2, RGPD ready)
 * 
 * Un theme-plugin embarque 6 packs :
 * - Branding Pack : identité visuelle et tonale
 * - Dashboard Pack : KPI et widgets par rôle
 * - Workflow Pack : automatisations métier
 * - Copilot Pack : prompts et policies IA
 * - Connector Pack : intégrations externes
 * - Permissions Pack : rôles et accès
 */

// ==================== TYPES COMMUNS ====================

export type ThemeCategory = 
  | 'support'
  | 'commerce'
  | 'sales'
  | 'customer_success'
  | 'compliance'
  | 'voice_operations'
  | 'personalization'
  | 'finops'
  | 'agentic'
  | 'franchise';

export type PackType = 
  | 'branding'
  | 'dashboard'
  | 'workflow'
  | 'copilot'
  | 'connector'
  | 'permissions';

/**
 * Manifeste du plugin - Métadonnées complètes
 * Inspiré de Salesforce AppExchange et Microsoft AppSource
 */
export interface ThemePluginManifest {
  /** Identifiant unique global (format: com.company.theme.name) */
  id: string;
  
  /** Nom commercial du thème */
  name: string;
  
  /** Version sémantique (SemVer 2.0) */
  version: string;
  
  /** Catégorie métier principale */
  category: ThemeCategory;
  
  /** Description détaillée pour l'utilisateur final */
  description: string;
  
  /** Éditeur du plugin */
  vendor: {
    name: string;
    url: string;
    supportEmail: string;
    certification?: 'verified' | 'partner' | 'community';
  };
  
  /** Dates de cycle de vie */
  lifecycle: {
    createdAt: Date;
    updatedAt: Date;
    deprecatedAt?: Date;
    endOfLife?: Date;
  };
  
  /** Packs inclus avec versions */
  packs: Array<{
    type: PackType;
    version: string;
    size: number; // en KB
    hash: string; // integrity check
  }>;
  
  /** Dépendances optionnelles (plugins existants) */
  optionalDependencies?: Array<{
    pluginId: string;
    minVersion: string;
    feature: string;
    fallback?: any;
  }>;
  
  /** Compatibilité plateforme */
  compatibility: {
    minPlatformVersion: string;
    maxPlatformVersion?: string;
    requiredFeatures: string[];
    supportedRegions: string[];
    supportedLanguages: string[];
  };
  
  /** Conformité et certifications */
  compliance: {
    gdprReady: boolean;
    soc2Compliant: boolean;
    iso27001Compliant: boolean;
    hipaaCompliant?: boolean;
    dataResidency: string[];
  };
  
  /** Licence et pricing */
  licensing: {
    type: 'proprietary' | 'open_source' | 'freemium';
    model: 'per_user' | 'per_tenant' | 'usage_based' | 'flat_rate';
    price?: {
      amount: number;
      currency: string;
      period: 'monthly' | 'yearly' | 'one_time';
    };
    trialDays?: number;
  };
}

// ==================== BRANDING PACK ====================

export type ToneOfVoice = 'formal' | 'friendly' | 'technical' | 'empathetic' | 'assertive' | 'consultative';
export type VisualTheme = 'minimal' | 'detailed' | 'visual' | 'professional' | 'boutique' | 'luxury';

/**
 * Branding Pack - Identité visuelle et tonale complète
 * Inspiré de Salesforce Lightning Design System et Microsoft Fluent UI
 */
export interface BrandingPack {
  packType: 'branding';
  version: string;
  
  /** Identité visuelle complète */
  visualIdentity: {
    /** Palette de couleurs avec support dark/light mode */
    colors: {
      primary: ColorDefinition;
      secondary: ColorDefinition;
      accent: ColorDefinition;
      neutral: ColorScale;
      semantic: SemanticColors;
    };
    
    /** Typographie responsive */
    typography: {
      fontFamily: string;
      headingFont?: string;
      monospaceFont?: string;
      sizes: TypeScale;
      weights: FontWeight[];
      lineHeights: LineHeightScale;
    };
    
    /** Iconographie cohérente */
    iconography: {
      style: 'outline' | 'filled' | 'duotone' | '3d';
      size: 'small' | 'medium' | 'large';
      library?: string;
      customIcons?: CustomIcon[];
    };
    
    /** Logos et assets */
    assets: {
      logo: LogoSet;
      favicon?: string;
      splashScreen?: string;
      emailHeader?: string;
    };
  };

  /** Tonalité et voix de la marque */
  toneAndVoice: {
    tone: ToneOfVoice;
    formality: 'casual' | 'neutral' | 'formal';
    verbosity: 'concise' | 'balanced' | 'detailed';
    personality: string[];
    forbiddenWords?: string[];
    preferredPhrases?: Record<string, string>;
    writingGuidelines: WritingGuideline[];
  };

  /** Templates de réponses pré-configurés */
  responseTemplates: Record<string, ResponseTemplate>;
  
  /** Localisation et internationalisation */
  localization: {
    defaultLanguage: string;
    supportedLanguages: string[];
    regionalFormats: RegionalFormat;
    translations?: Record<string, TranslationFile>;
  };
  
  /** Accessibilité (WCAG 2.1 AA minimum) */
  accessibility: {
    wcagLevel: 'A' | 'AA' | 'AAA';
    highContrastMode: boolean;
    reducedMotionSupport: boolean;
    screenReaderOptimized: boolean;
    keyboardNavigation: boolean;
  };
}

export interface ColorDefinition {
  light: string;      // HEX/RGB pour mode clair
  dark: string;       // HEX/RGB pour mode sombre
  hsl?: { h: number; s: number; l: number };
  rgb?: { r: number; g: number; b: number };
}

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface SemanticColors {
  success: ColorDefinition;
  warning: ColorDefinition;
  error: ColorDefinition;
  info: ColorDefinition;
  link: ColorDefinition;
}

export interface TypeScale {
  xs: number;   // 12px
  sm: number;   // 14px
  base: number; // 16px
  lg: number;   // 18px
  xl: number;   // 20px
  '2xl': number; // 24px
  '3xl': number; // 30px
  '4xl': number; // 36px
}

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export interface LineHeightScale {
  tight: number;
  normal: number;
  relaxed: number;
  loose: number;
}

export interface CustomIcon {
  name: string;
  svg: string;
  viewBox: string;
  category: string;
  tags: string[];
}

export interface LogoSet {
  primary: string;
  primaryDark?: string;
  secondary?: string;
  mark?: string;
  wordmark?: string;
}

export interface WritingGuideline {
  rule: string;
  description: string;
  examples: { good: string; bad: string }[];
}

export interface RegionalFormat {
  date: string;
  time: string;
  dateTime?: string;
  currency: string;
  number: string;
  timeZone?: string;
}

export interface TranslationFile {
  locale: string;
  strings: Record<string, string>;
  pluralRules?: Record<string, string>;
}

export interface ResponseTemplate {
  id: string;
  name: string;
  content: string;
  variables?: string[];
  conditions?: Record<string, any>;
  channels?: ('whatsapp' | 'email' | 'sms' | 'voice')[];
  localization?: Record<string, string>;
}

// ==================== DASHBOARD PACK ====================

/**
 * Dashboard Pack - Tableaux de bord métier par rôle
 * Inspiré de Salesforce Einstein Analytics et Microsoft Power BI
 */

export type WidgetType = 
  | 'kpi_card'
  | 'chart_line'
  | 'chart_bar'
  | 'chart_pie'
  | 'data_table'
  | 'list'
  | 'heatmap'
  | 'gauge'
  | 'funnel'
  | 'timeline'
  | 'map'
  | 'scatter'
  | 'treemap'
  | 'sankey';

export type KPIMetric = 
  | 'responseTime'
  | 'resolutionRate'
  | 'csat'
  | 'nps'
  | 'escalationRate'
  | 'conversionRate'
  | 'averageOrderValue'
  | 'cartAbandonment'
  | 'leadResponseTime'
  | 'qualificationRate'
  | 'churnRate'
  | 'costPerTicket'
  | 'revenue'
  | 'activeUsers'
  | 'monthlyRecurringRevenue'
  | 'customerLifetimeValue'
  | 'netPromoterScore'
  | 'firstContactResolution'
  | 'averageHandleTime';

export interface DashboardRole {
  roleId: string;
  name: string;
  description: string;
  dashboards: DashboardConfig[];
  defaultDashboard?: string;
}

export interface DashboardConfig {
  id: string;
  name: string;
  description?: string;
  layout: 'grid' | 'list' | 'canvas' | 'responsive';
  refreshInterval: number;
  widgets: WidgetConfig[];
  filters?: FilterConfig[];
  drillDownPaths?: DrillDownPath[];
  exportFormats?: ('pdf' | 'csv' | 'xlsx' | 'png')[];
  sharing?: DashboardSharing;
}

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  position: GridPosition;
  size: WidgetSize;
  dataSource: DataSourceConfig;
  visualization: VisualizationConfig;
  interactions?: WidgetInteraction[];
  alerts?: AlertThreshold[];
  caching?: CacheConfig;
}

export interface GridPosition {
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface WidgetSize {
  width: 'small' | 'medium' | 'large' | 'full';
  height: 'compact' | 'normal' | 'tall' | 'auto';
}

export interface DataSourceConfig {
  type: 'api' | 'websocket' | 'query' | 'stream' | 'embedded';
  endpoint?: string;
  query?: string;
  parameters?: Record<string, any>;
  transformation?: string;
  authentication?: AuthRequirement;
  polling?: PollingConfig;
}

export interface AuthRequirement {
  required: boolean;
  type?: 'oauth2' | 'api_key' | 'jwt';
  scopes?: string[];
}

export interface PollingConfig {
  enabled: boolean;
  intervalMs: number;
  backoffOnFailure?: boolean;
  maxRetries?: number;
}

export interface VisualizationConfig {
  chartType?: string;
  colorScheme?: string[];
  showLegend?: boolean;
  showTooltip?: boolean;
  animation?: boolean;
  responsive?: boolean;
  customConfig?: Record<string, any>;
  formatting?: FormattingRules;
}

export interface FormattingRules {
  number?: NumberFormat;
  currency?: CurrencyFormat;
  percentage?: PercentageFormat;
  date?: DateFormat;
}

export interface NumberFormat {
  decimalPlaces: number;
  thousandSeparator: boolean;
  prefix?: string;
  suffix?: string;
}

export interface CurrencyFormat {
  currency: string;
  locale: string;
  displaySymbol: 'symbol' | 'code' | 'name';
}

export interface PercentageFormat {
  decimalPlaces: number;
  multiplyBy100: boolean;
  suffix?: string;
}

export interface DateFormat {
  format: string;
  timezone?: string;
  relative?: boolean;
}

export interface WidgetInteraction {
  type: 'click' | 'hover' | 'filter' | 'drilldown' | 'export';
  action: string;
  target?: string;
  parameters?: Record<string, any>;
}

export interface AlertThreshold {
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'between';
  value: number | [number, number];
  severity: 'info' | 'warning' | 'critical';
  notificationChannels?: string[];
  cooldownMinutes?: number;
  customMessage?: string;
}

export interface FilterConfig {
  id: string;
  type: 'dropdown' | 'multiselect' | 'date_range' | 'search' | 'toggle' | 'slider';
  label: string;
  field: string;
  defaultValue?: any;
  options?: Array<{ value: any; label: string }>;
  dynamicOptions?: boolean;
  multiSelect?: boolean;
  searchable?: boolean;
}

export interface DrillDownPath {
  fromWidget: string;
  toDashboard: string;
  parameterMapping: Record<string, string>;
}

export interface DashboardSharing {
  public: boolean;
  roles?: string[];
  users?: string[];
  embeddable?: boolean;
  downloadAllowed?: boolean;
}

export interface CacheConfig {
  enabled: boolean;
  ttlSeconds: number;
  staleWhileRevalidate?: boolean;
  invalidateOn?: string[];
}

export interface DashboardPack {
  packType: 'dashboard';
  version: string;
  
  roles: DashboardRole[];
  sharedWidgets: WidgetConfig[];
  globalFilters: FilterConfig[];
  themes?: DashboardTheme[];
}

export interface DashboardTheme {
  id: string;
  name: string;
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing: Record<string, number>;
}

// ==================== WORKFLOW PACK ====================

/**
 * Workflow Pack - Automatisations métier prêtes à l'emploi
 * Inspiré de Salesforce Flow, Microsoft Power Automate et Zapier Enterprise
 */

export interface WorkflowPack {
  packType: 'workflow';
  version: string;
  
  workflows: WorkflowDefinition[];
  triggers: TriggerDefinition[];
  actions: ActionDefinition[];
  templates: WorkflowTemplate[];
  variables: GlobalVariable[];
  errorHandlers: ErrorHandlerConfig[];
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  triggerId: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  variables: WorkflowVariable[];
  settings: WorkflowSettings;
  metadata: WorkflowMetadata;
  executionStats?: ExecutionStatistics;
}

export interface WorkflowSettings {
  maxExecutions?: number;
  timeout?: number;
  retryPolicy?: RetryPolicy;
  logging: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  concurrency?: number;
  queuePriority?: 'low' | 'normal' | 'high';
  notifications?: NotificationConfig;
}

export interface NotificationConfig {
  onSuccess?: boolean;
  onFailure?: boolean;
  channels?: ('email' | 'slack' | 'webhook' | 'sms')[];
  recipients?: string[];
}

export interface WorkflowMetadata {
  author: string;
  tags: string[];
  icon?: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
  documentationUrl?: string;
  supportEmail?: string;
}

export interface ExecutionStatistics {
  totalRuns: number;
  successRate: number;
  averageDurationMs: number;
  lastRunAt?: Date;
  lastError?: string;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  description?: string;
  actionType?: string;
  config: Record<string, any>;
  position?: GridPosition;
  inputMapping?: InputMapping[];
  outputMapping?: OutputMapping[];
  conditions?: NodeCondition[];
  timeout?: number;
  retryCount?: number;
}

export type NodeType = 
  | 'trigger'
  | 'action'
  | 'condition'
  | 'switch'
  | 'delay'
  | 'loop'
  | 'parallel'
  | 'subworkflow'
  | 'script'
  | 'api_call'
  | 'data_transform'
  | 'approval'
  | 'notification'
  | 'end';

export interface InputMapping {
  sourceField: string;
  targetField: string;
  transformation?: string;
  required?: boolean;
}

export interface OutputMapping {
  sourceField: string;
  targetVariable: string;
  transformation?: string;
}

export interface NodeCondition {
  expression: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'regex';
  value?: any;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  condition?: string;
  label?: string;
  order?: number;
}

export interface WorkflowVariable {
  name: string;
  type: VariableType;
  defaultValue?: any;
  scope: 'global' | 'workflow' | 'node';
  description?: string;
  isSecret?: boolean;
}

export type VariableType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'date'
  | 'json';

export interface GlobalVariable {
  name: string;
  type: VariableType;
  value: any;
  description?: string;
  encrypted?: boolean;
}

export interface TriggerDefinition {
  id: string;
  name: string;
  type: TriggerType;
  description?: string;
  config: Record<string, any>;
  filters?: TriggerFilter[];
  debounce?: DebounceConfig;
  throttle?: ThrottleConfig;
}

export type TriggerType = 
  | 'event'
  | 'schedule'
  | 'webhook'
  | 'manual'
  | 'api'
  | 'message'
  | 'file_upload'
  | 'form_submission';

export interface TriggerFilter {
  field: string;
  operator: string;
  value: any;
}

export interface DebounceConfig {
  enabled: boolean;
  waitMs: number;
  leading?: boolean;
  trailing?: boolean;
}

export interface ThrottleConfig {
  enabled: boolean;
  limit: number;
  periodMs: number;
}

export interface ActionDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  icon?: string;
  inputSchema: JSONSchema;
  outputSchema: JSONSchema;
  handler: string;
  async?: boolean;
  requiresAuth?: boolean;
  rateLimit?: RateLimitConfig;
}

export interface JSONSchema {
  type: string;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface SchemaProperty {
  type: string;
  description?: string;
  default?: any;
  enum?: any[];
  format?: string;
  pattern?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  items?: SchemaProperty;
  properties?: Record<string, SchemaProperty>;
}

export interface RateLimitConfig {
  requests: number;
  period: 'second' | 'minute' | 'hour' | 'day';
  strategy: 'drop' | 'queue' | 'reject';
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  useCase: string;
  workflowIds: string[];
  estimatedSetupTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  videoTutorialUrl?: string;
  documentationUrl?: string;
}

export interface RetryPolicy {
  maxRetries: number;
  backoff: BackoffStrategy;
  delayMs: number;
  maxDelayMs?: number;
  retryableErrors?: string[];
  onMaxRetriesExceeded?: 'fail' | 'notify' | 'escalate';
}

export type BackoffStrategy = 'linear' | 'exponential' | 'fixed' | 'fibonacci';

export interface ErrorHandlerConfig {
  id: string;
  name: string;
  errorPatterns: string[];
  handler: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  autoResolve?: boolean;
  escalationPath?: string[];
}

// ==================== COPILOT PACK ====================

/**
 * Copilot Pack - IA conversationnelle et assistance intelligente
 * Inspiré de GitHub Copilot, Salesforce Einstein GPT et Microsoft 365 Copilot
 */

export interface CopilotPack {
  packType: 'copilot';
  version: string;
  
  prompts: PromptLibrary;
  promptChains: PromptChain[];
  graphRAGPolicies: GraphRAGPolicy;
  llmRouting: LLMRoutingConfig;
  intentDetection: IntentDetectionConfig;
  conversationHandlers: ConversationHandler[];
  knowledgeBases: KnowledgeBaseConfig[];
  responseGeneration: ResponseGenerationConfig;
  safetyFilters: SafetyFilterConfig[];
}

export interface PromptLibrary {
  [category: string]: {
    [name: string]: PromptDefinition;
  };
}

export interface PromptDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  template: string;
  variables: string[];
  model?: string;
  provider?: LLMProvider;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
  examples?: PromptExample[];
  fewShotExamples?: FewShotExample[];
  outputSchema?: JSONSchema;
  validationRules?: ValidationRule[];
}

export type LLMProvider = 'openai' | 'anthropic' | 'google' | 'azure' | 'local' | 'custom';

export interface PromptExample {
  input: Record<string, any>;
  output: string;
  explanation?: string;
  rating?: number;
}

export interface FewShotExample {
  input: string;
  output: string;
  context?: string;
}

export interface PromptChain {
  id: string;
  name: string;
  description: string;
  steps: PromptChainStep[];
  outputVariable: string;
  errorHandling?: 'stop' | 'continue' | 'fallback';
}

export interface PromptChainStep {
  order: number;
  promptId: string;
  inputMapping: Record<string, string>;
  outputVariable?: string;
  condition?: string;
}

export interface ValidationRule {
  type: 'regex' | 'json' | 'length' | 'enum' | 'custom';
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  allowedValues?: any[];
  customFn?: string;
  errorMessage?: string;
}

export interface GraphRAGPolicy {
  enabled: boolean;
  entityTypes: string[];
  relationshipTypes: string[];
  confidenceThreshold: number;
  maxHops: number;
  fallbackToVector: boolean;
  cacheResults: boolean;
  cacheTTL?: number;
  queryTemplates?: GraphQueryTemplate[];
}

export interface GraphQueryTemplate {
  name: string;
  query: string;
  parameters: string[];
  resultMapping: Record<string, string>;
}

export interface LLMRoutingConfig {
  defaultProvider: LLMProvider;
  routingRules: RoutingRule[];
  fallbackChain: string[];
  loadBalancing: LoadBalanceStrategy;
  circuitBreaker?: CircuitBreakerConfig;
  costOptimization?: CostOptimizationConfig;
}

export type LoadBalanceStrategy = 'round_robin' | 'least_loaded' | 'weighted' | 'latency_based';

export interface RoutingRule {
  condition: string;
  provider: string;
  model: string;
  priority: number;
  weight?: number;
}

export interface CircuitBreakerConfig {
  enabled: boolean;
  failureThreshold: number;
  resetTimeoutMs: number;
  halfOpenRequests: number;
}

export interface CostOptimizationConfig {
  enabled: boolean;
  maxCostPerRequest: number;
  preferCheaperModels: boolean;
  budgetLimitPerDay?: number;
}

export interface IntentDetectionConfig {
  enabled: boolean;
  model: IntentModelType;
  confidenceThreshold: number;
  intents: IntentDefinition[];
  fallbackIntent?: string;
  multiIntentSupport: boolean;
  contextWindow?: number;
}

export type IntentModelType = 'onnx' | 'llm' | 'hybrid' | 'rule_based';

export interface IntentDefinition {
  id: string;
  name: string;
  description: string;
  examples: string[];
  negativeExamples?: string[];
  handler?: string;
  requiresConfirmation?: boolean;
  slots?: SlotDefinition[];
  confidenceThreshold?: number;
}

export interface SlotDefinition {
  name: string;
  type: string;
  required: boolean;
  prompt?: string;
  validation?: string;
}

export interface ConversationHandler {
  pattern: string;
  handler: string;
  priority: number;
  context?: Record<string, any>;
  ttl?: number;
}

export interface KnowledgeBaseConfig {
  id: string;
  name: string;
  description?: string;
  type: 'vector' | 'graph' | 'hybrid' | 'keyword';
  sources: KnowledgeSource[];
  updateFrequency: UpdateFrequency;
  embeddingModel?: string;
  chunkSize?: number;
  chunkOverlap?: number;
  indexingStrategy?: IndexingStrategy;
}

export interface KnowledgeSource {
  type: 'file' | 'url' | 'database' | 'api' | 'manual';
  url?: string;
  filePath?: string;
  query?: string;
  credentials?: Record<string, string>;
  refreshPolicy?: RefreshPolicy;
}

export type UpdateFrequency = 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'manual';

export type IndexingStrategy = 'full' | 'incremental' | 'smart';

export interface RefreshPolicy {
  strategy: 'always' | 'if_modified' | 'never';
  checkIntervalMinutes?: number;
}

export interface ResponseGenerationConfig {
  maxTokens: number;
  temperature: number;
  style: ResponseStyle;
  includeSources: boolean;
  includeConfidence: boolean;
  fallbackResponses: FallbackResponse[];
}

export type ResponseStyle = 'concise' | 'detailed' | 'friendly' | 'professional' | 'technical';

export interface FallbackResponse {
  condition: string;
  response: string;
  escalateToHuman?: boolean;
}

export interface SafetyFilterConfig {
  id: string;
  name: string;
  enabled: boolean;
  filterType: SafetyFilterType;
  patterns: string[];
  action: 'block' | 'warn' | 'log' | 'rewrite';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export type SafetyFilterType = 'profanity' | 'pii' | 'sensitive_topic' | 'spam' | 'injection' | 'custom';

// ==================== CONNECTOR PACK ====================

export interface ConnectorPack {
  packType: 'connector';
  version: string;
  
  connectors: ExternalConnector[];
  webhooks: WebhookConfig[];
  apiMappings: APIMapping[];
  dataSync: DataSyncConfig[];
}

export interface ExternalConnector {
  id: string;
  name: string;
  category: 'crm' | 'erp' | 'payment' | 'identity' | 'communication' | 'analytics' | 'other';
  type: 'oauth2' | 'api_key' | 'basic_auth' | 'jwt' | 'webhook';
  baseUrl: string;
  authConfig: AuthConfig;
  endpoints: APIEndpoint[];
  rateLimit?: {
    requests: number;
    period: 'second' | 'minute' | 'hour' | 'day';
  };
  healthCheck?: {
    endpoint: string;
    interval: number;
  };
}

export interface AuthConfig {
  type: string;
  configUrl?: string;      // OAuth2 discovery
  tokenUrl?: string;
  authorizeUrl?: string;
  scopes?: string[];
  credentials?: Record<string, string>;
}

export interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  description: string;
  inputSchema?: Record<string, any>;
  outputSchema?: Record<string, any>;
  pagination?: PaginationConfig;
}

export interface PaginationConfig {
  type: 'offset' | 'cursor' | 'page';
  limitParam?: string;
  offsetParam?: string;
  cursorParam?: string;
  maxLimit?: number;
}

export interface WebhookConfig {
  id: string;
  name: string;
  events: string[];
  url: string;
  secret?: string;
  retryPolicy?: RetryPolicy;
  signatureValidation?: boolean;
}

export interface APIMapping {
  id: string;
  sourceField: string;
  targetField: string;
  transformation?: string;
  direction: 'inbound' | 'outbound' | 'bidirectional';
}

export interface DataSyncConfig {
  id: string;
  connectorId: string;
  entities: string[];
  direction: 'push' | 'pull' | 'sync';
  frequency: 'realtime' | 'interval' | 'manual';
  intervalMinutes?: number;
  conflictResolution: 'source_wins' | 'target_wins' | 'merge' | 'manual';
}

// ==================== PERMISSIONS PACK ====================

export interface PermissionsPack {
  packType: 'permissions';
  version: string;
  
  roles: RoleDefinition[];
  menus: MenuConfig[];
  permissions: PermissionDefinition[];
  policies: AccessPolicy[];
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  permissions: string[];  // Permission IDs
  inherits?: string[];    // Role IDs to inherit from
  isSystem?: boolean;
  isCustomizable?: boolean;
}

export interface MenuConfig {
  id: string;
  name: string;
  icon?: string;
  path?: string;
  order: number;
  children?: MenuConfig[];
  requiredPermissions?: string[];
  isVisible?: boolean;
}

export interface PermissionDefinition {
  id: string;
  name: string;
  description: string;
  resource: string;
  actions: string[];  // 'create', 'read', 'update', 'delete', 'execute'
  scope: 'global' | 'tenant' | 'team' | 'self';
  conditions?: string;  // JavaScript expression
}

export interface AccessPolicy {
  id: string;
  name: string;
  description: string;
  effect: 'allow' | 'deny';
  principals: string[];  // Role IDs or User IDs
  resources: string[];
  actions: string[];
  conditions?: Record<string, any>;
  priority: number;
}

// ==================== THEME PLUGIN COMPLET ====================

export interface ThemePlugin {
  manifest: ThemePluginManifest;
  branding?: BrandingPack;
  dashboard?: DashboardPack;
  workflow?: WorkflowPack;
  copilot?: CopilotPack;
  connector?: ConnectorPack;
  permissions?: PermissionsPack;
  
  // Runtime methods
  initialize?(context: PluginContext): Promise<void>;
  shutdown?(): Promise<void>;
  getHealth?(): PluginHealth;
}

export interface DashboardPack {
  packType: 'dashboard';
  version: string;
  
  roles: DashboardRole[];
  sharedWidgets: WidgetConfig[];
  globalFilters: FilterConfig[];
}

export interface PluginHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: HealthCheck[];
  lastChecked: Date;
}

export interface HealthCheck {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message?: string;
  details?: Record<string, any>;
}

// ==================== UTILITAIRES ====================

export interface PluginLoaderConfig {
  tenantId: string;
  enabledThemes: string[];
  customThemes?: ThemePlugin[];
  hotReload: boolean;
  debugMode: boolean;
}

export interface ThemeActivationResult {
  success: boolean;
  activatedPacks: PackType[];
  errors?: Array<{
    pack: PackType;
    message: string;
    details?: any;
  }>;
  warnings?: string[];
}
