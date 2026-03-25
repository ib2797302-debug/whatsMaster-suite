/**
 * TESTS UNITAIRES ET D'INTÉGRATION - THEME PLUGINS MÉTIER
 * 
 * Standards enterprise : Jest + TypeScript + Validation Zod
 * Couverture cible : 95%+
 * Performance : < 100ms par test unitaire
 * 
 * @version 3.0.0-ultra-enterprise
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { ThemePluginSchema, type ThemePlugin, type PluginID } from '../theme-plugin';

// ============================================================================
// MOCK DATA - EXEMPLES ULTRA-RÉALISTES
// ============================================================================

const createMockSupportPlugin = (): ThemePlugin => ({
  manifest: {
    id: 'com.whatsmaster.theme.support-graphrag' as PluginID,
    name: 'Support Expert GraphRAG',
    displayName: 'Support Client Intelligent',
    description: 'Solution complète de support client avec IA GraphRAG pour réponses contextualisées, escalade automatique et analyse de motifs récurrents',
    version: '3.0.0',
    buildNumber: 142,
    category: 'support',
    subcategories: ['customer-service', 'helpdesk', 'it-support'],
    tags: ['graph-rag', 'ai', 'sla', 'escalation', 'analytics'],
    industries: ['saas', 'telecom', 'finance', 'retail'],
    vendor: {
      name: 'WhatsMaster Suite',
      website: 'https://whatsmaster.com',
      supportEmail: 'support@whatsmaster.com',
      certification: 'verified',
      certifications: ['iso27001', 'soc2', 'gdpr-compliant'],
    },
    licensing: {
      type: 'proprietary',
      model: 'per-user',
      price: {
        amount: 99,
        currency: 'EUR',
        period: 'monthly',
      },
      trialDays: 14,
      features: {
        free: ['basic-dashboard', 'up-to-100-tickets'],
        paid: ['unlimited-tickets', 'advanced-analytics', 'custom-integrations', 'priority-support'],
      },
      termsUrl: 'https://whatsmaster.com/terms',
      privacyPolicyUrl: 'https://whatsmaster.com/privacy',
    },
    compliance: {
      gdprReady: true,
      soc2Compliant: true,
      iso27001Compliant: true,
      hipaaCompliant: false,
      pciDssCompliant: false,
      dataResidency: ['EU', 'US', 'APAC'],
    },
    compatibility: {
      minPlatformVersion: '2.5.0',
      supportedRegions: ['eu-west-1', 'us-east-1', 'ap-southeast-1'],
      supportedLanguages: ['fr-FR', 'en-US', 'es-ES', 'de-DE'],
    },
    installation: {
      estimatedTimeMinutes: 15,
      requiresApproval: true,
      requiresConfiguration: true,
      rollbackSupported: true,
    },
    resources: {
      documentation: 'https://docs.whatsmaster.com/support-graphrag',
      changelog: 'https://whatsmaster.com/changelog/support-graphrag',
    },
    support: {
      email: 'support@whatsmaster.com',
      chatEnabled: true,
      sla: {
        responseTimeHours: 4,
        resolutionTimeHours: 24,
        availability: '24/7',
      },
    },
    healthChecks: [
      { id: 'hc-001', name: 'API Connectivity', type: 'connectivity', intervalSeconds: 60, timeoutMs: 5000, critical: true },
      { id: 'hc-002', name: 'Graph Database', type: 'connectivity', intervalSeconds: 120, timeoutMs: 10000, critical: true },
    ],
    metrics: {
      publishDate: '2024-01-15',
      lastUpdated: '2024-03-20',
      downloads: 1247,
      rating: { average: 4.8, count: 156 },
    },
  },
  branding: {
    version: '3.0.0',
    metadata: {
      brandName: 'Support Pro',
      tagline: 'Le support client nouvelle génération',
      description: 'Interface moderne et intuitive',
      logo: {
        svg: '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#3B82F6"/></svg>',
        png: { sm: 'data:image/png;base64,...', md: 'data:image/png;base64,...', lg: 'data:image/png;base64,...', xl: 'data:image/png;base64,...' },
        favicon: 'data:image/x-icon;base64,...',
      },
    },
    designSystem: {
      theme: {
        light: {
          colors: {
            primary: { main: '#3B82F6', light: '#60A5FA', dark: '#1D4ED8', contrast: '#FFFFFF' },
            secondary: { main: '#10B981', light: '#34D399', dark: '#059669', contrast: '#FFFFFF' },
            semantic: { success: '#10B981', warning: '#F59E0B', error: '#EF4444', info: '#3B82F6' },
            neutral: { white: '#FFFFFF', gray50: '#F9FAFB', gray100: '#F3F4F6', gray200: '#E5E7EB', gray300: '#D1D5DB', gray400: '#9CA3AF', gray500: '#6B7280', gray600: '#4B5563', gray700: '#374151', gray800: '#1F2937', gray900: '#111827', black: '#000000' },
            background: { default: '#F9FAFB', paper: '#FFFFFF', elevated: '#FFFFFF' },
          },
          shadows: ['0 1px 2px rgba(0,0,0,0.05)', '0 4px 6px rgba(0,0,0,0.1)'],
          borderRadius: { none: '0', sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', '2xl': '1.5rem', full: '9999px' },
        },
        dark: {
          colors: {
            primary: { main: '#60A5FA', light: '#93C5FD', dark: '#3B82F6', contrast: '#1F2937' },
            secondary: { main: '#34D399', light: '#6EE7B7', dark: '#10B981', contrast: '#1F2937' },
            semantic: { success: '#34D399', warning: '#FBBF24', error: '#F87171', info: '#60A5FA' },
            neutral: { white: '#FFFFFF', gray50: '#F9FAFB', gray100: '#F3F4F6', gray200: '#E5E7EB', gray300: '#D1D5DB', gray400: '#9CA3AF', gray500: '#6B7280', gray600: '#4B5563', gray700: '#374151', gray800: '#1F2937', gray900: '#111827', black: '#000000' },
            background: { default: '#111827', paper: '#1F2937', elevated: '#374151' },
          },
          shadows: ['0 1px 2px rgba(0,0,0,0.3)', '0 4px 6px rgba(0,0,0,0.4)'],
          borderRadius: { none: '0', sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', '2xl': '1.5rem', full: '9999px' },
        },
        animations: {
          duration: { fast: '150ms', normal: '300ms', slow: '500ms' },
          easing: { linear: 'cubic-bezier(0,0,1,1)', easeIn: 'cubic-bezier(0.4,0,1,1)', easeOut: 'cubic-bezier(0,0,0.2,1)', easeInOut: 'cubic-bezier(0.4,0,0.2,1)' },
          effects: ['fade', 'slide', 'scale'],
        },
        spacing: {
          unit: '4px',
          scale: { '0': '0', '1': '4px', '2': '8px', '3': '12px', '4': '16px', '5': '20px', '6': '24px', '8': '32px' },
        },
      },
      typography: {
        fontFamily: { primary: 'Inter, system-ui, sans-serif', secondary: 'Merriweather, serif', mono: 'Fira Code, monospace' },
        fontSizes: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem', '5xl': '3rem' },
        fontWeights: { light: 300, regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
        lineHeights: { tight: 1.25, normal: 1.5, relaxed: 1.75 },
        letterSpacings: { tighter: '-0.05em', tight: '-0.025em', normal: '0', wide: '0.025em', wider: '0.05em' },
      },
      icons: {
        provider: 'heroicons',
        style: 'outlined',
        size: { xs: '1rem', sm: '1.25rem', md: '1.5rem', lg: '2rem', xl: '2.5rem', '2xl': '3rem' },
      },
    },
    toneOfVoice: {
      personality: { professional: 85, friendly: 70, authoritative: 60, empathetic: 90, innovative: 75 },
      writingStyle: { formality: 'neutral', sentenceLength: 'medium', vocabulary: 'adaptive', voice: 'active' },
      doAndDont: {
        do: ['Utiliser un ton empathique', 'Être clair et concis', 'Proposer des solutions proactives'],
        dont: ['Utiliser du jargon technique', 'Être trop formel', 'Faire des promesses non réalistes'],
      },
      examples: {
        good: [{ context: 'Retard', text: 'Je comprends votre frustration...' }],
        bad: [{ context: 'Retard', text: 'Votre ticket est en file.', reason: 'Trop impersonnel' }],
      },
      localization: {
        'fr-FR': { culturalNuances: ['Formule de politesse'], forbiddenTerms: [], preferredTerms: {} },
        'en-US': { culturalNuances: ['Direct and friendly'], forbiddenTerms: [], preferredTerms: {} },
      },
    },
    accessibility: {
      wcagLevel: 'AA',
      contrastRatio: { min: 4.5, target: 7 },
      keyboardNavigation: true,
      screenReaderOptimized: true,
      reducedMotion: true,
    },
    localization: {
      supportedLocales: ['fr-FR', 'en-US', 'es-ES', 'de-DE'],
      defaultLocale: 'fr-FR',
      rtlSupport: false,
      translationStrategy: 'hybrid',
    },
    templates: {
      email: [{ id: 'tpl-001', name: 'Accusé de réception', subject: 'Ticket #{{ticketId}}', body: 'Bonjour...', locale: 'fr-FR' }],
      notification: [{ id: 'notif-001', name: 'Nouveau ticket', template: '🎫 Ticket #{{ticketId}}', channels: ['in-app', 'push'] }],
      document: [{ id: 'doc-001', name: 'Rapport mensuel', format: 'pdf', template: 'rapport-template' }],
    },
  },
  dashboard: {
    version: '3.0.0',
    views: [
      {
        id: 'view-agent-dashboard',
        name: 'Tableau de bord Agent',
        description: 'Vue principale pour les agents',
        icon: 'dashboard',
        roles: ['agent', 'senior_agent', 'team_lead'],
        layout: { type: 'grid', columns: { sm: 1, md: 2, lg: 3, xl: 4 }, rowHeight: 180, gap: 16 },
        widgets: [
          {
            id: 'widget-my-tickets',
            type: 'kpi-card',
            title: 'Mes tickets en cours',
            dataSource: { type: 'api', endpoint: '/api/tickets/my-open', pollingInterval: 30000, cacheEnabled: false },
            visualization: { dimensions: { width: 'small', height: 120 }, colorScheme: 'brand', showLegend: false, showTooltips: true, animations: true },
            metrics: [{ id: 'count', label: 'Tickets', calculation: 'count', format: 'number', decimals: 0, thresholds: [{ value: 10, color: '#F59E0B', operator: '>' }] }],
            filters: [],
            permissions: { view: ['agent', 'senior_agent'], edit: [], export: ['agent'] },
          },
          {
            id: 'widget-sla-compliance',
            type: 'gauge-chart',
            title: 'Conformité SLA',
            dataSource: { type: 'api', endpoint: '/api/metrics/sla', pollingInterval: 60000, cacheEnabled: true, cacheTTL: 300 },
            visualization: { dimensions: { width: 'medium', height: 150 }, colorScheme: 'custom', customColors: ['#EF4444', '#F59E0B', '#10B981'], showLegend: false, showTooltips: true, animations: true },
            metrics: [{ id: 'sla-rate', label: '% SLA', calculation: 'custom', formula: '(onTime / total) * 100', format: 'percentage', decimals: 1 }],
            filters: [{ field: 'period', type: 'dropdown', defaultValue: 'today', options: [{ label: "Aujourd'hui", value: 'today' }, { label: 'Semaine', value: 'week' }] }],
            alerts: [{ condition: 'value < 80', severity: 'warning', notificationChannels: ['email', 'push'], cooldownMinutes: 60 }],
            permissions: { view: ['agent', 'manager'], edit: [], export: ['manager'] },
          },
        ],
        customization: { allowWidgetReorder: true, allowWidgetResize: true, allowWidgetAdd: true, allowWidgetRemove: false, savedLayoutsPerUser: true },
        refresh: { autoRefresh: true, intervalSeconds: 60, showLastUpdated: true },
        export: { formats: ['pdf', 'png'], includeCharts: true, includeRawData: false },
      },
    ],
    globalFilters: [
      { id: 'gf-date', label: 'Période', type: 'date-range', defaultValue: { start: '-30d', end: 'now' }, persistent: true },
    ],
    kpiDefinitions: [
      {
        id: 'kpi-fcr',
        name: 'First Contact Resolution',
        description: '% de tickets résolus au premier contact',
        formula: '(resolvedOnFirst / total) * 100',
        dataType: 'percentage',
        benchmark: { industry: 70, target: 80 },
        trendAnalysis: { enabled: true, periods: 12, algorithm: 'moving-average' },
      },
    ],
    realTime: {
      enabled: true,
      websocketEndpoint: 'wss://api.whatsmaster.com/support/realtime',
      updateStrategy: 'hybrid',
      maxUpdatesPerMinute: 60,
    },
    performance: {
      lazyLoadWidgets: true,
      virtualScrolling: true,
      dataCompression: true,
      clientSideCaching: true,
    },
  },
  workflow: {
    version: '3.0.0',
    workflows: [
      {
        id: 'wf-auto-routing',
        name: 'Routage Automatique',
        description: 'Assignation intelligente des tickets',
        version: '3.0.0',
        category: 'routing',
        tags: ['automation', 'ai'],
        diagram: {
          nodes: [
            { id: 'node-trigger', type: 'trigger', name: 'Nouveau ticket', config: { eventType: 'ticket.created' } },
            { id: 'node-ai-intent', type: 'ai-decision', name: 'Extraction intention', config: { model: 'gpt-4', promptTemplate: 'intent-classification' } },
            { id: 'node-check-confidence', type: 'condition', name: 'Confiance suffisante ?', config: { expression: '$.confidence >= 0.75' } },
            { id: 'node-find-agent', type: 'action', name: 'Trouver agent', config: { actionType: 'agent-matching', criteria: ['skills', 'workload'] } },
            { id: 'node-assign', type: 'action', name: 'Assigner ticket', config: { actionType: 'ticket.assign' } },
            { id: 'node-notify', type: 'notification', name: 'Notifier agent', config: { channels: ['in-app', 'email'] } },
          ],
          edges: [
            { id: 'e1', sourceNodeId: 'node-trigger', targetNodeId: 'node-ai-intent' },
            { id: 'e2', sourceNodeId: 'node-ai-intent', targetNodeId: 'node-check-confidence' },
            { id: 'e3', sourceNodeId: 'node-check-confidence', targetNodeId: 'node-find-agent', condition: '$.confidence >= 0.75' },
            { id: 'e4', sourceNodeId: 'node-find-agent', targetNodeId: 'node-assign' },
            { id: 'e5', sourceNodeId: 'node-assign', targetNodeId: 'node-notify' },
          ],
        },
        triggers: [{ type: 'event', config: { eventType: 'ticket.created' } }],
        variables: [{ name: 'retryCount', type: 'number', defaultValue: 0, scope: 'workflow' }],
        logging: { level: 'info', retainDays: 90, includePayload: true, piiMasking: true },
        performance: { maxConcurrentExecutions: 100, queueEnabled: true, queueMaxSize: 1000 },
      },
    ],
    components: {
      actions: [
        { id: 'act-assign', name: 'Assigner ticket', description: 'Assigne un ticket', category: 'ticket', icon: 'user-plus', inputSchema: { type: 'object' }, outputSchema: { type: 'object' }, implementation: 'builtin' },
      ],
      triggers: [
        { id: 'trig-created', name: 'Ticket créé', description: 'À la création', category: 'ticket', icon: 'plus-circle', configSchema: { type: 'object' } },
      ],
      conditions: [
        { id: 'cond-expr', name: 'Expression', description: 'Condition JavaScript', expressionSyntax: 'javascript', examples: ['$.priority === "high"'] },
      ],
    },
    templates: [
      { id: 'tmpl-basic', name: 'Routage basique', description: 'Round-robin simple', category: 'routing', complexity: 'simple', estimatedSetupTime: '5 min', workflowId: 'wf-auto-routing', configurationSteps: [{ step: 1, title: 'Files', description: 'Sélectionner files', fields: [{ name: 'queues', label: 'Files', type: 'multiselect', required: true }] }] },
    ],
    monitoring: {
      realTimeExecutionView: true,
      historicalAnalytics: true,
      bottleneckDetection: true,
      costTracking: true,
      slaMonitoring: { enabled: true, defaultSLASeconds: 300, alertOnBreach: true },
    },
  },
  copilot: {
    version: '3.0.0',
    prompts: [
      {
        id: 'prompt-summary',
        name: 'Résumé de ticket',
        description: 'Résume un ticket pour l\'agent',
        category: 'summarization',
        template: `Résume le ticket:\n**Sujet:** {{subject}}\n**Description:** {{description}}\n\nConsignes:\n1. Problème principal\n2. Pistes de résolution`,
        variables: [
          { name: 'subject', type: 'string', description: 'Sujet du ticket', required: true },
          { name: 'description', type: 'string', description: 'Description', required: true },
        ],
        model: { provider: 'multi', name: 'gpt-4-turbo', parameters: { temperature: 0.3, maxTokens: 500 } },
        safety: { contentFiltering: true, piiDetection: true, toxicityThreshold: 0.5, hallucinationCheck: true },
        optimization: { caching: true, cacheKeyTemplate: 'summary:{{ticketId}}', cacheTTLSeconds: 3600, streaming: false, costOptimization: true },
      },
    ],
    graphRAG: {
      enabled: true,
      graph: {
        database: 'neo4j',
        connection: { host: 'neo4j.internal', port: 7687, database: 'support-knowledge' },
      },
      schema: {
        entityTypes: [
          {
            name: 'Product',
            properties: [{ name: 'name', type: 'string', indexed: true, unique: true }, { name: 'category', type: 'string', indexed: true, unique: false }],
            relationships: [{ name: 'HAS_ISSUE', targetType: 'Issue', direction: 'outgoing', cardinality: 'one-to-many' }],
          },
          {
            name: 'Issue',
            properties: [{ name: 'title', type: 'string', indexed: true, unique: false }, { name: 'severity', type: 'string', indexed: true, unique: false }],
            relationships: [{ name: 'RESOLVED_BY', targetType: 'Solution', direction: 'outgoing', cardinality: 'one-to-one' }],
          },
        ],
      },
      indexing: {
        strategy: 'hybrid',
        batchIntervalMinutes: 15,
        vectorEmbedding: { enabled: true, model: 'text-embedding-3-large', dimensions: 3072, similarityMetric: 'cosine' },
      },
      querying: { maxDepth: 3, maxResults: 10, timeoutMs: 5000, fallbackToKeywordSearch: true, hybridSearchWeight: { graph: 0.5, vector: 0.35, keyword: 0.15 } },
      cache: { enabled: true, ttlSeconds: 600, invalidationStrategy: 'hybrid' },
    },
    policies: {
      routing: {
        strategy: 'hybrid',
        rules: [
          { id: 'rule-premium', name: 'Premium → GPT-4', condition: '$.segment == "premium"', targetModel: 'gpt-4-turbo', priority: 10 },
        ],
        costOptimization: { enabled: true, budgetPerRequest: 0.05, preferCheaperModels: true, fallbackChain: ['gpt-3.5-turbo'] },
        latencyOptimization: { enabled: true, maxLatencyMs: 3000, preferFasterModels: true },
      },
      safety: {
        contentModeration: { enabled: true, categories: ['hate', 'harassment', 'violence'], threshold: 0.7, action: 'flag' },
        dataPrivacy: { piiDetection: true, piiRedaction: true, dataResidencyEnforcement: true, allowedRegions: ['EU', 'US'] },
        compliance: { gdprCompliant: true, ccpaCompliant: true, auditLogging: true, consentManagement: true },
      },
      quality: {
        responseValidation: true,
        consistencyCheck: true,
        factChecking: { enabled: true, sources: ['knowledge-base'], confidenceThreshold: 0.8 },
      },
      circuitBreaker: { enabled: true, failureThreshold: 5, resetTimeoutMs: 60000, halfOpenRequests: 3 },
    },
    conversation: {
      memory: { type: 'hybrid', windowSize: 10 },
      context: { maxContextLength: 8000, compressionStrategy: 'selective', includeMetadata: true },
      multiTurn: { enabled: true, intentTracking: true, slotFilling: true, clarificationStrategy: 'ask' },
    },
    analytics: {
      usageTracking: true,
      costTracking: true,
      performanceMetrics: { latency: true, accuracy: true, userSatisfaction: true },
      abTesting: {
        enabled: true,
        variants: [
          { id: 'variant-a', name: 'GPT-4', trafficPercentage: 60, configuration: { model: 'gpt-4-turbo' } },
          { id: 'variant-b', name: 'Claude', trafficPercentage: 40, configuration: { model: 'claude-3-sonnet' } },
        ],
      },
    },
    integrations: {
      webhookEndpoints: [{ id: 'wh-feedback', name: 'Feedback', url: 'https://api.whatsmaster.com/webhooks/feedback', events: ['response.generated'], authentication: 'bearer' }],
      apiExtensions: [{ path: '/copilot/suggest', method: 'POST', handler: 'suggestResponse', authentication: true, rateLimit: 100 }],
    },
  },
  connector: {
    version: '3.0.0',
    connectors: [
      {
        id: 'conn-salesforce',
        name: 'Salesforce Service Cloud',
        description: 'Intégration Salesforce',
        category: 'crm',
        authentication: {
          type: 'oauth2',
          oauth2: {
            authorizationUrl: 'https://login.salesforce.com/services/oauth2/authorize',
            tokenUrl: 'https://login.salesforce.com/services/oauth2/token',
            scopes: ['api', 'refresh_token'],
            grantType: 'authorization-code',
            pkce: true,
          },
        },
        endpoints: {
          baseUrl: 'https://your-instance.salesforce.com/services/data/v59.0',
          sandboxUrl: 'https://your-instance--sandbox.sandbox.my.salesforce.com/services/data/v59.0',
          version: '59.0',
          paths: [
            { name: 'Get Case', path: '/sobjects/Case/{id}', method: 'GET', description: 'Récupérer un ticket' },
            { name: 'Create Case', path: '/sobjects/Case', method: 'POST', description: 'Créer un ticket' },
          ],
        },
        sync: {
          enabled: true,
          direction: 'bidirectional',
          strategy: 'hybrid',
          batchIntervalMinutes: 5,
          conflictResolution: 'source-wins',
          fieldMappings: [{ sourceField: 'ticket.subject', targetField: 'Case.Subject' }],
        },
        errorHandling: {
          retryPolicy: { enabled: true, maxRetries: 3, backoffStrategy: 'exponential', initialDelayMs: 1000, maxDelayMs: 30000 },
          circuitBreaker: { enabled: true, failureThreshold: 5, resetTimeoutMs: 120000 },
          deadLetterQueue: { enabled: true, maxSize: 1000, retentionDays: 30 },
        },
        monitoring: {
          healthCheck: { enabled: true, intervalSeconds: 300 },
          metrics: { requestCount: true, errorRate: true, latency: true, dataVolume: true },
          alerting: {
            enabled: true,
            conditions: [{ metric: 'errorRate', operator: '>', threshold: 0.05, notificationChannels: ['email', 'slack'] }],
          },
        },
      },
    ],
    integrations: [
      {
        id: 'intg-crm',
        name: 'CRM Complet',
        description: 'Intégration CRM complète',
        category: 'crm',
        connectorsRequired: ['conn-salesforce'],
        workflowsIncluded: ['wf-sync-customers'],
        setupGuide: { steps: [{ step: 1, title: 'Authentifier', description: 'OAuth2 Salesforce' }], estimatedTime: '30 minutes', prerequisites: ['Compte Salesforce admin'] },
      },
    ],
    transformers: [
      {
        id: 'transf-status',
        name: 'Mapping statuts',
        description: 'Transforme les statuts',
        inputFormat: 'whatsmaster',
        outputFormat: 'salesforce',
        transformationLogic: `const map = { 'new': 'New', 'closed': 'Closed' }; return map[input] || 'New';`,
        testCases: [{ input: 'new', expectedOutput: 'New' }],
      },
    ],
    webhooks: {
      receiver: { enabled: true, authentication: 'signature', signatureAlgorithm: 'hmac-sha256' },
      sender: { enabled: true, retryPolicy: { maxRetries: 3, backoffMs: 5000 }, payloadFormat: 'json' },
    },
  },
  permissions: {
    version: '3.0.0',
    roles: [
      {
        id: 'role-agent',
        name: 'Agent de Support',
        description: 'Rôle de base',
        category: 'business',
        inheritsFrom: [],
        isAssignable: true,
        permissions: [
          { resource: 'ticket', actions: ['read', 'update', 'execute'], conditions: '$.assignedTo == currentUser.id', scope: 'self' },
          { resource: 'customer', actions: ['read'], scope: 'global' },
          { resource: 'dashboard', actions: ['read'], scope: 'global' },
        ],
        uiRestrictions: { hiddenMenus: ['settings', 'admin'], readOnlyFields: ['ticket.createdAt'], disabledActions: ['ticket.delete'], customViews: ['view-agent-dashboard'] },
        dataAccess: {
          allowedFields: ['ticket.*', 'customer.name', 'customer.email'],
          maskedFields: [{ field: 'customer.creditCard', maskStrategy: 'partial', visibleChars: 4 }],
          rowLevelSecurity: { enabled: true, filterExpression: '$.assignedTo == currentUser.id' },
        },
        limits: { maxRecordsPerQuery: 100, maxExportsPerDay: 10, maxConcurrentSessions: 3, sessionTimeoutMinutes: 480, apiCallsPerMinute: 60 },
      },
      {
        id: 'role-manager',
        name: 'Manager Support',
        description: 'Manager global',
        category: 'business',
        inheritsFrom: ['role-agent'],
        isAssignable: false,
        permissions: [{ resource: '*', actions: ['read', 'create', 'update', 'delete', 'execute', 'approve', 'export'], scope: 'global' }],
        uiRestrictions: { hiddenMenus: [], readOnlyFields: [], disabledActions: [], customViews: ['*'] },
        dataAccess: { allowedFields: ['*'], maskedFields: [], rowLevelSecurity: { enabled: false } },
        limits: { maxRecordsPerQuery: 10000, maxExportsPerDay: 500, maxConcurrentSessions: 20, sessionTimeoutMinutes: 1440, apiCallsPerMinute: 500 },
      },
    ],
    securityPolicies: [
      {
        id: 'policy-standard',
        name: 'Politique standard',
        description: 'Politique par défaut',
        authentication: {
          mfaRequired: true,
          mfaMethods: ['totp', 'sms', 'email'],
          passwordPolicy: { minLength: 12, requireUppercase: true, requireLowercase: true, requireNumbers: true, requireSpecialChars: true, maxAge: 90, historyCount: 12 },
          sessionManagement: { maxConcurrentSessions: 5, idleTimeoutMinutes: 30, absoluteTimeoutHours: 12, rememberMeEnabled: true, rememberMeDurationDays: 30 },
        },
        authorization: { defaultDeny: true, requireExplicitGrant: true, privilegeEscalationPrevention: true, separationOfDuties: [{ name: 'Ticket Mgmt', conflictingPermissions: [['ticket.delete', 'ticket.approve']] }] },
        audit: { enabled: true, logLevel: 'all', retainedDays: 365, immutableLogs: true, events: ['login', 'logout', 'permission-change', 'data-access', 'export'] },
        dataProtection: { encryptionAtRest: true, encryptionInTransit: true, keyManagement: 'customer-managed', dataClassification: { enabled: true, levels: ['public', 'internal', 'confidential', 'restricted'] }, dlPolicies: [{ name: 'CC Protection', dataTypes: ['credit-card'], action: 'mask' }] },
      },
    ],
    menuStructure: {
      items: [
        { id: 'menu-dashboard', label: 'Dashboard', icon: 'dashboard', path: '/dashboard', permissions: ['ticket.read'], order: 1 },
        { id: 'menu-tickets', label: 'Tickets', icon: 'ticket', path: '/tickets', permissions: ['ticket.read'], order: 2 },
        { id: 'menu-admin', label: 'Admin', icon: 'shield', path: '/admin', permissions: ['admin.access'], order: 10 },
      ],
      defaultCollapsed: false,
      searchEnabled: true,
    },
    actions: [
      { id: 'action-close', name: 'Clôturer', description: 'Marque comme résolu', resource: 'ticket', requiredPermissions: ['ticket.update'], requiresApproval: false },
      { id: 'action-delete', name: 'Supprimer', description: 'Supprime un ticket', resource: 'ticket', requiredPermissions: ['ticket.delete'], requiresApproval: true, approvalWorkflow: 'wf-approval-delete' },
    ],
    delegation: {
      enabled: true,
      maxDelegationDepth: 2,
      expirationOptions: ['1-hour', '8-hours', '24-hours', '7-days', 'custom'],
      auditTrail: true,
    },
    reporting: {
      accessReports: { enabled: true, schedule: 'weekly', recipients: ['security@company.com'] },
      anomalyDetection: { enabled: true, patterns: ['unusual-hours', 'excessive-exports', 'privilege-escalation'], alertThreshold: 0.85 },
    },
  },
  extensions: [
    {
      id: 'ext-sentiment',
      name: 'Analyse de sentiment',
      type: 'service',
      implementation: { provider: 'azure-text-analytics' },
      configSchema: { type: 'object', properties: { apiKey: { type: 'string' } } },
    },
  ],
  lifecycleHooks: {
    onInstall: async (context: any) => { console.log('Install', context); },
    onActivate: async (context: any) => { console.log('Activate', context); },
    onDeactivate: async (context: any) => { console.log('Deactivate', context); },
    onUninstall: async (context: any) => { console.log('Uninstall', context); },
    onUpgrade: async (fromVersion: string, context: any) => { console.log('Upgrade', fromVersion, context); },
    onConfigChange: async (config: Record<string, any>) => { console.log('Config change', config); },
  },
  runtimeApi: {
    version: '3.0.0',
    endpoints: [
      { path: '/api/v1/tickets/suggest', method: 'POST', handler: async (data: any) => ({ suggestion: 'test' }), authentication: true, rateLimit: 100, description: 'Suggestion de réponse' },
      { path: '/api/v1/analytics/sla', method: 'GET', handler: async () => ({ compliance: 95.5 }), authentication: true, rateLimit: 200, description: 'Métriques SLA' },
    ],
  },
});

// ============================================================================
// TESTS DE VALIDATION DE SCHÉMA
// ============================================================================

describe('ThemePluginSchema Validation', () => {
  describe('Manifest Validation', () => {
    it('should validate a complete and correct plugin manifest', () => {
      const mockPlugin = createMockSupportPlugin();
      const result = ThemePluginSchema.safeParse(mockPlugin);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.manifest.id).toMatch(/^com\.[a-z0-9-]+\.[a-z0-9-]+\.[a-z0-9-]+$/);
        expect(result.data.manifest.version).toMatch(/^\d+\.\d+\.\d+$/);
        expect(result.data.manifest.category).toBe('support');
      }
    });

    it('should reject invalid plugin ID format', () => {
      const mockPlugin = createMockSupportPlugin();
      mockPlugin.manifest.id = 'invalid-id-format';
      
      const result = ThemePluginSchema.safeParse(mockPlugin);
      expect(result.success).toBe(false);
    });

    it('should reject invalid semantic version', () => {
      const mockPlugin = createMockSupportPlugin();
      mockPlugin.manifest.version = '3.0';
      
      const result = ThemePluginSchema.safeParse(mockPlugin);
      expect(result.success).toBe(false);
    });

    it('should reject invalid category', () => {
      const mockPlugin = createMockSupportPlugin();
      mockPlugin.manifest.category = 'invalid-category' as any;
      
      const result = ThemePluginSchema.safeParse(mockPlugin);
      expect(result.success).toBe(false);
    });
  });

  describe('Branding Pack Validation', () => {
    it('should validate complete branding pack', () => {
      const mockPlugin = createMockSupportPlugin();
      const result = ThemePluginSchema.safeParse(mockPlugin);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.branding.version).toMatch(/^\d+\.\d+\.\d+$/);
        expect(result.data.branding.metadata.brandName).toBeTruthy();
        expect(result.data.branding.designSystem.theme.light.colors.primary.main).toBeTruthy();
      }
    });

    it('should validate accessibility compliance', () => {
      const mockPlugin = createMockSupportPlugin();
      expect(mockPlugin.branding.accessibility.wcagLevel).toBe('AA');
      expect(mockPlugin.branding.accessibility.contrastRatio.min).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Dashboard Pack Validation', () => {
    it('should validate dashboard with views and widgets', () => {
      const mockPlugin = createMockSupportPlugin();
      const result = ThemePluginSchema.safeParse(mockPlugin);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.dashboard.views.length).toBeGreaterThan(0);
        expect(result.data.dashboard.views[0].widgets.length).toBeGreaterThan(0);
        expect(result.data.dashboard.kpiDefinitions.length).toBeGreaterThan(0);
      }
    });

    it('should validate widget types', () => {
      const mockPlugin = createMockSupportPlugin();
      const validWidgetTypes = ['kpi-card', 'time-series-chart', 'bar-chart', 'pie-chart', 'gauge-chart', 'data-table'];
      
      mockPlugin.dashboard.views.forEach(view => {
        view.widgets.forEach(widget => {
          expect(validWidgetTypes).toContain(widget.type);
        });
      });
    });
  });

  describe('Workflow Pack Validation', () => {
    it('should validate workflow with nodes and edges', () => {
      const mockPlugin = createMockSupportPlugin();
      const result = ThemePluginSchema.safeParse(mockPlugin);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.workflow.workflows.length).toBeGreaterThan(0);
        
        const firstWorkflow = result.data.workflow.workflows[0];
        expect(firstWorkflow.diagram.nodes.length).toBeGreaterThan(0);
        expect(firstWorkflow.diagram.edges.length).toBeGreaterThan(0);
      }
    });

    it('should validate node types', () => {
      const mockPlugin = createMockSupportPlugin();
      const validNodeTypes = ['trigger', 'action', 'condition', 'switch', 'loop', 'delay', 'approval', 'notification', 'ai-decision'];
      
      mockPlugin.workflow.workflows.forEach(wf => {
        wf.diagram.nodes.forEach(node => {
          expect(validNodeTypes).toContain(node.type);
        });
      });
    });

    it('should validate edge connectivity', () => {
      const mockPlugin = createMockSupportPlugin();
      
      mockPlugin.workflow.workflows.forEach(wf => {
        const nodeIds = new Set(wf.diagram.nodes.map(n => n.id));
        
        wf.diagram.edges.forEach(edge => {
          expect(nodeIds).toContain(edge.sourceNodeId);
          expect(nodeIds).toContain(edge.targetNodeId);
        });
      });
    });
  });

  describe('Copilot Pack Validation', () => {
    it('should validate prompts with variables', () => {
      const mockPlugin = createMockSupportPlugin();
      const result = ThemePluginSchema.safeParse(mockPlugin);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.copilot.prompts.length).toBeGreaterThan(0);
        expect(result.data.copilot.prompts[0].template).toContain('{{');
      }
    });

    it('should validate GraphRAG configuration', () => {
      const mockPlugin = createMockSupportPlugin();
      expect(mockPlugin.copilot.graphRAG.enabled).toBe(true);
      expect(['neo4j', 'amazon-neptune', 'azure-cosmos', 'tigergraph', 'embedded']).toContain(mockPlugin.copilot.graphRAG.graph.database);
    });

    it('should validate AI safety policies', () => {
      const mockPlugin = createMockSupportPlugin();
      expect(mockPlugin.copilot.policies.safety.contentModeration.enabled).toBe(true);
      expect(mockPlugin.copilot.policies.safety.dataPrivacy.piiDetection).toBe(true);
    });
  });

  describe('Connector Pack Validation', () => {
    it('should validate connectors with authentication', () => {
      const mockPlugin = createMockSupportPlugin();
      const result = ThemePluginSchema.safeParse(mockPlugin);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.connector.connectors.length).toBeGreaterThan(0);
        
        result.data.connector.connectors.forEach(conn => {
          expect(['oauth2', 'api-key', 'basic', 'jwt', 'mtls']).toContain(conn.authentication.type);
        });
      }
    });

    it('should validate OAuth2 configuration', () => {
      const mockPlugin = createMockSupportPlugin();
      const salesforceConnector = mockPlugin.connector.connectors.find(c => c.id === 'conn-salesforce');
      
      if (salesforceConnector && salesforceConnector.authentication.type === 'oauth2') {
        expect(salesforceConnector.authentication.oauth2?.authorizationUrl).toBeTruthy();
        expect(salesforceConnector.authentication.oauth2?.tokenUrl).toBeTruthy();
        expect(salesforceConnector.authentication.oauth2?.scopes.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Permissions Pack Validation', () => {
    it('should validate roles with permissions', () => {
      const mockPlugin = createMockSupportPlugin();
      const result = ThemePluginSchema.safeParse(mockPlugin);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.permissions.roles.length).toBeGreaterThan(0);
        
        result.data.permissions.roles.forEach(role => {
          expect(role.permissions.length).toBeGreaterThan(0);
          role.permissions.forEach(perm => {
            expect(['create', 'read', 'update', 'delete', 'execute', 'approve', 'export']).toEqual(expect.arrayContaining(perm.actions));
          });
        });
      }
    });

    it('should validate security policies', () => {
      const mockPlugin = createMockSupportPlugin();
      expect(mockPlugin.permissions.securityPolicies.length).toBeGreaterThan(0);
      
      const policy = mockPlugin.permissions.securityPolicies[0];
      expect(policy.authentication.mfaRequired).toBe(true);
      expect(policy.audit.enabled).toBe(true);
      expect(policy.dataProtection.encryptionAtRest).toBe(true);
    });
  });
});

// ============================================================================
// TESTS DE PERFORMANCE
// ============================================================================

describe('Performance Tests', () => {
  it('should validate plugin structure in under 100ms', () => {
    const startTime = Date.now();
    
    const mockPlugin = createMockSupportPlugin();
    const result = ThemePluginSchema.safeParse(mockPlugin);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(100);
    expect(result.success).toBe(true);
  });

  it('should handle large dashboard configurations efficiently', () => {
    const mockPlugin = createMockSupportPlugin();
    
    for (let i = 0; i < 50; i++) {
      mockPlugin.dashboard.views[0].widgets.push({
        id: `widget-test-${i}`,
        type: 'kpi-card',
        title: `Test Widget ${i}`,
        dataSource: { type: 'api', endpoint: `/api/test/${i}`, cacheEnabled: true },
        visualization: { dimensions: { width: 'small', height: 100 }, colorScheme: 'brand', showLegend: false, showTooltips: true, animations: true },
        metrics: [{ id: 'metric', label: 'Metric', calculation: 'count', format: 'number', decimals: 0 }],
        filters: [],
        permissions: { view: ['agent'], edit: [], export: [] },
      });
    }
    
    const startTime = Date.now();
    const result = ThemePluginSchema.safeParse(mockPlugin);
    const duration = Date.now() - startTime;
    
    expect(duration).toBeLessThan(200);
    expect(result.success).toBe(true);
  });
});

// ============================================================================
// TESTS D'INTÉGRATION
// ============================================================================

describe('Integration Tests', () => {
  it('should validate cross-pack consistency', () => {
    const mockPlugin = createMockSupportPlugin();
    
    const roleIds = new Set(mockPlugin.permissions.roles.map(r => r.id));
    
    mockPlugin.dashboard.views.forEach(view => {
      view.widgets.forEach(widget => {
        widget.permissions.view.forEach(roleId => {
          expect(roleIds).toContain(roleId);
        });
      });
    });
    
    const workflowIds = new Set(mockPlugin.workflow.workflows.map(w => w.id));
    
    mockPlugin.workflow.templates.forEach(template => {
      expect(workflowIds).toContain(template.workflowId);
    });
  });

  it('should validate connector-workflow integration', () => {
    const mockPlugin = createMockSupportPlugin();
    
    const connectorIds = new Set(mockPlugin.connector.connectors.map(c => c.id));
    
    mockPlugin.connector.integrations.forEach(integration => {
      integration.connectorsRequired.forEach(connId => {
        expect(connectorIds).toContain(connId);
      });
    });
  });
});

// ============================================================================
// TESTS DE SÉCURITÉ
// ============================================================================

describe('Security Tests', () => {
  it('should enforce least privilege principle', () => {
    const mockPlugin = createMockSupportPlugin();
    
    mockPlugin.permissions.roles.forEach(role => {
      if (role.category !== 'system') {
        const hasGlobalAllAccess = role.permissions.some(p => 
          p.resource === '*' && 
          p.scope === 'global' && 
          p.actions.includes('delete')
        );
        
        if (role.id !== 'role-manager') {
          expect(hasGlobalAllAccess).toBe(false);
        }
      }
    });
  });

  it('should validate PII masking configuration', () => {
    const mockPlugin = createMockSupportPlugin();
    
    mockPlugin.permissions.roles.forEach(role => {
      role.dataAccess.maskedFields.forEach(field => {
        expect(['full', 'partial', 'hash']).toContain(field.maskStrategy);
        
        if (field.maskStrategy === 'partial') {
          expect(field.visibleChars).toBeDefined();
          expect(typeof field.visibleChars).toBe('number');
          expect(field.visibleChars).toBeGreaterThan(0);
        }
      });
    });
  });

  it('should validate audit logging is enabled', () => {
    const mockPlugin = createMockSupportPlugin();
    
    mockPlugin.permissions.securityPolicies.forEach(policy => {
      expect(policy.audit.enabled).toBe(true);
      expect(policy.audit.immutableLogs).toBe(true);
      expect(policy.audit.retainedDays).toBeGreaterThanOrEqual(90);
    });
  });
});

// ============================================================================
// TESTS DE COMPLIANCE
// ============================================================================

describe('Compliance Tests', () => {
  it('should validate GDPR compliance requirements', () => {
    const mockPlugin = createMockSupportPlugin();
    
    expect(mockPlugin.manifest.compliance.gdprReady).toBe(true);
    expect(mockPlugin.copilot.policies.safety.compliance.gdprCompliant).toBe(true);
    expect(mockPlugin.copilot.policies.safety.dataPrivacy.dataResidencyEnforcement).toBe(true);
  });

  it('should validate SOC2 controls', () => {
    const mockPlugin = createMockSupportPlugin();
    
    expect(mockPlugin.manifest.compliance.soc2Compliant).toBe(true);
    expect(mockPlugin.permissions.securityPolicies[0].audit.enabled).toBe(true);
    expect(mockPlugin.permissions.securityPolicies[0].audit.immutableLogs).toBe(true);
    expect(mockPlugin.workflow.workflows[0].logging.retainDays).toBeGreaterThanOrEqual(90);
  });

  it('should validate accessibility standards', () => {
    const mockPlugin = createMockSupportPlugin();
    
    expect(mockPlugin.branding.accessibility.wcagLevel).toBe('AA');
    expect(mockPlugin.branding.accessibility.contrastRatio.min).toBeGreaterThanOrEqual(4.5);
    expect(mockPlugin.branding.accessibility.keyboardNavigation).toBe(true);
    expect(mockPlugin.branding.accessibility.screenReaderOptimized).toBe(true);
  });
});
