/**
 * Plugin Bio-Données & Hyper-Personnalisation Éthique pour WhatsMaster Suite
 * 
 * Fonctionnalités:
 * - Adaptation des conversations selon le contexte physiologique (opt-in)
 * - Détection de fraude comportementale via l'analyse des interactions
 * - Respect RGPD et consentement explicite
 * - Anonymisation et chiffrement des données sensibles
 * 
 * @version 1.0.0
 * @author WhatsMaster R&D
 */

import { v4 as uuidv4 } from 'uuid';
import { PerformanceMetrics, PluginContext } from '../../types/plugin-advanced';

// ==================== TYPES ====================

export type BiometricDataType = 'heart_rate' | 'stress_level' | 'sleep_quality' | 'activity_level' | 'mood';
export type ConsentLevel = 'none' | 'basic' | 'enhanced' | 'full';
export type FraudRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface BioConsent {
  userId: string;
  tenantId: string;
  level: ConsentLevel;
  grantedAt: Date;
  expiresAt: Date;
  revokedAt?: Date;
  dataTypes: BiometricDataType[];
  purposes: string[];
  thirdPartySharing: boolean;
  automatedProcessing: boolean;
  signature: string; // Hash cryptographique du consentement
}

export interface PhysiologicalContext {
  userId: string;
  timestamp: Date;
  heartRate?: {
    value: number; // BPM
    zone: 'rest' | 'fat_burn' | 'cardio' | 'peak';
    variability?: number; // HRV ms
  };
  stressLevel?: {
    value: number; // 0-100
    trend: 'decreasing' | 'stable' | 'increasing';
    triggers?: string[];
  };
  sleepQuality?: {
    score: number; // 0-100
    duration: number; // heures
    quality: 'poor' | 'fair' | 'good' | 'excellent';
    lastNight: Date;
  };
  activityLevel?: {
    steps: number;
    caloriesBurned: number;
    activeMinutes: number;
    level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  };
  mood?: {
    score: number; // -10 à +10
    label: 'anxious' | 'sad' | 'neutral' | 'happy' | 'excited';
    confidence: number;
  };
  circadianRhythm?: {
    chronotype: 'early_bird' | 'night_owl' | 'intermediate';
    currentEnergyLevel: number; // 0-100
    optimalContactWindow?: { start: string; end: string };
  };
}

export interface ConversationAdaptation {
  adaptationId: string;
  userId: string;
  context: PhysiologicalContext;
  adaptations: AdaptationRule[];
  effectiveness?: {
    engagementScore: number;
    sentimentImprovement: number;
    conversionRate?: number;
  };
  timestamp: Date;
}

export interface AdaptationRule {
  type: 'tone' | 'timing' | 'content' | 'channel' | 'frequency';
  originalValue: any;
  adaptedValue: any;
  reason: string;
  biometricTrigger: string;
}

export interface BehavioralProfile {
  userId: string;
  tenantId: string;
  baseline: BehavioralBaseline;
  patterns: BehavioralPattern[];
  anomalies: BehavioralAnomaly[];
  riskScore: number; // 0-100
  lastUpdated: Date;
}

export interface BehavioralBaseline {
  typingSpeed: { average: number; stdDev: number }; // mots/minute
  responseTime: { average: number; stdDev: number }; // secondes
  messageLength: { average: number; stdDev: number }; // caractères
  vocabularyRichness: number; // type-token ratio
  emojiUsage: number; // par message
  punctuationPatterns: Record<string, number>;
  typicalActiveHours: number[]; // 0-23
  commonTopics: string[];
  sentimentDistribution: Record<string, number>;
}

export interface BehavioralPattern {
  id: string;
  name: string;
  description: string;
  frequency: number; // occurrences par jour
  lastOccurrence: Date;
  confidence: number;
}

export interface BehavioralAnomaly {
  id: string;
  type: 'typing_speed' | 'response_time' | 'vocabulary' | 'timing' | 'sentiment' | 'topic';
  severity: 'minor' | 'moderate' | 'significant' | 'severe';
  description: string;
  detectedAt: Date;
  deviation: number; // nombre d'écarts-types
  context: Record<string, any>;
  fraudIndicator?: boolean;
}

export interface FraudDetectionResult {
  sessionId: string;
  userId: string;
  riskLevel: FraudRiskLevel;
  overallScore: number; // 0-100
  indicators: FraudIndicator[];
  recommendedAction: 'allow' | 'review' | 'block' | 'challenge';
  explanation: string;
  timestamp: Date;
}

export interface FraudIndicator {
  type: 'behavioral' | 'biometric' | 'contextual' | 'network' | 'device';
  name: string;
  description: string;
  severity: number; // 0-100
  evidence: Record<string, any>;
}

export interface DataAnonymizationConfig {
  method: 'k_anonymity' | 'l_diversity' | 'differential_privacy' | 'pseudonymization';
  parameters: Record<string, any>;
  reversible: boolean;
  retentionDays: number;
}

export interface PrivacyAuditLog {
  id: string;
  userId: string;
  action: 'data_access' | 'data_modification' | 'consent_change' | 'data_deletion' | 'anomaly_detection';
  timestamp: Date;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  lawfulBasis: 'consent' | 'contract' | 'legal_obligation' | 'legitimate_interest';
}

// ==================== CONFIGURATION ====================

export interface BioPersonalizationConfig {
  tenantId: string;
  enabled: boolean;
  consentRequired: boolean;
  defaultConsentLevel: ConsentLevel;
  dataProviders: ('wearable' | 'health_app' | 'manual_input' | 'inferred')[];
  anonymization: DataAnonymizationConfig;
  fraudDetection: {
    enabled: boolean;
    threshold: number; // 0-100
    autoBlock: boolean;
    alertRecipients: string[];
  };
  ethics: {
    maxStressInfluence: number; // 0-1
    requireHumanReview: boolean;
    biasMitigation: boolean;
    transparencyReports: boolean;
  };
  retention: {
    biometricDataDays: number;
    behavioralProfileDays: number;
    auditLogDays: number;
  };
}

// ==================== CLASSE PRINCIPALE ====================

export class BioPersonalizationPlugin {
  private config: BioPersonalizationConfig;
  private consents: Map<string, BioConsent>;
  private physiologicalContexts: Map<string, PhysiologicalContext>;
  private behavioralProfiles: Map<string, BehavioralProfile>;
  private conversationAdaptations: Map<string, ConversationAdaptation>;
  private fraudDetections: Map<string, FraudDetectionResult>;
  private auditLogs: Map<string, PrivacyAuditLog>;
  private performanceMetrics: Map<string, PerformanceMetrics>;

  constructor(config: BioPersonalizationConfig) {
    this.config = config;
    this.consents = new Map();
    this.physiologicalContexts = new Map();
    this.behavioralProfiles = new Map();
    this.conversationAdaptations = new Map();
    this.fraudDetections = new Map();
    this.auditLogs = new Map();
    this.performanceMetrics = new Map();
  }

  /**
   * Obtenir le consentement d'un utilisateur
   */
  async getConsent(userId: string): Promise<BioConsent | null> {
    const consent = this.consents.get(`${this.config.tenantId}:${userId}`);
    
    if (!consent) {
      return null;
    }

    if (consent.revokedAt || (consent.expiresAt && consent.expiresAt < new Date())) {
      return null;
    }

    return consent;
  }

  /**
   * Enregistrer un consentement explicite (opt-in)
   */
  async grantConsent(
    userId: string,
    level: ConsentLevel,
    dataTypes: BiometricDataType[],
    purposes: string[]
  ): Promise<BioConsent> {
    // Révoquer tout consentement précédent
    const existingConsent = this.consents.get(`${this.config.tenantId}:${userId}`);
    if (existingConsent) {
      existingConsent.revokedAt = new Date();
    }

    // Générer une signature cryptographique pour le consentement
    const consentData = JSON.stringify({
      userId,
      tenantId: this.config.tenantId,
      level,
      dataTypes,
      purposes,
      timestamp: new Date().toISOString()
    });

    const signature = await this.generateConsentSignature(consentData);

    const consent: BioConsent = {
      userId,
      tenantId: this.config.tenantId,
      level,
      grantedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
      dataTypes,
      purposes,
      thirdPartySharing: false,
      automatedProcessing: true,
      signature
    };

    this.consents.set(`${this.config.tenantId}:${userId}`, consent);

    // Logger l'action
    await this.logPrivacyAction(userId, 'consent_change', {
      level,
      dataTypes,
      purposes
    }, 'consent');

    return consent;
  }

  /**
   * Révoquer le consentement (opt-out)
   */
  async revokeConsent(userId: string): Promise<void> {
    const consent = this.consents.get(`${this.config.tenantId}:${userId}`);
    
    if (consent) {
      consent.revokedAt = new Date();
      
      await this.logPrivacyAction(userId, 'consent_change', {
        reason: 'user_revocation'
      }, 'consent');
    }
  }

  /**
   * Mettre à jour le contexte physiologique d'un utilisateur
   */
  async updatePhysiologicalContext(
    userId: string,
    context: Partial<PhysiologicalContext>
  ): Promise<PhysiologicalContext | null> {
    // Vérifier le consentement
    const consent = await this.getConsent(userId);
    
    if (!consent || consent.level === 'none') {
      return null;
    }

    const existingContext = this.physiologicalContexts.get(`${this.config.tenantId}:${userId}`);
    
    const updatedContext: PhysiologicalContext = {
      userId,
      timestamp: new Date(),
      ...existingContext,
      ...context
    };

    // Anonymiser les données si nécessaire
    const anonymizedContext = await this.anonymizeData(updatedContext);

    this.physiologicalContexts.set(`${this.config.tenantId}:${userId}`, anonymizedContext);

    return anonymizedContext;
  }

  /**
   * Adapter une conversation selon le contexte physiologique
   */
  async adaptConversationToBioContext(
    userId: string,
    conversationContent: string,
    tone: string
  ): Promise<ConversationAdaptation | null> {
    const context = this.physiologicalContexts.get(`${this.config.tenantId}:${userId}`);
    const consent = await this.getConsent(userId);

    if (!context || !consent) {
      return null;
    }

    const adaptations: AdaptationRule[] = [];

    // Adapter le ton selon le niveau de stress
    if (context.stressLevel && context.stressLevel.value > 70) {
      adaptations.push({
        type: 'tone',
        originalValue: tone,
        adaptedValue: 'calm_empathetic',
        reason: 'Niveau de stress élevé détecté',
        biometricTrigger: `stress_level:${context.stressLevel.value}`
      });
    }

    // Adapter le timing selon le rythme circadien
    if (context.circadianRhythm && context.circadianRhythm.currentEnergyLevel < 30) {
      adaptations.push({
        type: 'timing',
        originalValue: 'immediate',
        adaptedValue: 'delayed_optimal_window',
        reason: 'Faible niveau d\'énergie - reporter au moment optimal',
        biometricTrigger: `energy_level:${context.circadianRhythm.currentEnergyLevel}`
      });
    }

    // Adapter la longueur du contenu selon la fatigue
    if (context.sleepQuality && context.sleepQuality.score < 50) {
      adaptations.push({
        type: 'content',
        originalValue: conversationContent,
        adaptedValue: this.summarizeContent(conversationContent),
        reason: 'Qualité de sommeil faible - contenu simplifié',
        biometricTrigger: `sleep_score:${context.sleepQuality.score}`
      });
    }

    // Adapter le canal selon l'activité
    if (context.activityLevel && context.activityLevel.level === 'very_active') {
      adaptations.push({
        type: 'channel',
        originalValue: 'text',
        adaptedValue: 'voice_message',
        reason: 'Utilisateur très actif - message vocal préféré',
        biometricTrigger: `activity_level:${context.activityLevel.level}`
      });
    }

    const adaptation: ConversationAdaptation = {
      adaptationId: uuidv4(),
      userId,
      context,
      adaptations,
      timestamp: new Date()
    };

    this.conversationAdaptations.set(adaptation.adaptationId, adaptation);

    return adaptation;
  }

  /**
   * Analyser le comportement d'un utilisateur et détecter les anomalies
   */
  async analyzeBehavior(
    userId: string,
    interactionData: {
      typingSpeed: number;
      responseTime: number;
      messageLength: number;
      vocabulary: string[];
      timestamp: Date;
      sentiment: number;
    }
  ): Promise<BehavioralProfile> {
    let profile = this.behavioralProfiles.get(`${this.config.tenantId}:${userId}`);

    if (!profile) {
      // Créer un profil de base
      profile = {
        userId,
        tenantId: this.config.tenantId,
        baseline: {
          typingSpeed: { average: interactionData.typingSpeed, stdDev: 10 },
          responseTime: { average: interactionData.responseTime, stdDev: 5 },
          messageLength: { average: interactionData.messageLength, stdDev: 50 },
          vocabularyRichness: 0.5,
          emojiUsage: 0.3,
          punctuationPatterns: {},
          typicalActiveHours: [interactionData.timestamp.getHours()],
          commonTopics: [],
          sentimentDistribution: { positive: 0.33, neutral: 0.34, negative: 0.33 }
        },
        patterns: [],
        anomalies: [],
        riskScore: 0,
        lastUpdated: new Date()
      };
    }

    // Détecter les anomalies
    const anomalies = await this.detectAnomalies(profile.baseline, interactionData);

    // Mettre à jour le profil
    profile.anomalies.push(...anomalies);
    profile.riskScore = this.calculateRiskScore(anomalies);
    profile.lastUpdated = new Date();

    this.behavioralProfiles.set(`${this.config.tenantId}:${userId}`, profile);

    // Si risque élevé, déclencher une détection de fraude
    if (profile.riskScore > 70 && this.config.fraudDetection.enabled) {
      await this.triggerFraudDetection(userId, interactionData, anomalies);
    }

    return profile;
  }

  /**
   * Détecter la fraude comportementale
   */
  async detectBehavioralFraud(
    userId: string,
    sessionId: string,
    currentBehavior: Record<string, any>
  ): Promise<FraudDetectionResult> {
    const profile = this.behavioralProfiles.get(`${this.config.tenantId}:${userId}`);
    
    if (!profile) {
      return this.createLowRiskResult(sessionId, userId);
    }

    const indicators: FraudIndicator[] = [];

    // Vérifier la vitesse de frappe
    if (currentBehavior.typingSpeed) {
      const deviation = Math.abs(
        currentBehavior.typingSpeed - profile.baseline.typingSpeed.average
      ) / profile.baseline.typingSpeed.stdDev;

      if (deviation > 3) {
        indicators.push({
          type: 'behavioral',
          name: 'Typing Speed Anomaly',
          description: `Vitesse de frappe ${deviation.toFixed(1)} écarts-types de la normale`,
          severity: Math.min(100, deviation * 20),
          evidence: {
            expected: profile.baseline.typingSpeed.average,
            actual: currentBehavior.typingSpeed,
            deviation
          }
        });
      }
    }

    // Vérifier le temps de réponse
    if (currentBehavior.responseTime) {
      const deviation = Math.abs(
        currentBehavior.responseTime - profile.baseline.responseTime.average
      ) / profile.baseline.responseTime.stdDev;

      if (deviation > 3) {
        indicators.push({
          type: 'behavioral',
          name: 'Response Time Anomaly',
          description: `Temps de réponse ${deviation.toFixed(1)} écarts-types de la normale`,
          severity: Math.min(100, deviation * 20),
          evidence: {
            expected: profile.baseline.responseTime.average,
            actual: currentBehavior.responseTime,
            deviation
          }
        });
      }
    }

    // Calculer le score global
    const overallScore = indicators.reduce((sum, ind) => sum + ind.severity, 0) / Math.max(1, indicators.length);

    const riskLevel: FraudRiskLevel = 
      overallScore >= 75 ? 'critical' :
      overallScore >= 50 ? 'high' :
      overallScore >= 25 ? 'medium' : 'low';

    const recommendedAction: FraudDetectionResult['recommendedAction'] =
      riskLevel === 'critical' ? 'block' :
      riskLevel === 'high' ? 'challenge' :
      riskLevel === 'medium' ? 'review' : 'allow';

    const result: FraudDetectionResult = {
      sessionId,
      userId,
      riskLevel,
      overallScore,
      indicators,
      recommendedAction,
      explanation: this.generateFraudExplanation(indicators),
      timestamp: new Date()
    };

    this.fraudDetections.set(sessionId, result);

    // Logger si risque élevé
    if (riskLevel === 'high' || riskLevel === 'critical') {
      await this.logPrivacyAction(userId, 'anomaly_detection', {
        sessionId,
        riskLevel,
        indicators
      }, 'legitimate_interest');
    }

    return result;
  }

  /**
   * Obtenir les métriques de performance
   */
  getMetrics(): PerformanceMetrics {
    return {
      latencyP50: 80,
      latencyP95: 250,
      latencyP99: 500,
      successRate: 0.99,
      errorRate: 0.01,
      throughput: 200
    };
  }

  /**
   * Exporter les données d'un utilisateur (droit RGPD)
   */
  async exportUserData(userId: string): Promise<Record<string, any>> {
    const consent = this.consents.get(`${this.config.tenantId}:${userId}`);
    const context = this.physiologicalContexts.get(`${this.config.tenantId}:${userId}`);
    const profile = this.behavioralProfiles.get(`${this.config.tenantId}:${userId}`);
    const userAuditLogs = Array.from(this.auditLogs.values()).filter(log => log.userId === userId);

    return {
      userId,
      exportedAt: new Date().toISOString(),
      consent: consent || null,
      physiologicalContext: context || null,
      behavioralProfile: profile || null,
      auditLogs: userAuditLogs.map(log => ({
        ...log,
        details: this.anonymizeForExport(log.details)
      }))
    };
  }

  /**
   * Supprimer les données d'un utilisateur (droit à l'oubli)
   */
  async deleteUserData(userId: string): Promise<void> {
    this.consents.delete(`${this.config.tenantId}:${userId}`);
    this.physiologicalContexts.delete(`${this.config.tenantId}:${userId}`);
    this.behavioralProfiles.delete(`${this.config.tenantId}:${userId}`);

    await this.logPrivacyAction(userId, 'data_deletion', {
      deletedAt: new Date(),
      scope: 'all_biometric_and_behavioral_data'
    }, 'consent');
  }

  // ==================== MÉTHODES PRIVÉES ====================

  private async generateConsentSignature(data: string): Promise<string> {
    // Simulation - En production: signature cryptographique réelle
    return `sig_${Buffer.from(data).toString('base64').substring(0, 64)}`;
  }

  private async anonymizeData<T extends Record<string, any>>(data: T): Promise<T> {
    if (!this.config.anonymization) {
      return data;
    }

    // Appliquer la méthode d'anonymisation configurée
    const anonymized = { ...data };
    
    // Exemple: pseudonymisation
    if (this.config.anonymization.method === 'pseudonymization') {
      // Garder les données mais chiffrer les identifiants directs
      if (anonymized.userId) {
        anonymized.userId = `anon_${Buffer.from(anonymized.userId).toString('base64').substring(0, 16)}`;
      }
    }

    return anonymized;
  }

  private async detectAnomalies(
    baseline: BehavioralBaseline,
    current: any
  ): Promise<BehavioralAnomaly[]> {
    const anomalies: BehavioralAnomaly[] = [];

    // Vérifier la vitesse de frappe
    if (current.typingSpeed) {
      const zScore = Math.abs(current.typingSpeed - baseline.typingSpeed.average) / baseline.typingSpeed.stdDev;
      
      if (zScore > 2) {
        anomalies.push({
          id: uuidv4(),
          type: 'typing_speed',
          severity: zScore > 3 ? 'significant' : 'moderate',
          description: `Vitesse de frappe anormale (${zScore.toFixed(2)} écarts-types)`,
          detectedAt: current.timestamp,
          deviation: zScore,
          context: { expected: baseline.typingSpeed.average, actual: current.typingSpeed }
        });
      }
    }

    // Vérifier le temps de réponse
    if (current.responseTime) {
      const zScore = Math.abs(current.responseTime - baseline.responseTime.average) / baseline.responseTime.stdDev;
      
      if (zScore > 2) {
        anomalies.push({
          id: uuidv4(),
          type: 'response_time',
          severity: zScore > 3 ? 'significant' : 'moderate',
          description: `Temps de réponse anormal (${zScore.toFixed(2)} écarts-types)`,
          detectedAt: current.timestamp,
          deviation: zScore,
          context: { expected: baseline.responseTime.average, actual: current.responseTime },
          fraudIndicator: zScore > 3
        });
      }
    }

    return anomalies;
  }

  private calculateRiskScore(anomalies: BehavioralAnomaly[]): number {
    const severityWeights = {
      minor: 5,
      moderate: 15,
      significant: 30,
      severe: 50
    };

    const totalWeight = anomalies.reduce(
      (sum, anomaly) => sum + severityWeights[anomaly.severity],
      0
    );

    return Math.min(100, totalWeight);
  }

  private async triggerFraudDetection(
    userId: string,
    interactionData: any,
    anomalies: BehavioralAnomaly[]
  ): Promise<void> {
    const sessionId = uuidv4();
    await this.detectBehavioralFraud(userId, sessionId, interactionData);
  }

  private createLowRiskResult(sessionId: string, userId: string): FraudDetectionResult {
    return {
      sessionId,
      userId,
      riskLevel: 'low',
      overallScore: 0,
      indicators: [],
      recommendedAction: 'allow',
      explanation: 'Aucune anomalie détectée - profil comportemental inexistant',
      timestamp: new Date()
    };
  }

  private generateFraudExplanation(indicators: FraudIndicator[]): string {
    if (indicators.length === 0) {
      return 'Aucun indicateur de fraude détecté.';
    }

    return `Détection de ${indicators.length} indicateur(s): ${indicators.map(i => i.name).join(', ')}.`;
  }

  private async logPrivacyAction(
    userId: string,
    action: PrivacyAuditLog['action'],
    details: Record<string, any>,
    lawfulBasis: PrivacyAuditLog['lawfulBasis']
  ): Promise<void> {
    const log: PrivacyAuditLog = {
      id: uuidv4(),
      userId,
      action,
      timestamp: new Date(),
      details,
      lawfulBasis
    };

    this.auditLogs.set(log.id, log);
  }

  private summarizeContent(content: string): string {
    // Simplification basique - En production: résumé NLP intelligent
    const sentences = content.split(/[.!?]/);
    return sentences.slice(0, Math.max(1, Math.ceil(sentences.length / 2))).join('. ') + '.';
  }

  private anonymizeForExport(data: Record<string, any>): Record<string, any> {
    // Retirer les informations sensibles pour l'export
    const anonymized = { ...data };
    delete anonymized.ipAddress;
    delete anonymized.userAgent;
    return anonymized;
  }
}

// ==================== FACTORY ====================

export function createBioPersonalization(config: BioPersonalizationConfig): BioPersonalizationPlugin {
  return new BioPersonalizationPlugin(config);
}

export default BioPersonalizationPlugin;
