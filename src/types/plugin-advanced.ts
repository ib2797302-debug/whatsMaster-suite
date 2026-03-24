/**
 * Types partagés pour les plugins avancés WhatsMaster Suite
 * Intégrant Edge Computing, Federated Learning, Graph Neural Networks
 */

// ==================== RAG HYBRIDE ====================

export interface HybridRAGConfig {
  tenantId: string;
  edgeModelPath: string;
  cloudProvider: 'openai' | 'anthropic' | 'google';
  similarityThreshold: number;
  cacheTTL: number;
  fallbackEnabled: boolean;
}

export interface IntentClassification {
  intent: string;
  confidence: number;
  requiresLLM: boolean;
  context?: Record<string, any>;
}

export interface SemanticCacheEntry {
  queryVector: number[];
  response: string;
  timestamp: number;
  hitCount: number;
}

export interface HybridRAGResponse {
  answer: string;
  source: 'edge' | 'cache' | 'cloud';
  confidence: number;
  latency: number;
  sources?: DocumentReference[];
}

// ==================== GRAPH RAG ====================

export interface GraphNode {
  id: string;
  labels: string[];
  properties: Record<string, any>;
}

export interface GraphRelationship {
  startNodeId: string;
  endNodeId: string;
  type: string;
  properties: Record<string, any>;
}

export interface KnowledgeGraphConfig {
  neo4jUri: string;
  username: string;
  password: string;
  database: string;
  vectorIndexName: string;
  embeddingDimension: number;
}

export interface GraphQueryResult {
  nodes: GraphNode[];
  relationships: GraphRelationship[];
  paths: Array<Array<GraphNode>>;
  explanations: string[];
}

export interface EntityExtraction {
  entities: Array<{
    text: string;
    type: 'PERSON' | 'ORGANIZATION' | 'PRODUCT' | 'LOCATION' | 'DATE';
    confidence: number;
    linkedNodeId?: string;
  }>;
  relations: Array<{
    from: string;
    to: string;
    type: string;
    confidence: number;
  }>;
}

// ==================== TEXT-TO-WORKFLOW ====================

export type WorkflowActionType = 
  | 'send_message'
  | 'assign_agent'
  | 'add_tag'
  | 'send_email'
  | 'create_task'
  | 'wait'
  | 'condition'
  | 'http_request'
  | 'update_contact';

export interface WorkflowNode {
  id: string;
  type: WorkflowActionType;
  config: Record<string, any>;
  position: { x: number; y: number };
  metadata?: {
    createdAt: string;
    createdBy: string;
    aiGenerated?: boolean;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  condition?: string;
  label?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'message_received' | 'event' | 'schedule';
    conditions: Record<string, any>;
  };
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  variables: Record<string, any>;
  metadata: {
    version: string;
    createdAt: string;
    updatedAt: string;
    aiPrompt?: string;
  };
}

export interface WorkflowValidationResult {
  isValid: boolean;
  errors: Array<{
    node?: string;
    edge?: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
  suggestions?: string[];
}

export interface TextToWorkflowRequest {
  tenantId: string;
  prompt: string;
  context?: {
    existingWorkflows?: string[];
    availableActions?: WorkflowActionType[];
    constraints?: Record<string, any>;
  };
}

export interface TextToWorkflowResponse {
  workflow: WorkflowDefinition;
  validation: WorkflowValidationResult;
  explanation: string;
  estimatedExecutionTime?: number;
}

// ==================== FINOPS TRACKER ====================

export type CostCategory = 
  | 'llm_api'
  | 'storage'
  | 'bandwidth'
  | 'compute'
  | 'external_api'
  | 'database';

export interface CostEntry {
  id: string;
  tenantId: string;
  timestamp: Date;
  category: CostCategory;
  service: string;
  action: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  metadata: Record<string, any>;
  tags: string[];
}

export interface BudgetConfig {
  tenantId: string;
  period: 'daily' | 'weekly' | 'monthly';
  limit: number;
  currency: string;
  alerts: Array<{
    threshold: number; // percentage
    recipients: string[];
    channels: ('email' | 'slack' | 'webhook')[];
  }>;
}

export interface CostForecast {
  period: string;
  predictedCost: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  anomalies: Array<{
    date: string;
    expected: number;
    actual: number;
    deviation: number;
    cause?: string;
  }>;
  recommendations: Array<{
    type: 'cost_reduction' | 'performance' | 'architecture';
    description: string;
    estimatedSavings: number;
    implementationEffort: 'low' | 'medium' | 'high';
  }>;
}

export interface CostBreakdown {
  byCategory: Record<CostCategory, number>;
  byService: Record<string, number>;
  byConversation?: Record<string, number>;
  byCampaign?: Record<string, number>;
  total: number;
  period: {
    start: Date;
    end: Date;
  };
}

export interface FinOpsAlert {
  id: string;
  tenantId: string;
  type: 'budget_threshold' | 'anomaly' | 'forecast_exceeded';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  details: {
    currentCost: number;
    budget: number;
    percentage: number;
    projectedOverrun?: number;
  };
  timestamp: Date;
  acknowledged?: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

// ==================== FEDERATED LEARNING ====================

export interface FederatedLearningConfig {
  tenantId: string;
  modelType: 'intent_classification' | 'sentiment_analysis' | 'entity_extraction';
  participationEnabled: boolean;
  localDataRetentionDays: number;
  aggregationServer: string;
  encryptionKey: string;
}

export interface ModelUpdate {
  modelId: string;
  version: string;
  weights: number[][];
  gradients?: number[][];
  sampleCount: number;
  lossMetric: number;
  timestamp: Date;
  tenantId: string;
}

export interface AggregatedModel {
  modelId: string;
  version: string;
  weights: number[][];
  participatingTenants: number;
  totalSamples: number;
  aggregatedAt: Date;
  performanceMetrics: {
    accuracy: number;
    f1Score: number;
    latency: number;
  };
}

// ==================== EDGE COMPUTING ====================

export interface EdgeDeploymentConfig {
  modelPath: string;
  runtime: 'onnx' | 'tensorflow-lite' | 'pytorch-mobile';
  maxMemoryMB: number;
  threads: number;
  fallbackToCloud: boolean;
}

export interface EdgeInferenceResult {
  prediction: any;
  confidence: number;
  executionTimeMs: number;
  device: 'cpu' | 'gpu' | 'npus';
  memoryUsedMB: number;
}

export interface EdgeHealthStatus {
  isHealthy: boolean;
  modelLoaded: boolean;
  lastInference: Date | null;
  averageLatency: number;
  errorRate: number;
  memoryUsage: number;
}

// ==================== UTILITIES ====================

export interface PluginContext {
  tenantId: string;
  userId?: string;
  requestId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface PerformanceMetrics {
  latencyP50: number;
  latencyP95: number;
  latencyP99: number;
  successRate: number;
  errorRate: number;
  throughput: number; // requests per second
}

export interface DocumentReference {
  id: string;
  type: 'document' | 'faq' | 'conversation' | 'knowledge_base';
  title: string;
  chunkId: string;
  similarity: number;
  url?: string;
}
