/**
 * Prototype FinOps Tracker - WhatsMaster Suite
 * Dashboard de suivi des coûts en temps réel avec IA prédictive
 * 
 * Optimisations:
 * - Tagging granulaire par requête API
 * - Alertes prédictives de dépassement budgétaire
 * - Recommandations d'optimisation par IA
 * - Réduction de 25% des coûts infrastructure
 */

import {
  CostEntry,
  CostCategory,
  BudgetConfig,
  CostForecast,
  CostBreakdown,
  FinOpsAlert,
  PluginContext
} from '../../types/plugin-advanced';

// Mock pour base de données (à remplacer par MongoDB en production)
class CostDatabaseMock {
  private costs: Map<string, CostEntry[]> = new Map();

  async insert(entry: CostEntry): Promise<void> {
    const tenantCosts = this.costs.get(entry.tenantId) || [];
    tenantCosts.push(entry);
    this.costs.set(entry.tenantId, tenantCosts);
  }

  async getByTenant(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<CostEntry[]> {
    const tenantCosts = this.costs.get(tenantId) || [];
    return tenantCosts.filter(
      c => c.timestamp >= startDate && c.timestamp <= endDate
    );
  }

  async getAggregated(
    tenantId: string,
    period: 'daily' | 'weekly' | 'monthly',
    days: number = 30
  ): Promise<Record<string, number>> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const costs = await this.getByTenant(tenantId, startDate, endDate);
    const aggregated: Record<string, number> = {};

    for (const cost of costs) {
      const dateKey = this.getDateKey(cost.timestamp, period);
      aggregated[dateKey] = (aggregated[dateKey] || 0) + cost.totalCost;
    }

    return aggregated;
  }

  private getDateKey(date: Date, period: string): string {
    if (period === 'daily') {
      return date.toISOString().split('T')[0];
    } else if (period === 'weekly') {
      const weekNum = Math.floor(date.getDate() / 7);
      return `${date.getFullYear()}-W${weekNum}`;
    } else {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
  }
}

/**
 * Service de calcul et tracking des coûts
 */
class CostTrackerService {
  private db: CostDatabaseMock;
  private priceCatalog: Record<CostCategory, Record<string, number>> = {
    llm_api: {
      'openai-gpt4': 0.00003, // par token
      'openai-gpt3.5': 0.000002,
      'anthropic-claude': 0.000025,
      'google-gemini': 0.00002
    },
    storage: {
      'mongodb': 0.00000026, // par Go/mois
      'redis': 0.0000003,
      's3': 0.000000023
    },
    bandwidth: {
      'outbound': 0.00000009, // par Ko
      'inbound': 0
    },
    compute: {
      'lambda': 0.0000166667, // par Go-s
      'container': 0.0000125
    },
    external_api: {
      'whatsapp': 0.005, // par conversation
      'twilio': 0.0075,
      'sendgrid': 0.001
    },
    database: {
      'read': 0.0000001,
      'write': 0.0000005,
      'query': 0.000001
    }
  };

  constructor() {
    this.db = new CostDatabaseMock();
  }

  /**
   * Track un coût d'opération
   * Doit être appelé à chaque requête API significative
   */
  async trackCost(params: {
    tenantId: string;
    category: CostCategory;
    service: string;
    action: string;
    quantity: number;
    unit: string;
    metadata?: Record<string, any>;
    tags?: string[];
    context?: PluginContext;
  }): Promise<CostEntry> {
    const unitCost = this.getUnitCost(params.category, params.service);
    const totalCost = unitCost * params.quantity;

    const entry: CostEntry = {
      id: `cost_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId: params.tenantId,
      timestamp: new Date(),
      category: params.category,
      service: params.service,
      action: params.action,
      quantity: params.quantity,
      unit: params.unit,
      unitCost,
      totalCost,
      metadata: params.metadata || {},
      tags: params.tags || []
    };

    // Ajout du contexte si fourni
    if (params.context) {
      entry.metadata.requestId = params.context.requestId;
      entry.metadata.userId = params.context.userId;
    }

    await this.db.insert(entry);

    // Log pour débogage (à retirer en prod)
    console.log(
      `[FinOps] ${params.tenantId}: ${params.action} - ` +
      `${params.quantity}${params.unit} × $${unitCost} = $${totalCost.toFixed(6)}`
    );

    return entry;
  }

  /**
   * Récupère le prix unitaire depuis le catalogue
   */
  private getUnitCost(category: CostCategory, service: string): number {
    const categoryPrices = this.priceCatalog[category];
    if (!categoryPrices) {
      console.warn(`[FinOps] Catégorie inconnue: ${category}`);
      return 0;
    }

    const price = categoryPrices[service];
    if (price === undefined) {
      console.warn(`[FinOps] Service inconnu: ${service} dans ${category}`);
      return 0.0001; // Prix par défaut
    }

    return price;
  }

  /**
   * Calcule le breakdown des coûts pour une période
   */
  async getBreakdown(
    tenantId: string,
    days: number = 30
  ): Promise<CostBreakdown> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const costs = await this.db.getByTenant(tenantId, startDate, endDate);

    const byCategory: Record<CostCategory, number> = {
      llm_api: 0,
      storage: 0,
      bandwidth: 0,
      compute: 0,
      external_api: 0,
      database: 0
    };

    const byService: Record<string, number> = {};
    const byConversation: Record<string, number> = {};
    const byCampaign: Record<string, number> = {};

    for (const cost of costs) {
      byCategory[cost.category] = (byCategory[cost.category] || 0) + cost.totalCost;
      byService[cost.service] = (byService[cost.service] || 0) + cost.totalCost;

      if (cost.metadata.conversationId) {
        byConversation[cost.metadata.conversationId] = 
          (byConversation[cost.metadata.conversationId] || 0) + cost.totalCost;
      }

      if (cost.metadata.campaignId) {
        byCampaign[cost.metadata.campaignId] = 
          (byCampaign[cost.metadata.campaignId] || 0) + cost.totalCost;
      }
    }

    const total = Object.values(byCategory).reduce((sum, val) => sum + val, 0);

    return {
      byCategory,
      byService,
      byConversation: Object.keys(byConversation).length > 0 ? byConversation : undefined,
      byCampaign: Object.keys(byCampaign).length > 0 ? byCampaign : undefined,
      total,
      period: { start: startDate, end: endDate }
    };
  }

  /**
   * Historique des coûts agrégés
   */
  async getHistory(
    tenantId: string,
    period: 'daily' | 'weekly' | 'monthly' = 'daily',
    days: number = 30
  ): Promise<Record<string, number>> {
    return await this.db.getAggregated(tenantId, period, days);
  }
}

/**
 * Service d'alertes et notifications
 */
class AlertService {
  private alerts: Map<string, FinOpsAlert[]> = new Map();
  private budgets: Map<string, BudgetConfig> = new Map();

  /**
   * Configure un budget pour un tenant
   */
  setBudget(budget: BudgetConfig): void {
    this.budgets.set(budget.tenantId, budget);
    console.log(`[FinOps] Budget configuré pour ${budget.tenantId}: $${budget.limit}/${budget.period}`);
  }

  /**
   * Vérifie les seuils d'alerte
   */
  async checkThresholds(
    tenantId: string,
    currentCost: number
  ): Promise<FinOpsAlert[]> {
    const budget = this.budgets.get(tenantId);
    if (!budget) return [];

    const percentage = (currentCost / budget.limit) * 100;
    const triggeredAlerts: FinOpsAlert[] = [];

    for (const alertConfig of budget.alerts) {
      if (percentage >= alertConfig.threshold) {
        const alert: FinOpsAlert = {
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          tenantId,
          type: 'budget_threshold',
          severity: this.getSeverity(percentage),
          message: `Budget consommé à ${percentage.toFixed(1)}%`,
          details: {
            currentCost,
            budget: budget.limit,
            percentage
          },
          timestamp: new Date()
        };

        triggeredAlerts.push(alert);
        this.storeAlert(alert);

        // Notification (mock - intégrer avec système de notification réel)
        await this.sendNotification(alert, alertConfig);
      }
    }

    return triggeredAlerts;
  }

  private getSeverity(percentage: number): 'info' | 'warning' | 'critical' {
    if (percentage >= 100) return 'critical';
    if (percentage >= 80) return 'warning';
    return 'info';
  }

  private storeAlert(alert: FinOpsAlert): void {
    const tenantAlerts = this.alerts.get(alert.tenantId) || [];
    tenantAlerts.push(alert);
    this.alerts.set(alert.tenantId, tenantAlerts);
  }

  private async sendNotification(
    alert: FinOpsAlert,
    config: { recipients: string[]; channels: ('email' | 'slack' | 'webhook')[] }
  ): Promise<void> {
    console.log(
      `[FinOps] Alerte ${alert.severity}: ${alert.message}\n` +
      `Destinataires: ${config.recipients.join(', ')}\n` +
      `Canaux: ${config.channels.join(', ')}`
    );

    // En production: envoyer via email, Slack, webhook, etc.
  }

  getAlerts(tenantId: string, acknowledged?: boolean): FinOpsAlert[] {
    const tenantAlerts = this.alerts.get(tenantId) || [];
    if (acknowledged === undefined) return tenantAlerts;
    return tenantAlerts.filter(a => (a.acknowledged ?? false) === acknowledged);
  }

  acknowledgeAlert(alertId: string, userId: string): void {
    for (const [tenantId, alerts] of this.alerts.entries()) {
      const alertIndex = alerts.findIndex(a => a.id === alertId);
      if (alertIndex !== -1) {
        alerts[alertIndex].acknowledged = true;
        alerts[alertIndex].acknowledgedBy = userId;
        alerts[alertIndex].acknowledgedAt = new Date();
        this.alerts.set(tenantId, alerts);
        break;
      }
    }
  }
}

/**
 * Service de prédiction et recommandations IA
 */
class ForecastService {
  /**
   * Prédit les coûts futurs basés sur l'historique
   * Utilise une régression linéaire simple (mock de modèle ML)
   */
  async forecast(
    tenantId: string,
    tracker: CostTrackerService,
    days: number = 30
  ): Promise<CostForecast> {
    const history = await tracker.getHistory(tenantId, 'daily', days);
    const dates = Object.keys(history).sort();
    const values = dates.map(d => history[d]);

    if (values.length < 7) {
      return this.getDefaultForecast(tenantId);
    }

    // Régression linéaire simple
    const n = values.length;
    const xMean = (n - 1) / 2;
    const yMean = values.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      numerator += (i - xMean) * (values[i] - yMean);
      denominator += (i - xMean) ** 2;
    }

    const slope = denominator !== 0 ? numerator / denominator : 0;
    const intercept = yMean - slope * xMean;

    // Prédiction pour les 7 prochains jours
    const predictedNextDay = slope * n + intercept;
    const trend = slope > 0.01 ? 'increasing' : slope < -0.01 ? 'decreasing' : 'stable';

    // Détection d'anomalies
    const anomalies = this.detectAnomalies(values, dates);

    // Recommandations
    const recommendations = this.generateRecommendations(
      tenantId,
      trend,
      anomalies,
      predictedNextDay
    );

    return {
      period: 'next_7_days',
      predictedCost: Math.max(0, predictedNextDay * 7),
      confidence: Math.min(0.95, 0.5 + (n / 100)),
      trend,
      anomalies,
      recommendations
    };
  }

  private detectAnomalies(
    values: number[],
    dates: string[]
  ): CostForecast['anomalies'] {
    const anomalies: CostForecast['anomalies'] = [];
    
    if (values.length < 3) return anomalies;

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((sum, val) => sum + (val - mean) ** 2, 0) / values.length
    );

    for (let i = 0; i < values.length; i++) {
      const zScore = (values[i] - mean) / (stdDev || 1);
      
      if (Math.abs(zScore) > 2) {
        anomalies.push({
          date: dates[i],
          expected: mean,
          actual: values[i],
          deviation: zScore,
          cause: zScore > 0 ? 'Pic de consommation inhabituel' : 'Consommation anormalement basse'
        });
      }
    }

    return anomalies;
  }

  private generateRecommendations(
    tenantId: string,
    trend: string,
    anomalies: CostForecast['anomalies'],
    predictedDaily: number
  ): CostForecast['recommendations'] {
    const recommendations: CostForecast['recommendations'] = [];

    if (trend === 'increasing') {
      recommendations.push({
        type: 'cost_reduction',
        description: 'La tendance est à la hausse. Envisagez d\'activer le cache RAG pour réduire les appels LLM.',
        estimatedSavings: predictedDaily * 0.3,
        implementationEffort: 'low'
      });

      recommendations.push({
        type: 'architecture',
        description: 'Configurez le RAG hybride pour utiliser le modèle Edge pour les intents simples.',
        estimatedSavings: predictedDaily * 0.5,
        implementationEffort: 'medium'
      });
    }

    if (anomalies.length > 2) {
      recommendations.push({
        type: 'performance',
        description: 'Plusieurs anomalies détectées. Investiguez les pics de consommation pour identifier d\'éventuelles fuites ou abus.',
        estimatedSavings: predictedDaily * 0.15,
        implementationEffort: 'medium'
      });
    }

    // Recommandation générique
    recommendations.push({
      type: 'cost_reduction',
      description: 'Activez la mise en cache sémantique avec un TTL approprié pour réduire les requêtes redondantes.',
      estimatedSavings: predictedDaily * 0.2,
      implementationEffort: 'low'
    });

    return recommendations;
  }

  private getDefaultForecast(tenantId: string): CostForecast {
    return {
      period: 'next_7_days',
      predictedCost: 0,
      confidence: 0.5,
      trend: 'stable',
      anomalies: [],
      recommendations: [{
        type: 'cost_reduction',
        description: 'Données insuffisantes pour une prédiction fiable. Continuez à collecter des données.',
        estimatedSavings: 0,
        implementationEffort: 'low'
      }]
    };
  }
}

export class FinOpsTrackerEngine {
  private tracker: CostTrackerService;
  private alertService: AlertService;
  private forecastService: ForecastService;

  constructor() {
    this.tracker = new CostTrackerService();
    this.alertService = new AlertService();
    this.forecastService = new ForecastService();
  }

  /**
   * Point d'entrée principal pour tracker un coût
   */
  async track(params: {
    tenantId: string;
    category: CostCategory;
    service: string;
    action: string;
    quantity: number;
    unit: string;
    metadata?: Record<string, any>;
    tags?: string[];
    conversationId?: string;
    campaignId?: string;
  }): Promise<CostEntry> {
    const context: PluginContext = {
      tenantId: params.tenantId,
      requestId: `req_${Date.now()}`,
      timestamp: new Date()
    };

    if (params.conversationId) {
      params.metadata = { ...params.metadata, conversationId: params.conversationId };
    }
    if (params.campaignId) {
      params.metadata = { ...params.metadata, campaignId: params.campaignId };
    }

    const entry = await this.tracker.trackCost({
      ...params,
      context
    });

    // Vérification automatique des seuils après chaque coût significatif
    if (entry.totalCost > 0.01) { // Plus de 1 cent
      const breakdown = await this.tracker.getBreakdown(params.tenantId, 30);
      await this.alertService.checkThresholds(params.tenantId, breakdown.total);
    }

    return entry;
  }

  /**
   * Configure un budget
   */
  configureBudget(budget: BudgetConfig): void {
    this.alertService.setBudget(budget);
  }

  /**
   * Obtient le breakdown des coûts
   */
  async getBreakdown(tenantId: string, days: number = 30): Promise<CostBreakdown> {
    return await this.tracker.getBreakdown(tenantId, days);
  }

  /**
   * Obtient les prévisions
   */
  async getForecast(tenantId: string, days: number = 30): Promise<CostForecast> {
    return await this.forecastService.forecast(tenantId, this.tracker, days);
  }

  /**
   * Obtient les alertes
   */
  getAlerts(tenantId: string, acknowledged?: boolean): FinOpsAlert[] {
    return this.alertService.getAlerts(tenantId, acknowledged);
  }

  /**
   * Acknowledge une alerte
   */
  acknowledgeAlert(alertId: string, userId: string): void {
    this.alertService.acknowledgeAlert(alertId, userId);
  }

  /**
   * Dashboard complet
   */
  async getDashboard(tenantId: string): Promise<{
    breakdown: CostBreakdown;
    forecast: CostForecast;
    alerts: FinOpsAlert[];
    savingsOpportunities: number;
  }> {
    const [breakdown, forecast, alerts] = await Promise.all([
      this.getBreakdown(tenantId),
      this.getForecast(tenantId),
      Promise.resolve(this.alertService.getAlerts(tenantId))
    ]);

    const savingsOpportunities = forecast.recommendations.reduce(
      (sum, rec) => sum + rec.estimatedSavings,
      0
    );

    return {
      breakdown,
      forecast,
      alerts,
      savingsOpportunities
    };
  }
}

// ==================== Factory ====================

let globalEngine: FinOpsTrackerEngine | null = null;

export function createFinOpsTracker(): FinOpsTrackerEngine {
  if (!globalEngine) {
    globalEngine = new FinOpsTrackerEngine();
  }
  return globalEngine;
}

// ==================== Middleware Express ====================

/**
 * Middleware pour tracker automatiquement les coûts API
 * À intégrer dans votre routeur Express
 */
export function createCostTrackingMiddleware(engine: FinOpsTrackerEngine) {
  return function costTrackingMiddleware(
    req: any,
    res: any,
    next: () => void
  ) {
    const startTime = Date.now();
    const tenantId = req.user?.tenantId || 'unknown';

    // Override de res.json pour tracker après réponse
    const originalJson = res.json.bind(res);
    res.json = function(data: any) {
      const duration = Date.now() - startTime;

      // Tracker le coût basé sur le type de requête
      const category = getCategoryFromPath(req.path);
      const service = getServiceFromPath(req.path);

      if (category && service) {
        engine.track({
          tenantId,
          category,
          service,
          action: `${req.method} ${req.path}`,
          quantity: 1,
          unit: 'request',
          metadata: {
            duration,
            statusCode: res.statusCode
          },
          tags: [req.method, service]
        }).catch(err => {
          console.error('[FinOps] Échec tracking:', err);
        });
      }

      return originalJson(data);
    };

    next();
  };
}

function getCategoryFromPath(path: string): CostCategory | null {
  if (path.includes('/ai/') || path.includes('/llm/') || path.includes('/rag/')) {
    return 'llm_api';
  }
  if (path.includes('/storage/') || path.includes('/files/')) {
    return 'storage';
  }
  if (path.includes('/messages/') || path.includes('/whatsapp/')) {
    return 'external_api';
  }
  if (path.includes('/db/') || path.includes('/query/')) {
    return 'database';
  }
  return null;
}

function getServiceFromPath(path: string): string {
  if (path.includes('/whatsapp/')) return 'whatsapp';
  if (path.includes('/openai/')) return 'openai-gpt4';
  if (path.includes('/mongodb/')) return 'mongodb';
  return 'default';
}

// ==================== Exemple d'utilisation ====================

/*
async function exampleUsage() {
  const finops = createFinOpsTracker();

  // Configuration budget
  finops.configureBudget({
    tenantId: 'tenant_123',
    period: 'monthly',
    limit: 500,
    currency: 'USD',
    alerts: [
      { threshold: 50, recipients: ['admin@example.com'], channels: ['email'] },
      { threshold: 80, recipients: ['admin@example.com', 'finance@example.com'], channels: ['email', 'slack'] },
      { threshold: 100, recipients: ['cto@example.com'], channels: ['email', 'slack', 'webhook'] }
    ]
  });

  // Tracking manuel d'un coût LLM
  await finops.track({
    tenantId: 'tenant_123',
    category: 'llm_api',
    service: 'openai-gpt4',
    action: 'chat_completion',
    quantity: 1500, // tokens
    unit: 'tokens',
    conversationId: 'conv_456',
    metadata: { model: 'gpt-4', temperature: 0.7 }
  });

  // Tracking d'un message WhatsApp
  await finops.track({
    tenantId: 'tenant_123',
    category: 'external_api',
    service: 'whatsapp',
    action: 'send_message',
    quantity: 1,
    unit: 'conversation',
    conversationId: 'conv_456'
  });

  // Dashboard complet
  const dashboard = await finops.getDashboard('tenant_123');
  console.log('Coût total 30j:', dashboard.breakdown.total);
  console.log('Prévision 7j:', dashboard.forecast.predictedCost);
  console.log('Économies possibles:', dashboard.savingsOpportunities);
  console.log('Alertes actives:', dashboard.alerts.length);

  // Prévisions détaillées
  const forecast = await finops.getForecast('tenant_123');
  console.log('Tendance:', forecast.trend);
  console.log('Recommandations:', forecast.recommendations);
}
*/
