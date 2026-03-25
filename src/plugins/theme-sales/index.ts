/**
 * Theme Plugin: Sales Copilot
 * Priorité #3 - Qualification Leads & Conversion
 * 
 * Packs inclus : Branding, Dashboard, Workflow, Copilot, Connector, Permissions
 * Statut : Production Ready
 */

import type { 
  ThemePlugin, 
  BrandingPack, 
  DashboardPack, 
  WorkflowPack, 
  CopilotPack, 
  ConnectorPack, 
  PermissionsPack 
} from '../../types/theme-plugin';

// ============================================================================
// BRANDING PACK - Identité Sales
// ============================================================================

const salesBranding: BrandingPack = {
  theme: {
    primary: { light: '#6366F1', dark: '#4F46E5' }, // Indigo
    secondary: { light: '#8B5CF6', dark: '#7C3AED' }, // Violet
    accent: { light: '#EC4899', dark: '#DB2777' }, // Pink
    background: { light: '#FFFFFF', dark: '#0F172A' },
    surface: { light: '#F8FAFC', dark: '#1E293B' },
    text: { light: '#0F172A', dark: '#F8FAFC' },
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#6366F1'
  },
  typography: {
    fontFamily: '"SF Pro Display", "Inter", sans-serif',
    fontSizeBase: '15px',
    fontWeightHeading: '800',
    fontWeightBody: '500',
    lineHeightTight: '1.2',
    lineHeightRelaxed: '1.6'
  },
  iconography: {
    style: 'sharp-outlined',
    library: 'heroicons',
    sizeScale: ['18px', '22px', '26px', '34px', '52px']
  },
  toneOfVoice: {
    personality: 'compétitive, results-driven, persuasive',
    guidelines: [
      'Ton confiant et orienté résultats',
      'Utiliser des données chiffrées pour convaincre',
      'Créer un sentiment d\'opportunité limitée',
      'Personnaliser selon le niveau de décision',
      'Emojis professionnels 📈🎯💼'
    ],
    forbidden: [
      'Langage trop familier',
      'Promesses non vérifiables',
      'Pression agressive'
    ],
    examples: {
      greeting: 'Bonjour {{firstName}}, j\'ai analysé votre profil et je vois une opportunité intéressante pour {{companyName}}. 3 min pour en parler ? 📊',
      followUp: '{{firstName}}, vos concurrents dans {{industry}} ont déjà adopté cette solution. Résultats moyens : +{{resultMetric}}%. On programme un call ?',
      closing: 'Excellente nouvelle ! Je vous envoie le contrat. Signature électronique incluse ✅. Démarrage possible dès {{startDate}}.'
    }
  },
  responsive: {
    mobileFirst: false,
    breakpoints: { sm: '640px', md: '768px', lg: '1024px', xl: '1440px' },
    touchFriendly: true,
    minTouchTarget: '48px'
  },
  accessibility: {
    wcagLevel: 'AA',
    contrastRatio: 5.0,
    keyboardNavigation: true,
    screenReaderOptimized: true
  },
  localization: {
    defaultLocale: 'fr-FR',
    supportedLocales: ['fr-FR', 'en-US', 'es-ES', 'de-DE', 'pt-BR', 'zh-CN'],
    rtlSupport: false,
    currencyFormats: {
      'fr-FR': { symbol: '€', position: 'after', decimal: ',', thousand: '.' },
      'en-US': { symbol: '$', position: 'before', decimal: '.', thousand: ',' },
      'pt-BR': { symbol: 'R$', position: 'before', decimal: ',', thousand: '.' }
    }
  }
};

// ============================================================================
// DASHBOARD PACK - Vues Sales
// ============================================================================

const salesDashboard: DashboardPack = {
  roles: [
    {
      roleId: 'sales_director',
      label: 'Directeur Commercial',
      views: [
        {
          id: 'pipeline_overview',
          title: 'Vue Pipeline Global',
          widgets: [
            { id: 'total_pipeline_value', type: 'kpi_card', metric: 'pipeline_value', period: 'current_quarter', comparison: 'last_quarter' },
            { id: 'win_rate', type: 'gauge', metric: 'win_rate', target: 35 },
            { id: 'deals_by_stage', type: 'funnel_chart', stages: ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won'] },
            { id: 'revenue_forecast', type: 'line_chart', metric: 'forecasted_revenue', granularity: 'weekly', weeks: 12 }
          ]
        },
        {
          id: 'team_performance',
          title: 'Performance Équipe',
          widgets: [
            { id: 'rep_leaderboard', type: 'leaderboard', metric: 'deals_closed', limit: 10, groupBy: 'sales_rep' },
            { id: 'activity_metrics', type: 'bar_chart', metrics: ['calls_made', 'emails_sent', 'meetings_booked'], dimension: 'rep' },
            { id: 'at_risk_deals', type: 'alert_list', criteria: 'days_without_contact > 7 AND deal_value > 10000' }
          ]
        }
      ]
    },
    {
      roleId: 'account_executive',
      label: 'Account Executive',
      views: [
        {
          id: 'my_pipeline',
          title: 'Mon Pipeline',
          widgets: [
            { id: 'my_quota_progress', type: 'progress_bar', metric: 'quota_attainment', target: 100 },
            { id: 'hot_leads', type: 'lead_list', score: '>= 80', sortBy: 'score' },
            { id: 'pending_proposals', type: 'task_list', status: 'awaiting_response', priority: 'high' },
            { id: 'next_actions', type: 'action_timeline', horizon: '7_days' }
          ]
        },
        {
          id: 'account_health',
          title: 'Santé des Comptes',
          widgets: [
            { id: 'expansion_opportunities', type: 'opportunity_list', type: 'upsell_crossell' },
            { id: 'churn_risk', type: 'risk_matrix', accounts: 'active_customers' },
            { id: 'recent_activity', type: 'timeline', scope: 'my_accounts' }
          ]
        }
      ]
    },
    {
      roleId: 'sdr',
      label: 'Sales Development Rep',
      views: [
        {
          id: 'lead_generation',
          title: 'Génération de Leads',
          widgets: [
            { id: 'leads_assigned', type: 'kpi_card', metric: 'new_leads', period: 'today' },
            { id: 'outstanding_outreach', type: 'task_queue', actions: ['call', 'email', 'linkedin'], sortBy: 'lead_score' },
            { id: 'conversion_funnel', type: 'funnel_chart', stages: ['new', 'contacted', 'qualified', 'meeting_booked'] },
            { id: 'daily_activity', type: 'counter_dashboard', targets: { calls: 60, emails: 40, meetings: 3 } }
          ]
        }
      ]
    }
  ],
  widgets: {
    kpi_card: {
      component: 'SalesKpiCard',
      refreshInterval: 60000,
      caching: { enabled: true, ttl: 120000 },
      alerts: [{ condition: 'miss_target > 15%', severity: 'critical', action: 'notify_manager' }],
      sparkline: true
    },
    funnel_chart: {
      component: 'SalesFunnel',
      interactive: true,
      drillDown: true,
      conversionRates: true,
      exportFormats: ['png', 'pdf', 'csv']
    },
    leaderboard: {
      component: 'SalesLeaderboard',
      animation: 'countUp',
      highlightTop: 3,
      showTrends: true,
      timeRangeToggle: true
    },
    lead_list: {
      component: 'LeadList',
      features: ['quick_view', 'bulk_actions', 'score_highlight', 'intent_signals'],
      sorting: ['score', 'last_activity', 'created_date', 'deal_value'],
      pagination: { pageSize: 25, infiniteScroll: true },
      bulkActions: ['assign', 'send_email', 'schedule_task']
    }
  },
  realTimeUpdates: {
    enabled: true,
    websocket: true,
    fallbackPolling: 3000,
    pushNotifications: true
  }
};

// ============================================================================
// WORKFLOW PACK - Automatisations Sales
// ============================================================================

const salesWorkflow: WorkflowPack = {
  automations: [
    {
      id: 'lead_qualification_auto',
      name: 'Qualification Automatique de Leads',
      trigger: { type: 'event', event: 'new_lead_created' },
      conditions: [{ field: 'lead_source', operator: 'in', value: ['website', 'webinar', 'content_download'] }],
      nodes: [
        { id: 'enrich_data', type: 'api_call', config: { endpoint: '/enrichment/clearbit', method: 'POST' } },
        { id: 'score_lead', type: 'ai_prompt', config: { promptId: 'lead_scoring', context: 'firmographic_behavioral' } },
        { id: 'route_lead', type: 'decision', config: { condition: 'lead_score >= 70', truePath: 'assign_ae', falsePath: 'nurture_sequence' } },
        { id: 'assign_ae', type: 'action', config: { action: 'assign_to_ae', roundRobin: true } },
        { id: 'nurture_sequence', type: 'action', config: { action: 'enroll_in_nurture', sequence: 'cold_lead_7steps' } },
        { id: 'notify_ae', type: 'action', config: { action: 'send_notification', channel: 'slack', recipient: 'assigned_ae' } }
      ],
      errorHandling: { retries: 3, backoff: 'exponential', fallback: 'queue_for_manual_review' }
    },
    {
      id: 'follow_up_sequence',
      name: 'Séquence de Relance Intelligente',
      trigger: { type: 'event', event: 'meeting_completed', status: 'no_decision' },
      nodes: [
        { id: 'analyze_meeting', type: 'ai_prompt', config: { promptId: 'meeting_summary', extract: 'objections_next_steps' } },
        { id: 'send_thank_you', type: 'action', config: { action: 'send_email', template: 'thank_you_meeting' } },
        { id: 'wait_2days', type: 'wait', config: { duration: '48h' } },
        { id: 'send_case_study', type: 'action', config: { action: 'send_content', contentType: 'case_study', industry: 'match' } },
        { id: 'wait_3days', type: 'wait', config: { duration: '72h' } },
        { id: 'personalized_followup', type: 'ai_prompt', config: { promptId: 'followup_email', tone: 'helpful_not_pushy' } },
        { id: 'escalate_if_no_response', type: 'decision', config: { condition: 'no_response_after == 3_touches', truePath: 'notify_manager', falsePath: 'continue_sequence' } }
      ]
    },
    {
      id: 'deal_insights_alert',
      name: 'Alertes Intelligentes sur Deals',
      trigger: { type: 'schedule', cron: '0 9 * * 1-5' }, // Tous les jours 9h
      nodes: [
        { id: 'analyze_stalled_deals', type: 'data_transform', config: { filter: 'days_in_stage > avg_cycle_time * 1.5' } },
        { id: 'generate_insights', type: 'ai_prompt', config: { promptId: 'deal_coaching', context: 'stall_reasons' } },
        { id: 'send_coaching_tips', type: 'action', config: { action: 'send_message', channel: 'in_app', recipient: 'deal_owner' } }
      ]
    },
    {
      id: 'contract_generation',
      name: 'Génération Automatique de Contrats',
      trigger: { type: 'event', event: 'deal_stage_changed', newStage: 'verbal_commit' },
      nodes: [
        { id: 'validate_terms', type: 'decision', config: { condition: 'discount > max_allowed', truePath: 'require_approval', falsePath: 'generate_contract' } },
        { id: 'require_approval', type: 'action', config: { action: 'request_approval', approver: 'sales_director' } },
        { id: 'generate_contract', type: 'action', config: { action: 'generate_document', template: 'master_service_agreement' } },
        { id: 'send_for_signature', type: 'action', config: { action: 'send_via_docusign', signers: 'all_parties' } }
      ]
    }
  ],
  templates: {
    thank_you_meeting: 'Merci pour cet échange constructif {{firstName}} ! Comme convenu, voici le récapitulatif : {{meetingSummary}}. Prochaine étape : {{nextStep}}. 🚀',
    cold_outreach: 'Bonjour {{firstName}}, j\'aide des entreprises comme {{companyName}} à {{valueProposition}}. Résultat typique : {{resultMetric}} en {{timeframe}}. Dispo pour un call de 15 min ?',
    proposal_followup: '{{firstName}}, je voulais m\'assurer que vous aviez bien reçu notre proposition. Des questions sur {{keyPoint}} ? Je suis dispo pour en discuter.',
    win_celebration: '🎉 Félicitations {{customerName}} ! Bienvenue dans la famille WhatsMaster. Votre onboarding commence le {{startDate}}. Hâte de voir vos résultats !'
  }
};

// ============================================================================
// COPILOT PACK - IA Sales
// ============================================================================

const salesCopilot: CopilotPack = {
  prompts: [
    {
      id: 'lead_scoring',
      name: 'Scoring Intelligent de Leads',
      systemPrompt: 'Tu es un expert en qualification B2B. Analyse les leads selon les critères BANT (Budget, Authority, Need, Timeline) et attribue un score de 0-100.',
      userTemplate: 'Lead: {{companyName}}\nIndustrie: {{industry}}\nTaille: {{employeeCount}}\nComportement: {{behavioralSignals}}\nTechnologies: {{techStack}}\n\nScore et justification détaillée.',
      variables: ['companyName', 'industry', 'employeeCount', 'behavioralSignals', 'techStack'],
      model: 'gpt-4-turbo',
      temperature: 0.5,
      maxTokens: 400,
      outputSchema: { score: 'number', reasoning: 'string', recommendedAction: 'string' }
    },
    {
      id: 'email_personalization',
      name: 'Personnalisation d\'Emails',
      systemPrompt: 'Tu es un copywriter sales expert. Crée des emails hyper-personnalisés qui convertissent, basés sur le contexte du prospect.',
      userTemplate: 'Prospect: {{firstName}} {{lastName}}\nEntreprise: {{companyName}}\nRôle: {{jobTitle}}\nDéclencheur: {{triggerEvent}}\nValeur clé: {{valueProposition}}\nPreuve sociale: {{socialProof}}\n\nRédige un email court et percutant.',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 300
    },
    {
      id: 'objection_handling_realtime',
      name: 'Gestion d\'Objections en Temps Réel',
      systemPrompt: 'Tu es un coach sales d\'élite. Pendant un appel, fournis des réponses rapides aux objections avec des arguments data-driven.',
      userTemplate: 'Objection entendue: "{{objection}}"\nContexte deal: {{dealContext}}\nArguments disponibles: {{availableProofPoints}}\n\nDonne 3 réponses possibles classées par efficacité.',
      model: 'gpt-4-turbo',
      temperature: 0.6,
      realtime: true
    },
    {
      id: 'meeting_summary',
      name: 'Résumé Automatique de Réunion',
      systemPrompt: 'Analyse la transcription d\'une réunion de vente et extrais les points clés, objections, next steps et signaux d\'achat.',
      userTemplate: 'Transcription: {{meetingTranscript}}\nParticipants: {{attendees}}\nObjectif: {{meetingGoal}}\n\nExtrais : résumé exécutif, objections soulevées, engagements pris, next steps avec dates, score d\'intérêt (0-10).',
      model: 'gpt-4-turbo',
      temperature: 0.4,
      maxTokens: 800
    },
    {
      id: 'competitor_battlecard',
      name: 'Battle Card Concurrentielle',
      systemPrompt: 'Tu es un expert competitive intelligence. Fournis des arguments pour battre la concurrence de manière éthique et factuelle.',
      userTemplate: 'Concurrent: {{competitorName}}\nNos avantages: {{ourDifferentiators}}\nFaiblesses concurrent: {{competitorWeaknesses}}\nCas clients gagnés: {{winStories}}\n\nCrée une battle card actionable.',
      model: 'gpt-4',
      temperature: 0.5
    }
  ],
  graphRAGPolicies: {
    enabled: true,
    entityTypes: ['company', 'contact', 'deal', 'competitor', 'product', 'case_study'],
    relationships: ['works_at', 'influenced_by', 'competing_with', 'similar_to', 'purchased', 'evaluating'],
    confidenceThreshold: 0.85,
    fallbackStrategy: 'vector_search',
    useCases: [
      'find_similar_won_deals',
      'identify_decision_makers',
      'surface_relevant_case_studies',
      'map_competitor_landscape'
    ]
  },
  routing: {
    rules: [
      { intent: 'lead_qualification', model: 'gpt-4-turbo', reason: 'analyse complexe multi-critères' },
      { intent: 'email_drafting', model: 'gpt-4', reason: 'créativité et persuasion requises' },
      { intent: 'data_lookup', model: 'gpt-3.5-turbo', reason: 'requête factuelle simple' },
      { intent: 'realtime_coaching', model: 'gpt-4-turbo', reason: 'besoin précision et rapidité' },
      { intent: 'contract_review', model: 'gpt-4', reason: 'analyse juridique critique' }
    ],
    costOptimization: {
      enabled: true,
      budgetLimit: 0.05, // par lead qualifié
      preferCheaperWhenConfidence: 0.92,
      trackROI: true
    },
    loadBalancing: {
      enabled: true,
      failover: true,
      maxLatency: 3000
    }
  },
  safetyFilters: [
    { filterType: 'pii', action: 'mask', fields: ['credit_card', 'ssn', 'bank_account'] },
    { filterType: 'competitive_intelligence', action: 'verify_facts', requireSource: true },
    { filterType: 'pricing_accuracy', action: 'validate_against_crm', blockIfMismatch: true },
    { filterType: 'compliance', action: 'check_regulations', regions: ['GDPR', 'CCPA', 'SOC2'] },
    { filterType: 'overpromising', action: 'flag_and_warn', keywords: ['guarantee', 'promise', '100%'] }
  ],
  conversationMemory: {
    enabled: true,
    retentionDays: 365, // Cycle de vente long
    summarization: true,
    sentimentTracking: true,
    buyingSignalDetection: true,
    stakeholderMapping: true
  },
  coachingMode: {
    enabled: true,
    realtimeSuggestions: true,
    postCallAnalysis: true,
    skillGapIdentification: true,
    personalizedTraining: true
  }
};

// ============================================================================
// CONNECTOR PACK - Intégrations Sales
// ============================================================================

const salesConnector: ConnectorPack = {
  connectors: [
    {
      id: 'salesforce',
      name: 'Salesforce',
      type: 'crm',
      auth: { type: 'oauth2', scopes: ['api', 'refresh_token', 'full'] },
      endpoints: {
        leads: '/services/data/v60.0/sobjects/Lead',
        opportunities: '/services/data/v60.0/sobjects/Opportunity',
        accounts: '/services/data/v60.0/sobjects/Account',
        contacts: '/services/data/v60.0/sobjects/Contact',
        activities: '/services/data/v60.0/sobjects/Task'
      },
      syncConfig: { interval: 300000, bidirectional: true, conflictResolution: 'last_write_wins' },
      rateLimit: { requestsPerMinute: 1000, burst: 100 },
      webhooks: ['LeadCreated', 'OpportunityStageChanged', 'TaskCompleted']
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      type: 'crm',
      auth: { type: 'oauth2', scopes: ['crm.objects.contacts.read', 'crm.objects.deals.write'] },
      endpoints: {
        contacts: '/crm/v3/objects/contacts',
        deals: '/crm/v3/objects/deals',
        companies: '/crm/v3/objects/companies'
      },
      syncConfig: { interval: 300000, bidirectional: true },
      rateLimit: { requestsPerMinute: 100 }
    },
    {
      id: 'pipedrive',
      name: 'Pipedrive',
      type: 'crm',
      auth: { type: 'api_key', header: 'Authorization' },
      endpoints: {
        deals: '/v1/deals',
        persons: '/v1/persons',
        organizations: '/v1/organizations'
      }
    },
    {
      id: 'linkedin_sales_nav',
      name: 'LinkedIn Sales Navigator',
      type: 'social_selling',
      auth: { type: 'oauth2', scopes: ['r_liteprofile', 'r_emailaddress'] },
      features: ['lead_recommendations', 'account_insights', 'inmail_tracking'],
      note: 'Integration via LinkedIn API partners'
    },
    {
      id: 'clearbit',
      name: 'Clearbit',
      type: 'data_enrichment',
      auth: { type: 'api_key', header: 'Authorization' },
      endpoints: {
        enrich: '/v2/companies/find',
        autocomplete: '/v2/companies/autocomplete'
      },
      rateLimit: { requestsPerMinute: 600 }
    },
    {
      id: 'docuSign',
      name: 'DocuSign',
      type: 'esignature',
      auth: { type: 'oauth2', scopes: ['signature', 'impersonation'] },
      endpoints: {
        envelopes: '/v2.1/accounts/{accountId}/envelopes',
        templates: '/v2.1/accounts/{accountId}/templates'
      },
      webhooks: ['envelope-completed', 'envelope-declined']
    },
    {
      id: 'calendly',
      name: 'Calendly',
      type: 'scheduling',
      auth: { type: 'oauth2', scopes: ['read', 'write'] },
      endpoints: {
        event_types: '/v2/event_types',
        scheduled_events: '/v2/scheduled_events'
      },
      webhooks: ['invitee.created', 'invitee.canceled']
    },
    {
      id: 'slack',
      name: 'Slack',
      type: 'communication',
      auth: { type: 'oauth2', scopes: ['chat:write', 'channels:read', 'im:write'] },
      endpoints: {
        sendMessage: '/api/chat.postMessage',
        getUsers: '/api/users.list'
      }
    }
  ],
  dataSync: {
    strategy: 'bidirectional_incremental',
    lastSyncTracking: true,
    conflictDetection: true,
    conflictResolution: 'configurable',
    rollbackSupport: true,
    auditLog: true
  }
};

// ============================================================================
// PERMISSIONS PACK - RBAC Sales
// ============================================================================

const salesPermissions: PermissionsPack = {
  roles: [
    {
      id: 'sales_admin',
      name: 'Administrateur Sales',
      permissions: ['*'],
      description: 'Accès complet à tous les modules sales'
    },
    {
      id: 'sales_director',
      name: 'Directeur Commercial',
      permissions: [
        'dashboard:view_all',
        'pipeline:manage_all',
        'team:view_all',
        'reports:export_all',
        'deals:approve_discount',
        'forecasts:manage',
        'territories:assign',
        'quotas:set'
      ],
      description: 'Vision globale et management équipe'
    },
    {
      id: 'account_executive',
      name: 'Account Executive',
      permissions: [
        'dashboard:view_own',
        'pipeline:manage_own',
        'deals:create_edit_own',
        'contacts:manage_assigned',
        'proposals:send',
        'discounts:apply_limited',
        'contracts:generate',
        'meetings:schedule'
      ],
      description: 'Gestion complète de son portefeuille'
    },
    {
      id: 'sdr',
      name: 'Sales Development Representative',
      permissions: [
        'leads:view_assigned',
        'leads:qualify',
        'outreach:execute',
        'meetings:book',
        'crm:update_activities',
        'templates:use'
      ],
      description: 'Qualification et génération de RDV'
    },
    {
      id: 'sales_ops',
      name: 'Sales Operations',
      permissions: [
        'dashboard:view_all',
        'reports:create_custom',
        'data:export',
        'processes:configure',
        'integrations:manage',
        'training:access_all'
      ],
      description: 'Support opérationnel et analytics'
    }
  ],
  policies: [
    {
      id: 'deal_ownership_policy',
      name: 'Politique de Propriété des Deals',
      rules: [
        { condition: 'first_to_qualify', action: 'assign_owner', duration: '90_days' },
        { condition: 'no_activity_30_days', action: 'release_to_pool' },
        { condition: 'territory_mismatch', action: 'reassign_to_correct_territory' }
      ]
    },
    {
      id: 'discount_approval_policy',
      name: 'Politique d\'Approbation des Remises',
      rules: [
        { role: 'sdr', maxDiscount: 0, requiresApproval: true, approver: 'ae' },
        { role: 'account_executive', maxDiscount: 15, requiresApproval: false },
        { role: 'account_executive', maxDiscount: 25, requiresApproval: true, approver: 'sales_director' },
        { role: 'sales_director', maxDiscount: 40, requiresApproval: false }
      ]
    },
    {
      id: 'lead_distribution_policy',
      name: 'Politique de Distribution des Leads',
      rules: [
        { condition: 'inbound_marketing', action: 'round_robin_sdr' },
        { condition: 'outbound_targeted', action: 'assign_by_territory' },
        { condition: 'referral_vip', action: 'assign_to_senior_ae' }
      ]
    }
  ],
  menuFiltering: {
    enabled: true,
    dynamicMenus: true,
    hideBasedOnPermissions: true,
    customMenuBuilder: true
  },
  mfa: {
    required: true,
    methods: ['totp', 'sms', 'email', 'hardware_key'],
    exemptRoles: [],
    ipWhitelist: { enabled: true, allowedRanges: [] }
  },
  dataAccess: {
    rowLevelSecurity: true,
    fieldLevelSecurity: true,
    territoryBasedFiltering: true,
    ownRecordsOnly: { for: ['sdr', 'account_executive'] }
  }
};

// ============================================================================
// THEME PLUGIN MANIFEST
// ============================================================================

export const salesThemePlugin: ThemePlugin = {
  manifest: {
    id: 'com.whatsmaster.theme.sales-copilot',
    name: 'Sales Copilot',
    version: '1.0.0',
    description: 'Transformez votre plateforme en moteur de conversion: qualification automatique, scoring de leads, séquences de relance, détection d\'intention, résumé CRM.',
    vendor: {
      name: 'WhatsMaster Inc.',
      email: 'plugins@whatsmaster.io',
      url: 'https://whatsmaster.io',
      certification: 'verified',
      certifiedDate: '2024-11-15'
    },
    compatibility: {
      minPlatformVersion: '2.0.0',
      maxPlatformVersion: '3.0.0',
      requiredFeatures: ['messaging', 'crm_integration', 'analytics']
    },
    licensing: {
      type: 'proprietary',
      model: 'per_user',
      price: { amount: 129, currency: 'EUR', period: 'monthly' },
      trialDays: 14,
      volumeDiscounts: [
        { minUsers: 5, discount: 0.1 },
        { minUsers: 20, discount: 0.2 },
        { minUsers: 50, discount: 0.3 }
      ],
      enterprisePricing: { available: true, contactRequired: true }
    },
    compliance: {
      gdprReady: true,
      soc2Compliant: true,
      iso27001Compliant: true,
      ccpaCompliant: true,
      dataResidency: ['EU', 'US', 'UK', 'APAC'],
      privacyPolicyUrl: 'https://whatsmaster.io/privacy',
      lastAudit: '2024-10-15'
    },
    categories: ['Sales Automation', 'CRM Enhancement', 'Lead Generation', 'Revenue Intelligence'],
    tags: ['sales', 'leads', 'qualification', 'pipeline', 'conversion', 'copilot', 'ai-coaching'],
    screenshots: [
      { url: '/assets/sales/pipeline_dashboard.png', caption: 'Pipeline Vue Globale' },
      { url: '/assets/sales/lead_scoring.png', caption: 'Scoring IA de Leads' },
      { url: '/assets/sales/coaching_realtime.png', caption: 'Coaching en Temps Réel' },
      { url: '/assets/sales/team_performance.png', caption: 'Performance Équipe' }
    ],
    demoVideoUrl: 'https://whatsmaster.io/demo/sales-copilot',
    documentationUrl: 'https://docs.whatsmaster.io/themes/sales',
    supportUrl: 'https://support.whatsmaster.io',
    changelog: 'https://github.com/whatsmaster/themes/sales/CHANGELOG.md',
    caseStudies: [
      { title: '+35% de conversion en 3 mois', company: 'TechScale SAS', url: '/case-studies/techscale' },
      { title: 'Temps de qualification réduit de 60%', company: 'GrowthCorp', url: '/case-studies/growthcorp' }
    ]
  },
  
  branding: salesBranding,
  dashboard: salesDashboard,
  workflow: salesWorkflow,
  copilot: salesCopilot,
  connector: salesConnector,
  permissions: salesPermissions,
  
  metadata: {
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2024-11-15T10:00:00Z',
    author: 'WhatsMaster Product Team',
    license: 'Commercial'
  },
  
  healthChecks: [
    { id: 'connector_crm', name: 'Connexion CRM', type: 'connector', critical: true },
    { id: 'connector_enrichment', name: 'Enrichissement Données', type: 'connector', critical: false },
    { id: 'workflow_lead_qualification', name: 'Qualification Leads', type: 'workflow', critical: true },
    { id: 'copilot_scoring', name: 'IA Scoring', type: 'copilot', critical: true },
    { id: 'copilot_coaching', name: 'Coaching IA', type: 'copilot', critical: false }
  ],
  
  optionalDependencies: [
    { pluginId: 'com.whatsmaster.analytics', minVersion: '1.0.0', feature: 'Advanced Analytics', fallback: { enabled: false } },
    { pluginId: 'com.whatsmaster.marketing', minVersion: '1.0.0', feature: 'Marketing Automation', fallback: { enabled: false } },
    { pluginId: 'com.whatsmaster.conversation-intelligence', minVersion: '1.0.0', feature: 'Call Recording Analysis', fallback: { enabled: false } }
  ],
  
  integrations: {
    preconfigured: ['salesforce', 'hubspot', 'pipedrive'],
    available: ['clearbit', 'docuSign', 'calendly', 'slack', 'linkedin_sales_nav']
  }
};

export default salesThemePlugin;
