/**
 * GREEN FINOPS ENGINE - COST & CARBON OPTIMIZATION
 * 
 * Moteur d'optimisation des coûts et de l'empreinte carbone de l'IA.
 * Routage intelligent vers les modèles selon le coût, la latence et l'impact environnemental.
 */

import {
  RoutingPolicy,
  FinOpsDashboardData,
  CarbonFootprintMetrics,
  ModelTier
} from '../types/autonomous-os';

export interface ModelInfo {
  id: string;
  name: string;
  tier: ModelTier;
  costPer1KTokens: number;
  avgLatencyMs: number;
  carbonIntensity: number; // gCO2eq per 1K tokens
  maxContextLength: number;
  capabilities: string[];
}

export class GreenFinOpsEngine {
  private policies: Map<string, RoutingPolicy>;
  private modelRegistry: Map<string, ModelInfo>;
  private usageData: Map<string, UsageRecord[]>;
  private carbonOffsets: Map<string, number>;

  constructor() {
    this.policies = new Map();
    this.modelRegistry = new Map();
    this.usageData = new Map();
    this.carbonOffsets = new Map();
    
    this.initializeModelRegistry();
    console.log('[FINOPS] Green FinOps Engine initialized');
  }

  /**
   * Route une requête vers le modèle optimal selon la policy
   * Équilibre coût, performance et impact carbone
   */
  async routeRequest(
    prompt: string,
    policyId: string,
    tenantId: string
  ): Promise<{ model: string; cost: number; carbon: number; latency: number }> {
    const policy = this.policies.get(policyId);
    if (!policy) {
      throw new Error(`Policy ${policyId} not found`);
    }

    const promptTokens = this.estimateTokens(prompt);
    
    // Filtrage des modèles éligibles selon les conditions
    const eligibleModels = this.filterEligibleModels(policy.conditions);

    if (eligibleModels.length === 0) {
      throw new Error('No models match the routing policy conditions');
    }

    // Score et classement des modèles
    const scoredModels = eligibleModels.map(model => ({
      model,
      score: this.calculateModelScore(model, policy, promptTokens)
    }));

    // Sélection du meilleur modèle
    const bestMatch = scoredModels.sort((a, b) => b.score - a.score)[0];
    const selectedModel = bestMatch.model;

    // Calcul des métriques
    const cost = (selectedModel.costPer1KTokens * promptTokens) / 1000;
    const carbon = (selectedModel.carbonIntensity * promptTokens) / 1000;
    const latency = selectedModel.avgLatencyMs;

    // Enregistrement de l'usage
    await this.recordUsage(tenantId, selectedModel.id, cost, carbon, promptTokens);

    console.log(`[FINOPS] Routed to ${selectedModel.name} | Cost: $${cost.toFixed(4)} | Carbon: ${carbon.toFixed(2)}g CO2`);

    return {
      model: selectedModel.id,
      cost,
      carbon,
      latency
    };
  }

  /**
   * Récupère le tableau de bord FinOps pour un tenant
   * Inclut dépenses, projections et opportunités d'économie
   */
  async getFinOpsDashboard(tenantId: string): Promise<FinOpsDashboardData> {
    const records = this.usageData.get(tenantId) || [];
    
    // Calcul des dépenses totales
    const totalSpend = records.reduce((sum, r) => sum + r.cost, 0);

    // Dépenses par modèle
    const spendByModel: Record<string, number> = {};
    for (const record of records) {
      spendByModel[record.modelId] = (spendByModel[record.modelId] || 0) + record.cost;
    }

    // Dépenses par tenant (ici un seul, mais prêt pour multi-tenant)
    const spendByTenant: Record<string, number> = { [tenantId]: totalSpend };

    // Projection fin de mois
    const daysElapsed = this.getDaysElapsed(records);
    const projectedMonthEnd = daysElapsed > 0 
      ? (totalSpend / daysElapsed) * 30 
      : totalSpend;

    // Opportunités d'économie
    const savingsOpportunities = this.identifySavingsOpportunities(tenantId, records);

    // Score carbone
    const totalCarbon = records.reduce((sum, r) => sum + r.carbonGrams, 0);
    const offsetPurchased = this.carbonOffsets.get(tenantId) || 0;
    const carbonScore = this.calculateCarbonScore(totalCarbon, offsetPurchased);

    return {
      totalSpend,
      spendByModel,
      spendByTenant,
      projectedMonthEnd,
      savingsOpportunities,
      carbonScore
    };
  }

  /**
   * Ajoute ou met à jour une policy de routage
   */
  async upsertRoutingPolicy(policy: RoutingPolicy): Promise<void> {
    this.policies.set(policy.id, policy);
    console.log(`[FINOPS] Policy '${policy.name}' saved`);
  }

  /**
   * Achète des crédits carbone pour compenser l'empreinte
   */
  async purchaseCarbonOffset(tenantId: string, amountTonnes: number): Promise<void> {
    const current = this.carbonOffsets.get(tenantId) || 0;
    this.carbonOffsets.set(tenantId, current + amountTonnes * 1000000); // Conversion en grammes
    
    console.log(`[FINOPS] Purchased ${amountTonnes} tonnes of carbon offsets for ${tenantId}`);
  }

  /**
   * Obtient les métriques détaillées d'empreinte carbone
   */
  getCarbonMetrics(modelId: string, tokenCount: number): CarbonFootprintMetrics {
    const model = this.modelRegistry.get(modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    const co2Grams = (model.carbonIntensity * tokenCount) / 1000;
    // Estimations basées sur les données moyennes du secteur
    const energyKWh = co2Grams * 0.0005; // ~0.5g CO2 par kWh
    const waterLiters = co2Grams * 0.002; // ~2L d'eau par kg CO2

    return {
      co2GramsPerToken: model.carbonIntensity / 1000,
      energyKWh,
      waterLiters,
      offsetStatus: 'pending'
    };
  }

  // Helpers privés
  private initializeModelRegistry(): void {
    // Registre des modèles disponibles avec leurs caractéristiques
    const models: ModelInfo[] = [
      {
        id: 'economy-small',
        name: 'Economy Small (Distilled)',
        tier: 'economy',
        costPer1KTokens: 0.0001,
        avgLatencyMs: 50,
        carbonIntensity: 0.05,
        maxContextLength: 4096,
        capabilities: ['classification', 'extraction', 'simple_qa']
      },
      {
        id: 'balanced-mid',
        name: 'Balanced Mid (Efficient)',
        tier: 'balanced',
        costPer1KTokens: 0.0005,
        avgLatencyMs: 150,
        carbonIntensity: 0.15,
        maxContextLength: 8192,
        capabilities: ['reasoning', 'summarization', 'translation']
      },
      {
        id: 'premium-large',
        name: 'Premium Large (SOTA)',
        tier: 'premium',
        costPer1KTokens: 0.003,
        avgLatencyMs: 500,
        carbonIntensity: 0.8,
        maxContextLength: 128000,
        capabilities: ['complex_reasoning', 'code_generation', 'creative_writing']
      },
      {
        id: 'specialized-code',
        name: 'Specialized Code',
        tier: 'specialized',
        costPer1KTokens: 0.001,
        avgLatencyMs: 200,
        carbonIntensity: 0.3,
        maxContextLength: 16384,
        capabilities: ['code_generation', 'code_review', 'debugging']
      },
      {
        id: 'green-efficient',
        name: 'Green Efficient (Carbon Neutral)',
        tier: 'economy',
        costPer1KTokens: 0.0002,
        avgLatencyMs: 100,
        carbonIntensity: 0.01, // Très faible grâce aux énergies renouvelables
        maxContextLength: 8192,
        capabilities: ['classification', 'summarization', 'simple_qa']
      }
    ];

    for (const model of models) {
      this.modelRegistry.set(model.id, model);
    }
  }

  private filterEligibleModels(conditions: RoutingPolicy['conditions']): ModelInfo[] {
    return Array.from(this.modelRegistry.values()).filter(model => {
      // Filtrage par coût maximum
      if (conditions.maxCostPerRequest && model.costPer1KTokens > conditions.maxCostPerRequest) {
        return false;
      }

      // Filtrage par latence maximum
      if (conditions.maxLatencyMs && model.avgLatencyMs > conditions.maxLatencyMs) {
        return false;
      }

      // Filtrage par intensité carbone maximum
      if (conditions.maxCarbonIntensity && model.carbonIntensity > conditions.maxCarbonIntensity) {
        return false;
      }

      // Filtrage par sensibilité des données
      if (conditions.dataSensitivity === 'critical') {
        // Seuls les modèles premium ou spécialisés pour les données critiques
        return ['premium', 'specialized'].includes(model.tier);
      }

      return true;
    });
  }

  private calculateModelScore(
    model: ModelInfo,
    policy: RoutingPolicy,
    tokenCount: number
  ): number {
    let score = 100;

    // Pénalité pour le coût (plus c'est bas, mieux c'est)
    const costWeight = policy.action.preferredModels.includes(model.id) ? 0.1 : 0.3;
    score -= (model.costPer1KTokens * tokenCount) * costWeight * 100;

    // Pénalité pour le carbone
    const carbonWeight = 0.2;
    score -= model.carbonIntensity * carbonWeight * 50;

    // Bonus pour les modèles préférés
    if (policy.action.preferredModels.includes(model.id)) {
      score += 20;
    }

    // Pénalité pour la latence si importante
    if (model.avgLatencyMs > 300) {
      score -= 10;
    }

    return score;
  }

  private async recordUsage(
    tenantId: string,
    modelId: string,
    cost: number,
    carbonGrams: number,
    tokenCount: number
  ): Promise<void> {
    if (!this.usageData.has(tenantId)) {
      this.usageData.set(tenantId, []);
    }

    const record: UsageRecord = {
      timestamp: Date.now(),
      modelId,
      cost,
      carbonGrams,
      tokenCount
    };

    this.usageData.get(tenantId)!.push(record);

    // Limitation à 90 jours de données
    const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
    const records = this.usageData.get(tenantId)!;
    if (records.length > 10000) {
      const filtered = records.filter(r => r.timestamp > ninetyDaysAgo);
      this.usageData.set(tenantId, filtered);
    }
  }

  private identifySavingsOpportunities(
    tenantId: string,
    records: UsageRecord[]
  ): Array<{ recommendation: string; estimatedSaving: number; effort: 'low' | 'medium' | 'high' }> {
    const opportunities: Array<{ recommendation: string; estimatedSaving: number; effort: 'low' | 'medium' | 'high' }> = [];

    // Analyse des modèles les plus utilisés
    const modelUsage: Record<string, { cost: number; count: number }> = {};
    for (const record of records) {
      if (!modelUsage[record.modelId]) {
        modelUsage[record.modelId] = { cost: 0, count: 0 };
      }
      modelUsage[record.modelId].cost += record.cost;
      modelUsage[record.modelId].count++;
    }

    // Recommandation: Utiliser le modèle green-efficient pour les tâches simples
    const premiumUsage = modelUsage['premium-large'];
    if (premiumUsage && premiumUsage.count > 100) {
      const potentialSaving = premiumUsage.cost * 0.3; // 30% d'économie potentielle
      opportunities.push({
        recommendation: 'Migrer 30% des requêtes premium vers green-efficient pour les tâches simples',
        estimatedSaving: potentialSaving,
        effort: 'medium'
      });
    }

    // Recommandation: Activer le caching
    const totalCost = records.reduce((sum, r) => sum + r.cost, 0);
    if (totalCost > 100) {
      opportunities.push({
        recommendation: 'Activer le sémantique caching pour réduire les appels redondants',
        estimatedSaving: totalCost * 0.15,
        effort: 'low'
      });
    }

    return opportunities;
  }

  private calculateCarbonScore(totalCarbonGrams: number, offsetGrams: number): number {
    if (totalCarbonGrams === 0) return 100;
    
    const netCarbon = Math.max(0, totalCarbonGrams - offsetGrams);
    // Score de 0 à 100, où 100 = neutre en carbone
    const ratio = offsetGrams / totalCarbonGrams;
    return Math.min(100, Math.round(ratio * 100));
  }

  private estimateTokens(text: string): number {
    // Estimation simplifiée: ~4 caractères par token en moyenne
    return Math.ceil(text.length / 4);
  }

  private getDaysElapsed(records: UsageRecord[]): number {
    if (records.length === 0) return 0;
    
    const now = Date.now();
    const firstRecord = Math.min(...records.map(r => r.timestamp));
    return (now - firstRecord) / (24 * 60 * 60 * 1000);
  }
}

interface UsageRecord {
  timestamp: number;
  modelId: string;
  cost: number;
  carbonGrams: number;
  tokenCount: number;
}
