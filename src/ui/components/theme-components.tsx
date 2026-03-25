/**
 * UI Components Library - Theme Plugins
 * Bibliothèque de composants React/TypeScript pour les 3 thèmes prioritaires
 * Architecture: Atomic Design (Atoms, Molecules, Organisms, Templates)
 */

import React, { FC, ReactNode } from 'react';

// ============================================================================
// TYPES COMMUNS
// ============================================================================

interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
}

interface KpiCardProps extends BaseComponentProps {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: ReactNode;
  format?: 'currency' | 'percentage' | 'number';
  refreshInterval?: number;
}

interface WidgetProps extends BaseComponentProps {
  widgetId: string;
  widgetType: string;
  config: Record<string, any>;
  data?: any;
  loading?: boolean;
  error?: Error;
}

interface ConversationListProps extends BaseComponentProps {
  conversations: Array<{
    id: string;
    participant: string;
    lastMessage: string;
    timestamp: Date;
    unreadCount: number;
    priority?: 'high' | 'medium' | 'low';
  }>;
  onConversationSelect?: (id: string) => void;
  maxItems?: number;
}

interface LeadListProps extends BaseComponentProps {
  leads: Array<{
    id: string;
    name: string;
    company: string;
    score: number;
    status: 'new' | 'contacted' | 'qualified' | 'converted';
    lastActivity: Date;
  }>;
  onLeadSelect?: (id: string) => void;
  sortable?: boolean;
}

// ============================================================================
// ATOMS - Composants de base
// ============================================================================

/**
 * KPI Card - Affiche une métrique clé avec tendance
 */
export const KpiCard: FC<KpiCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon,
  format = 'number',
  className = '',
  'data-testid': testId
}) => {
  const formatValue = (val: number | string) => {
    if (typeof val === 'number') {
      switch (format) {
        case 'currency':
          return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);
        case 'percentage':
          return `${val.toFixed(1)}%`;
        default:
          return new Intl.NumberFormat('fr-FR').format(val);
      }
    }
    return val;
  };

  const trendColors = {
    up: 'text-emerald-600 bg-emerald-50',
    down: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→'
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${className}`}
      data-testid={testId || 'kpi-card'}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-gray-900">
          {formatValue(value)}
        </div>
        
        {change !== undefined && (
          <div className={`flex items-center px-2 py-1 rounded-full text-sm font-medium ${trendColors[trend]}`}>
            <span className="mr-1">{trendIcons[trend]}</span>
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Gauge Chart - Affiche une progression circulaire
 */
export const GaugeChart: FC<{ value: number; target: number; label?: string }> = ({ 
  value, 
  target, 
  label 
}) => {
  const percentage = Math.min((value / target) * 100, 100);
  const circumference = 2 * Math.PI * 45; // radius 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120" className="transform -rotate-90">
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="#10B981"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="mt-2 text-center">
        <div className="text-2xl font-bold text-gray-900">{value.toFixed(1)}%</div>
        {label && <div className="text-xs text-gray-500">{label}</div>}
      </div>
    </div>
  );
};

/**
 * Badge de statut
 */
export const StatusBadge: FC<{ status: string; variant?: 'success' | 'warning' | 'error' | 'info' }> = ({ 
  status, 
  variant = 'info' 
}) => {
  const variants = {
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {status}
    </span>
  );
};

// ============================================================================
// MOLECULES - Combinaisons d'atomes
// ============================================================================

/**
 * Liste de conversations
 */
export const ConversationList: FC<ConversationListProps> = ({
  conversations,
  onConversationSelect,
  maxItems = 20,
  className = ''
}) => {
  const displayedConversations = conversations.slice(0, maxItems);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <div className="divide-y divide-gray-100">
        {displayedConversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onConversationSelect?.(conv.id)}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {conv.participant}
                  </p>
                  {conv.priority === 'high' && (
                    <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate mt-1">
                  {conv.lastMessage}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-1 ml-4">
                <span className="text-xs text-gray-400">
                  {new Intl.DateTimeFormat('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }).format(conv.timestamp)}
                </span>
                {conv.unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs font-medium rounded-full">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {conversations.length > maxItems && (
        <div className="px-4 py-3 bg-gray-50 text-center text-sm text-gray-600">
          +{conversations.length - maxItems} autres conversations
        </div>
      )}
    </div>
  );
};

/**
 * Liste de leads avec scoring
 */
export const LeadList: FC<LeadListProps> = ({
  leads,
  onLeadSelect,
  sortable = true,
  className = ''
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50';
    if (score >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'converted': return 'success';
      case 'qualified': return 'info';
      case 'contacted': return 'warning';
      default: return 'info';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {sortable && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>}
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière activité</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {leads.map((lead) => (
            <tr
              key={lead.id}
              onClick={() => onLeadSelect?.(lead.id)}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              {sortable && (
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold ${getScoreColor(lead.score)}`}>
                    {lead.score}
                  </span>
                </td>
              )}
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{lead.name}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-500">{lead.company}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <StatusBadge status={lead.status} variant={getStatusVariant(lead.status) as any} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(lead.lastActivity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Funnel Chart - Visualisation de pipeline
 */
export const SalesFunnel: FC<{ stages: Array<{ name: string; count: number; value: number }> }> = ({ stages }) => {
  const maxValue = Math.max(...stages.map(s => s.count));

  return (
    <div className="space-y-3">
      {stages.map((stage, index) => (
        <div key={stage.name} className="relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">{stage.name}</span>
            <span className="text-sm text-gray-500">{stage.count} deals • {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', notation: 'compact' }).format(stage.value)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
              style={{ width: `${(stage.count / maxValue) * 100}%` }}
            >
              {stage.count > 0 && (
                <span className="text-xs font-medium text-white">
                  {((stage.count / maxValue) * 100).toFixed(0)}%
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// ORGANISMS - Composants complexes
// ============================================================================

/**
 * Dashboard Widget Container
 */
export const WidgetContainer: FC<WidgetProps> = ({
  widgetId,
  widgetType,
  config,
  data,
  loading = false,
  error,
  children
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-xl border border-red-200 p-6">
        <div className="flex items-center gap-2 text-red-800">
          <span className="text-xl">⚠️</span>
          <div>
            <h3 className="font-medium">Erreur de chargement</h3>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      data-widget-id={widgetId}
      data-widget-type={widgetType}
    >
      {children}
    </div>
  );
};

/**
 * Quick Actions Bar
 */
export const QuickActionsBar: FC<{ actions: Array<{ id: string; label: string; icon: ReactNode; onClick: () => void }> }> = ({ 
  actions 
}) => {
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={action.onClick}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <span className="w-4 h-4">{action.icon}</span>
          {action.label}
        </button>
      ))}
    </div>
  );
};

// ============================================================================
// TEMPLATES - Layouts complets
// ============================================================================

/**
 * Commerce Dashboard Template
 */
export const CommerceDashboardTemplate: FC<{
  revenueToday: number;
  ordersToday: number;
  conversionRate: number;
  topProducts: Array<{ name: string; units: number; revenue: number }>;
  activeConversations: Array<any>;
}> = ({ revenueToday, ordersToday, conversionRate, topProducts, activeConversations }) => {
  return (
    <div className="space-y-6">
      {/* KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Revenus aujourd'hui"
          value={revenueToday}
          change={12.5}
          trend="up"
          format="currency"
        />
        <KpiCard
          title="Commandes"
          value={ordersToday}
          change={8.3}
          trend="up"
          format="number"
        />
        <KpiCard
          title="Taux de conversion"
          value={conversionRate}
          change={-2.1}
          trend="down"
          format="percentage"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <WidgetContainer widgetId="top_products" widgetType="leaderboard" config={{}}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Produits</h3>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900">{product.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{product.units} unités</div>
                  <div className="text-xs text-gray-500">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.revenue)}</div>
                </div>
              </div>
            ))}
          </div>
        </WidgetContainer>

        {/* Active Conversations */}
        <WidgetContainer widgetId="active_conversations" widgetType="conversation_list" config={{}}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversations Actives</h3>
          <ConversationList conversations={activeConversations} maxItems={5} />
        </WidgetContainer>
      </div>
    </div>
  );
};

/**
 * Sales Pipeline Template
 */
export const SalesPipelineTemplate: FC<{
  pipelineValue: number;
  winRate: number;
  dealsByStage: Array<{ name: string; count: number; value: number }>;
  hotLeads: Array<any>;
  quotaAttainment: number;
}> = ({ pipelineValue, winRate, dealsByStage, hotLeads, quotaAttainment }) => {
  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard
          title="Pipeline Total"
          value={pipelineValue}
          format="currency"
          icon={<span>💰</span>}
        />
        <KpiCard
          title="Win Rate"
          value={winRate}
          format="percentage"
          icon={<span>🎯</span>}
        />
        <WidgetContainer widgetId="quota" widgetType="progress" config={{}}>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">Quota Trimestriel</div>
            <GaugeChart value={quotaAttainment} target={100} />
          </div>
        </WidgetContainer>
        <KpiCard
          title="Deals en cours"
          value={dealsByStage.reduce((sum, s) => sum + s.count, 0)}
          icon={<span>📊</span>}
        />
      </div>

      {/* Pipeline Funnel */}
      <WidgetContainer widgetId="pipeline_funnel" widgetType="funnel_chart" config={{}}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline par Étape</h3>
        <SalesFunnel stages={dealsByStage} />
      </WidgetContainer>

      {/* Hot Leads */}
      <WidgetContainer widgetId="hot_leads" widgetType="lead_list" config={{}}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Leads Chauds (Score ≥ 80)</h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            Voir tout →
          </button>
        </div>
        <LeadList leads={hotLeads.slice(0, 5)} maxItems={5} />
      </WidgetContainer>
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Atoms
  KpiCard,
  GaugeChart,
  StatusBadge,
  
  // Molecules
  ConversationList,
  LeadList,
  SalesFunnel,
  
  // Organisms
  WidgetContainer,
  QuickActionsBar,
  
  // Templates
  CommerceDashboardTemplate,
  SalesPipelineTemplate
};
