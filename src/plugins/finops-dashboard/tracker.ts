/**
 * Prototype 4: Dashboard FinOps (Tagging & Coûts par Requête)
 * 
 * Stratégie :
 * 1. Intercepter chaque appel API externe (LLM, SMS, Email, WhatsApp) et lui associer un tag unique.
 * 2. Calculer le coût réel de chaque opération en temps réel.
 * 3. Agréger les coûts par conversation, campagne, tenant, et utilisateur.
 * 4. Alertes prédictives basées sur la consommation actuelle vs budget.
 * 
 * Objectif : Visibilité totale sur les coûts et optimisation automatique.
 */

export interface CostEntry {
  id: string;
  timestamp: Date;
  tenantId: string;
  conversationId?: string;
  campaignId?: string;
  userId?: string;
  serviceType: 'llm' | 'sms' | 'email' | 'whatsapp' | 'storage' | 'bandwidth';
  operation: string;
  quantity: number; // tokens, nombre de messages, MB, etc.
  unitCost: number; // coût unitaire
  totalCost: number; // coût total
  metadata: Record<string, any>;
}

export interface BudgetAlert {
  tenantId: string;
  budgetLimit: number;
  currentSpend: number;
  percentageUsed: number;
  predictedOverrun: boolean;
  predictedTotal: number;
  alertLevel: 'info' | 'warning' | 'critical';
}

export interface CostBreakdown {
  total: number;
  byService: Record<string, number>;
  byConversation: Record<string, number>;
  byCampaign: Record<string, number>;
  byDay: Record<string, number>;
}

export class FinOpsTracker {
  private readonly costRates = {
    llm_input_token: 0.00001, // $0.01 par 1K tokens
    llm_output_token: 0.00003, // $0.03 par 1K tokens
    sms: 0.05, // $0.05 par SMS
    email: 0.001, // $0.001 par email
    whatsapp_conversation: 0.005, // $0.005 par conversation WhatsApp
    storage_gb: 0.023, // $0.023 par GB/mois
    bandwidth_gb: 0.09 // $0.09 par GB transféré
  };

  private entries: CostEntry[] = [];
  private budgets: Map<string, number> = new Map(); // tenantId -> budget mensuel

  /**
   * Track d'un appel API avec calcul automatique du coût
   */
  async trackAPICall(params: {
    tenantId: string;
    conversationId?: string;
    campaignId?: string;
    userId?: string;
    serviceType: CostEntry['serviceType'];
    operation: string;
    quantity: number;
    metadata?: Record<string, any>;
  }): Promise<CostEntry> {
    const unitCost = this.getUnitCost(params.serviceType, params.operation);
    const totalCost = unitCost * params.quantity;

    const entry: CostEntry = {
      id: `cost_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...params,
      unitCost,
      totalCost,
      metadata: params.metadata || {}
    };

    this.entries.push(entry);

    // Vérification budget en temps réel
    await this.checkBudgetAlerts(params.tenantId);

    return entry;
  }

  /**
   * Récupération du coût unitaire selon le type de service
   */
  private getUnitCost(serviceType: string, operation: string): number {
    switch (serviceType) {
      case 'llm':
        return operation.includes('output') 
          ? this.costRates.llm_output_token 
          : this.costRates.llm_input_token;
      case 'sms':
        return this.costRates.sms;
      case 'email':
        return this.costRates.email;
      case 'whatsapp':
        return this.costRates.whatsapp_conversation;
      case 'storage':
        return this.costRates.storage_gb;
      case 'bandwidth':
        return this.costRates.bandwidth_gb;
      default:
        return 0;
    }
  }

  /**
   * Définition du budget pour un tenant
   */
  setBudget(tenantId: string, amount: number): void {
    this.budgets.set(tenantId, amount);
    console.log(`[FinOps] Budget défini pour ${tenantId}: $${amount}`);
  }

  /**
   * Vérification des alertes budget
   */
  private async checkBudgetAlerts(tenantId: string): Promise<void> {
    const budget = this.budgets.get(tenantId);
    if (!budget) return;

    const breakdown = await this.getCostBreakdown(tenantId);
    const percentageUsed = (breakdown.total / budget) * 100;

    let alertLevel: BudgetAlert['alertLevel'] = 'info';
    if (percentageUsed > 90) alertLevel = 'critical';
    else if (percentageUsed > 75) alertLevel = 'warning';

    if (alertLevel !== 'info') {
      const predictedTotal = this.predictMonthlySpend(tenantId);
      
      const alert: BudgetAlert = {
        tenantId,
        budgetLimit: budget,
        currentSpend: breakdown.total,
        percentageUsed,
        predictedOverrun: predictedTotal > budget,
        predictedTotal,
        alertLevel
      };

      await this.sendBudgetAlert(alert);
    }
  }

  /**
   * Prédiction de dépassement basée sur la tendance actuelle
   */
  private predictMonthlySpend(tenantId: string): number {
    const now = new Date();
    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const entriesThisMonth = this.entries.filter(
      e => e.tenantId === tenantId && e.timestamp >= monthStart
    );

    const spendSoFar = entriesThisMonth.reduce((sum, e) => sum + e.totalCost, 0);
    
    // Projection linéaire simple
    const dailyAverage = spendSoFar / dayOfMonth;
    return dailyAverage * daysInMonth;
  }

  /**
   * Envoi d'alerte budget (à intégrer avec système de notifications)
   */
  private async sendBudgetAlert(alert: BudgetAlert): Promise<void> {
    console.warn('[FinOps] ALERTE BUDGET:', JSON.stringify(alert, null, 2));
    // Ici : envoyer email/webhook/notification au tenant
  }

  /**
   * Obtention du détail des coûts pour un tenant
   */
  async getCostBreakdown(tenantId: string, periodDays: number = 30): Promise<CostBreakdown> {
    const since = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);
    const filtered = this.entries.filter(
      e => e.tenantId === tenantId && e.timestamp >= since
    );

    const breakdown: CostBreakdown = {
      total: 0,
      byService: {},
      byConversation: {},
      byCampaign: {},
      byDay: {}
    };

    for (const entry of filtered) {
      breakdown.total += entry.totalCost;

      // Par service
      breakdown.byService[entry.serviceType] = 
        (breakdown.byService[entry.serviceType] || 0) + entry.totalCost;

      // Par conversation
      if (entry.conversationId) {
        breakdown.byConversation[entry.conversationId] = 
          (breakdown.byConversation[entry.conversationId] || 0) + entry.totalCost;
      }

      // Par campagne
      if (entry.campaignId) {
        breakdown.byCampaign[entry.campaignId] = 
          (breakdown.byCampaign[entry.campaignId] || 0) + entry.totalCost;
      }

      // Par jour
      const dayKey = entry.timestamp.toISOString().split('T')[0];
      breakdown.byDay[dayKey] = 
        (breakdown.byDay[dayKey] || 0) + entry.totalCost;
    }

    return breakdown;
  }

  /**
   * Calcul du coût d'une conversation spécifique
   */
  async getConversationCost(conversationId: string): Promise<number> {
    const entries = this.entries.filter(e => e.conversationId === conversationId);
    return entries.reduce((sum, e) => sum + e.totalCost, 0);
  }

  /**
   * Calcul du coût d'une campagne spécifique
   */
  async getCampaignCost(campaignId: string): Promise<number> {
    const entries = this.entries.filter(e => e.campaignId === campaignId);
    return entries.reduce((sum, e) => sum + e.totalCost, 0);
  }

  /**
   * Optimisation : Recommandations basées sur les patterns de consommation
   */
  async getOptimizationRecommendations(tenantId: string): Promise<string[]> {
    const breakdown = await this.getCostBreakdown(tenantId, 7);
    const recommendations: string[] = [];

    // Détection surconsommation LLM
    const llmSpend = breakdown.byService['llm'] || 0;
    if (llmSpend > breakdown.total * 0.7) {
      recommendations.push(
        "70% de vos coûts viennent des appels LLM. Activez le cache sémantique ou le modèle hybride Edge pour réduire jusqu'à 70%."
      );
    }

    // Détection conversations coûteuses
    const convEntries = Object.entries(breakdown.byConversation);
    if (convEntries.length > 0) {
      const sorted = convEntries.sort((a, b) => b[1] - a[1]);
      const topConv = sorted[0];
      const avgCost = breakdown.total / convEntries.length;
      
      if (topConv[1] > avgCost * 5) {
        recommendations.push(
          `La conversation ${topConv[0]} coûte 5x plus que la moyenne. Vérifiez s'il y a un usage abusif ou une boucle infinie.`
        );
      }
    }

    // Détection campagnes inefficaces
    const campaignEntries = Object.entries(breakdown.byCampaign);
    if (campaignEntries.length > 1) {
      const sorted = campaignEntries.sort((a, b) => b[1] - a[1]);
      const mostExpensive = sorted[0][0];
      recommendations.push(
        `La campagne "${mostExpensive}" est la plus coûteuse. Analysez son ROI avant de continuer.`
      );
    }

    return recommendations;
  }

  /**
   * Export des données pour reporting
   */
  exportToCSV(tenantId: string, periodDays: number = 30): string {
    const since = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);
    const filtered = this.entries.filter(
      e => e.tenantId === tenantId && e.timestamp >= since
    );

    const headers = ['ID', 'Date', 'Service', 'Opération', 'Quantité', 'Coût Unitaire', 'Coût Total', 'Conversation', 'Campagne'];
    const rows = filtered.map(e => [
      e.id,
      e.timestamp.toISOString(),
      e.serviceType,
      e.operation,
      e.quantity,
      e.unitCost.toFixed(6),
      e.totalCost.toFixed(4),
      e.conversationId || '-',
      e.campaignId || '-'
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  /**
   * Reset des données (pour tests ou rotation mensuelle)
   */
  clearOldEntries(beforeDate: Date): void {
    const initialCount = this.entries.length;
    this.entries = this.entries.filter(e => e.timestamp >= beforeDate);
    console.log(`[FinOps] ${initialCount - this.entries.length} anciennes entrées supprimées`);
  }
}

// Singleton export
export const finOpsTracker = new FinOpsTracker();

// Middleware Express pour tracking automatique
export function createFinOpsMiddleware() {
  return async (req: any, res: any, next: any) => {
    const startTime = Date.now();
    
    // Hook sur la fin de la réponse pour tracker
    const originalJson = res.json;
    res.json = function(data: any) {
      const duration = Date.now() - startTime;
      
      // Exemple : tracker les appels LLM
      if (req.path.includes('/api/ai')) {
        finOpsTracker.trackAPICall({
          tenantId: req.user?.tenantId || 'unknown',
          userId: req.user?.id,
          serviceType: 'llm',
          operation: 'chat_completion',
          quantity: data?.usage?.total_tokens || 100, // estimation si non fourni
          metadata: { duration, path: req.path }
        });
      }
      
      return originalJson.call(this, data);
    };
    
    next();
  };
}
