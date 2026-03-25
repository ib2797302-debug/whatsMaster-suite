/**
 * @module AdaptiveGovernor Tests
 * @description Tests unitaires complets pour le système de gouvernance adaptative.
 * Valide la sécurité des transitions, la gestion des ressources et les performances.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AdaptiveGovernor, TechTier, PerformanceMode } from '../adaptive-governor';

describe('AdaptiveGovernor', () => {
  let governor: AdaptiveGovernor;

  beforeEach(() => {
    governor = new AdaptiveGovernor();
    vi.clearAllMocks();
  });

  describe('Registration', () => {
    it('devrait enregistrer un plugin avec configuration starter par défaut', () => {
      const state = governor.registerPlugin('test-plugin');
      
      expect(state.pluginId).toBe('test-plugin');
      expect(state.tier).toBe('starter');
      expect(state.mode).toBe('balanced');
      expect(state.healthScore).toBe(100);
      expect(state.limits.maxRps).toBe(100);
      expect(state.stack.database).toBe('sqlite');
    });

    it('devrait enregistrer un plugin avec tier personnalisé', () => {
      const state = governor.registerPlugin('enterprise-plugin', 'enterprise');
      
      expect(state.tier).toBe('enterprise');
      expect(state.limits.maxRps).toBe(10000);
      expect(state.stack.messageQueue).toBe('kafka');
    });

    it('ne devrait pas dupliquer un plugin déjà enregistré', () => {
      governor.registerPlugin('unique-plugin');
      const state1 = governor.registerPlugin('unique-plugin');
      const state2 = governor.getState('unique-plugin');
      
      expect(state1).toBe(state2); // Même référence
    });
  });

  describe('Reconfiguration Dynamique', () => {
    it('devrait passer de starter à growth sans erreur', async () => {
      governor.registerPlugin('scaling-plugin', 'starter');
      const newState = await governor.reconfigure('scaling-plugin', 'growth');
      
      expect(newState.tier).toBe('growth');
      expect(newState.limits.maxRps).toBe(1000);
      expect(newState.stack.cache).toBe('redis');
    });

    it('devrait appliquer le mode performance avec multiplicateur correct', async () => {
      governor.registerPlugin('perf-plugin', 'growth');
      const newState = await governor.reconfigure('perf-plugin', undefined, 'performance');
      
      expect(newState.mode).toBe('performance');
      // Growth (1000) * Performance (1.5) = 1500
      expect(newState.limits.maxRps).toBe(1500);
    });

    it('devrait gérer les transitions concurrentes (Race Condition Fix)', async () => {
      governor.registerPlugin('concurrent-plugin', 'starter');
      
      // Lancer deux reconfigurations simultanées
      const promises = Promise.all([
        governor.reconfigure('concurrent-plugin', 'enterprise'),
        governor.reconfigure('concurrent-plugin', 'hyperscale')
      ]);
      
      // Ne devrait pas planter
      await expect(promises).resolves.toBeDefined();
      
      const finalState = governor.getState('concurrent-plugin');
      expect(finalState?.isTransitioning).toBe(false);
    });

    it('devrait émettre des événements de transition', async () => {
      governor.registerPlugin('event-plugin');
      const startMock = vi.fn();
      const completeMock = vi.fn();
      
      governor.on('transition:start', startMock);
      governor.on('transition:complete', completeMock);
      
      await governor.reconfigure('event-plugin', 'growth');
      
      expect(startMock).toHaveBeenCalledTimes(1);
      expect(completeMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Nettoyage des Ressources (Memory Leak Fix)', () => {
    it('devrait détecter changement de cache et nettoyer', async () => {
      governor.registerPlugin('cleanup-plugin', 'starter'); // memory
      
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation();
      
      await governor.reconfigure('cleanup-plugin', 'growth'); // redis
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Cleanup cleanup-plugin')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Cache: memory -> redis')
      );
      
      consoleSpy.mockRestore();
    });

    it('ne devrait pas nettoyer si stack identique', async () => {
      governor.registerPlugin('no-cleanup-plugin', 'growth');
      
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation();
      
      // Changement de mode mais même tier donc même stack
      await governor.reconfigure('no-cleanup-plugin', undefined, 'eco');
      
      // Aucun cleanup attendu car stack identique
      const cleanupCalls = consoleSpy.mock.calls.filter(call => 
        call[0].includes('Cleanup')
      );
      expect(cleanupCalls.length).toBe(0);
      
      consoleSpy.mockRestore();
    });
  });

  describe('Health Check & Auto-Scaling', () => {
    it('devrait suggérer scale_up quand charge > 90%', () => {
      governor.registerPlugin('load-plugin', 'starter');
      const state = governor.getState('load-plugin')!;
      
      // Simuler charge élevée (4.5 / 5 = 90%)
      state.activeConnections = 4; 
      state.limits.maxConcurrentAgents = 5;
      
      const recommendationMock = vi.fn();
      governor.on('recommendation:scale_up', recommendationMock);
      
      governor.runHealthCheck('load-plugin');
      
      expect(recommendationMock).toHaveBeenCalledWith(
        expect.objectContaining({ pluginId: 'load-plugin', reason: 'High Load' })
      );
    });

    it('devrait suggérer scale_down quand utilisation < 20% en mode performance', () => {
      governor.registerPlugin('idle-plugin', 'enterprise');
      const state = governor.getState('idle-plugin')!;
      state.mode = 'performance';
      
      // Simuler faible charge (10 / 500 = 2%)
      state.activeConnections = 10;
      state.limits.maxConcurrentAgents = 500;
      
      const recommendationMock = vi.fn();
      governor.on('recommendation:scale_down', recommendationMock);
      
      governor.runHealthCheck('idle-plugin');
      
      expect(recommendationMock).toHaveBeenCalledWith(
        expect.objectContaining({ pluginId: 'idle-plugin', reason: 'Low Utilization' })
      );
    });

    it('devrait dégrader healthScore si surcharge', () => {
      governor.registerPlugin('overload-plugin', 'starter');
      const state = governor.getState('overload-plugin')!;
      
      state.activeConnections = 10; // > maxRps
      state.limits.maxConcurrentAgents = 5;
      state.healthScore = 100;
      
      governor.runHealthCheck('overload-plugin');
      
      expect(state.healthScore).toBeLessThan(100);
    });
  });

  describe('Validation des Limites', () => {
    it('devrait avoir des limites cohérentes entre tiers', () => {
      const starter = governor.registerPlugin('s1', 'starter');
      const growth = governor.registerPlugin('g1', 'growth');
      const enterprise = governor.registerPlugin('e1', 'enterprise');
      const hyperscale = governor.registerPlugin('h1', 'hyperscale');
      
      expect(starter.limits.maxRps).toBeLessThan(growth.limits.maxRps);
      expect(growth.limits.maxRps).toBeLessThan(enterprise.limits.maxRps);
      expect(enterprise.limits.maxRps).toBeLessThan(hyperscale.limits.maxRps);
    });

    it('devrait avoir coût plus élevé en mode ultra', async () => {
      governor.registerPlugin('cost-plugin', 'growth');
      
      const balanced = await governor.reconfigure('cost-plugin', undefined, 'balanced');
      const ultra = await governor.reconfigure('cost-plugin', undefined, 'ultra');
      
      expect(ultra.limits.llmBudgetPerDay).toBeGreaterThan(balanced.limits.llmBudgetPerDay);
      // Ultra cost multiplier = 6.0, Balanced = 1.0
      expect(ultra.limits.llmBudgetPerDay).toBeCloseTo(balanced.limits.llmBudgetPerDay * 6, 0);
    });
  });

  describe('Performance & Stress Test', () => {
    it('devrait gérer 1000 plugins simultanément', () => {
      for (let i = 0; i < 1000; i++) {
        governor.registerPlugin(`plugin-${i}`);
      }
      
      expect(governor.getAllStates().size).toBe(1000);
    });

    it('devrait gérer 100 reconfigurations rapides', async () => {
      governor.registerPlugin('stress-plugin', 'starter');
      
      const promises = [];
      for (let i = 0; i < 100; i++) {
        const tier: TechTier = i % 2 === 0 ? 'growth' : 'starter';
        promises.push(governor.reconfigure('stress-plugin', tier));
      }
      
      await Promise.all(promises);
      
      const finalState = governor.getState('stress-plugin');
      expect(finalState?.isTransitioning).toBe(false);
      expect(finalState?.healthScore).toBeGreaterThan(0);
    });
  });
});
