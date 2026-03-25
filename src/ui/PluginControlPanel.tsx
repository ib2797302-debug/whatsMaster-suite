/**
 * @module PluginControlPanel
 * @description Interface React pour le contrôle adaptatif des plugins.
 * Permet à l'utilisateur de régler performance et technologie via sliders.
 */

import React, { useState, useEffect } from 'react';

// Types simplifiés pour l'exemple
type TechTier = 'starter' | 'growth' | 'enterprise' | 'hyperscale';
type PerformanceMode = 'eco' | 'balanced' | 'performance' | 'ultra';

interface PluginState {
  pluginId: string;
  tier: TechTier;
  mode: PerformanceMode;
  healthScore: number;
  activeConnections: number;
  limits: {
    maxRps: number;
    llmBudgetPerDay: number;
  };
  isTransitioning: boolean;
}

interface ControlPanelProps {
  pluginId: string;
  initialState: PluginState;
  onReconfigure: (pluginId: string, tier?: TechTier, mode?: PerformanceMode) => Promise<void>;
}

const TIER_LABELS: Record<TechTier, { label: string; desc: string; icon: string }> = {
  starter: { label: 'Startup', desc: '< 10k users', icon: '🚀' },
  growth: { label: 'Croissance', desc: '10k-100k users', icon: '📈' },
  enterprise: { label: 'Entreprise', desc: '100k-1M users', icon: '🏢' },
  hyperscale: { label: 'Hyperscale', desc: '> 1M users', icon: '🌍' }
};

const MODE_CONFIG: Record<PerformanceMode, { label: string; color: string; impact: string }> = {
  eco: { label: 'Éco', color: 'bg-green-500', impact: '-70% coût' },
  balanced: { label: 'Équilibré', color: 'bg-blue-500', impact: 'Standard' },
  performance: { label: 'Performance', color: 'bg-orange-500', impact: '+150% perf' },
  ultra: { label: 'Ultra', color: 'bg-red-600', impact: '+300% perf' }
};

export const PluginControlPanel: React.FC<ControlPanelProps> = ({
  pluginId,
  initialState,
  onReconfigure
}) => {
  const [state, setState] = useState<PluginState>(initialState);
  const [isUpdating, setIsUpdating] = useState(false);

  // Simulation mise à jour temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        healthScore: Math.max(0, Math.min(100, prev.healthScore + (Math.random() - 0.5) * 5)),
        activeConnections: Math.floor(prev.activeConnections + (Math.random() - 0.5) * 10)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleTierChange = async (newTier: TechTier) => {
    if (newTier === state.tier || isUpdating) return;
    setIsUpdating(true);
    try {
      await onReconfigure(pluginId, newTier, undefined);
      setState(prev => ({ ...prev, tier: newTier }));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleModeChange = async (newMode: PerformanceMode) => {
    if (newMode === state.mode || isUpdating) return;
    setIsUpdating(true);
    try {
      await onReconfigure(pluginId, undefined, newMode);
      setState(prev => ({ ...prev, mode: newMode }));
    } finally {
      setIsUpdating(false);
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {pluginId}
            {isUpdating && <span className="animate-spin">⚙️</span>}
          </h3>
          <p className="text-sm text-gray-500">Contrôle adaptatif intelligent</p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getHealthColor(state.healthScore)}`}>
            {state.healthScore.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500">Health Score</div>
        </div>
      </div>

      {/* Sélecteur de Tier (Taille entreprise) */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Taille de l'entreprise / Infrastructure
        </label>
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(TIER_LABELS) as TechTier[]).map((tier) => (
            <button
              key={tier}
              onClick={() => handleTierChange(tier)}
              disabled={isUpdating}
              className={`
                p-3 rounded-lg border-2 transition-all duration-200
                ${state.tier === tier 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <div className="text-2xl mb-1">{TIER_LABELS[tier].icon}</div>
              <div className="font-semibold text-sm">{TIER_LABELS[tier].label}</div>
              <div className="text-xs text-gray-500">{TIER_LABELS[tier].desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Slider Mode Performance */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Mode Performance: <span className="font-bold">{MODE_CONFIG[state.mode].label}</span>
          <span className={`ml-2 px-2 py-1 rounded text-xs text-white ${MODE_CONFIG[state.mode].color}`}>
            {MODE_CONFIG[state.mode].impact}
          </span>
        </label>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="3"
            step="1"
            value={Object.keys(MODE_CONFIG).indexOf(state.mode)}
            onChange={(e) => handleModeChange(Object.keys(MODE_CONFIG)[parseInt(e.target.value)] as PerformanceMode)}
            disabled={isUpdating}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>🌱 Éco</span>
            <span>⚖️ Équilibré</span>
            <span>🚀 Perf</span>
            <span>🔥 Ultra</span>
          </div>
        </div>
      </div>

      {/* Métriques en temps réel */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <div className="text-xs text-gray-500">Débit Max</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {(state.limits.maxRps / 1000).toFixed(1)}k req/s
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Budget IA/jour</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            ${state.limits.llmBudgetPerDay.toFixed(0)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Connexions</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {state.activeConnections}
          </div>
        </div>
      </div>

      {/* Indicateur de transition */}
      {isUpdating && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Reconfiguration en cours... Optimisation de l'infrastructure
          </p>
        </div>
      )}
    </div>
  );
};

export default PluginControlPanel;
