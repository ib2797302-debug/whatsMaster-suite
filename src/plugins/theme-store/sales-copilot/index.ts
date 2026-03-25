/**
 * THEME-PLUGIN: Sales Copilot
 * PRIORITÉ 3 : Qualification Leads, Closing, CRM Automation
 * 
 * Architecture Autonome : Scoring IA, Séquences de Relance, Résumé CRM, Détection d'Intention.
 */

import type { ThemePluginManifest, BrandingPack, DashboardPack, WorkflowPack, CopilotPack, ConnectorPack, PermissionPack } from '../../types/theme-plugin';

// --- 1. MANIFESTE & LICENSING ---
export const manifest: ThemePluginManifest = {
  id: 'com.whatsmaster.theme.sales-copilot',
  name: 'Sales Copilot',
  version: '1.0.0',
  description: 'Moteur de conversion B2B avec qualification automatique, scoring de leads et séquences intelligentes.',
  vendor: {
    name: 'WhatsMaster Labs',
    certification: 'verified_enterprise',
    contact: 'enterprise@whatsmaster.io'
  },
  licensing: {
    type: 'proprietary',
    model: 'per_sales_seat',
    price: { amount: 149, currency: 'EUR', period: 'monthly' }, // Premium pour sales
    trialDays: 14
  },
  compliance: {
    gdprReady: true,
    soc2Compliant: true,
    iso27001Compliant: true,
    dataResidency: ['EU', 'US', 'UK']
  },
  compatibility: {
    minPlatformVersion: '2.5.0',
    channels: ['whatsapp', 'linkedin_messaging', 'email', 'sms']
  }
};

// --- 2. BRANDING PACK (UI/UX) ---
export const branding: BrandingPack = {
  theme: {
    light: {
      primary: '#6366F1', // Indigo Performance
      secondary: '#8B5CF6', // Violet Tech
      accent: '#10B981', // Succès/Win
      background: '#F5F3FF',
      surface: '#FFFFFF',
      text: '#1E1B4B'
    },
    dark: {
      primary: '#818CF8',
      secondary: '#A78BFA',
      accent: '#34D399',
      background: '#1E1B4B',
      surface: '#312E81',
      text: '#E0E7FF'
    }
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", sans-serif',
    scale: 'data-dense' // Plus d'infos à l'écran
  },
  toneOfVoice: {
    style: 'consultative_competitive',
    guidelines: [
      'Aller droit au but, le temps des prospects est précieux',
      'Poser des questions de qualification tôt (BANT)',
      'Mettre en avant le ROI et les gains business',
      'Utiliser la preuve sociale (cas clients similaires)'
    ],
    forbiddenPhrases: ['Je voulais juste prendre de vos nouvelles', 'Avez-vous eu le temps ?'],
    preferredPhrases: ['Quel est votre principal défi actuel ?', 'Voici comment nous avons aidé [Concurrent]...', 'Seriez-vous ouvert à une démo de 15 min ?']
  },
  iconSet: 'heroicons-solid',
  logoUrl: '/assets/themes/sales-copilot/logo.svg'
};

// --- 3. DASHBOARD PACK (KPIs & Vues) ---
export const dashboard: DashboardPack = {
  roles: [
    {
      roleId: 'sales_rep',
      views: [
        {
          id: 'my_pipeline',
          title: 'Mon Pipeline',
          widgets: [
            { type: 'kanban_board', groupBy: 'deal_stage', sortBy: 'deal_value_desc' },
            { type: 'task_list', filter: 'today_priority', includeAI: true },
            { type: 'hot_leads_alert', threshold: 85 } // Score > 85
          ]
        }
      ]
    },
    {
      roleId: 'sales_manager',
      views: [
        {
          id: 'team_performance',
          title: 'Performance Équipe',
          widgets: [
            { type: 'kpi_card', metric: 'pipeline_generated', target: 500000 },
            { type: 'kpi_card', metric: 'conversion_rate_lead_to_opportunity', target: 0.30 },
            { type: 'kpi_card', metric: 'average_deal_size', target: 15000 },
            { type: 'kpi_card', metric: 'sales_cycle_days', target: 45, inverse: true }, // Plus bas = mieux
            { type: 'chart_funnel', metric: 'sales_funnel', stages: ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won'] },
            { type: 'leaderboard', metric: 'revenue_closed', period: 'month' },
            { type: 'forecast_chart', metric: 'revenue_forecast', confidence: 0.80 }
          ]
        }
      ]
    }
  ],
  alerts: [
    { id: 'hot_lead_detected', condition: 'lead_score > 90', channel: 'slack_immediate' },
    { id: 'stale_deal', condition: 'days_in_stage > 14 && stage != "closed"', channel: 'email_coach' },
    { id: 'competitor_mentioned', condition: 'message_contains_competitor', channel: 'whatsapp_agent' }
  ]
};

// --- 4. WORKFLOW PACK (Automatisations) ---
export const workflows: WorkflowPack = {
  automations: [
    {
      id: 'lead_qualification_sequence',
      name: 'Qualification Automatique BANT',
      trigger: { type: 'new_lead_received', source: ['webinar', 'download', 'contact_form'] },
      steps: [
        { type: 'enrich_data', provider: 'clearbit' },
        { type: 'ai_score_lead', model: 'bant_classifier' },
        { type: 'route_lead', logic: 'round_robin_if_qualified_else_nurture' },
        { type: 'send_message', template: 'qualification_intro', condition: 'score > 70' },
        { type: 'add_to_nurture_campaign', campaign: 'cold_leads_monthly', condition: 'score < 70' }
      ]
    },
    {
      id: 'follow_up_orchestrator',
      name: 'Orchestrateur de Relances',
      trigger: { type: 'no_reply_after', duration: 172800 }, // 48h
      steps: [
        { type: 'analyze_last_interaction', sentiment: true },
        { type: 'generate_followup_variant', aiModel: 'gpt-4', variants: 3 },
        { type: 'a_b_test_select', historicalWinRate: true },
        { type: 'send_message', channel: 'multi_channel_rotate' }, // WhatsApp -> Email -> LinkedIn
        { type: 'wait', duration: 86400 },
        { type: 'escalate_to_human', condition: 'no_reply_after_3_attempts' }
      ]
    },
    {
      id: 'meeting_scheduler',
      name: 'Prise de RDV Intelligente',
      trigger: { type: 'intent_detected', intent: 'interested_demo' },
      steps: [
        { type: 'check_calendar_availability', calendar: 'google_calendar' },
        { type: 'propose_slots', count: 3, timezoneAware: true },
        { type: 'confirm_booking', onReply: 'positive' },
        { type: 'create_meeting', platform: 'zoom', sendInvite: true },
        { type: 'send_prep_email', include: ['agenda', 'case_study_relevant', 'bio_sales_rep'] }
      ]
    },
    {
      id: 'contract_negotiation_flow',
      name: 'Support Négociation Contrat',
      trigger: { type: 'stage_change', to: 'negotiation' },
      steps: [
        { type: 'generate_proposal_doc', template: 'enterprise_sow', fillFromCRM: true },
        { type: 'notify_legal', ifCustomClauses: true },
        { type: 'track_document_views', alertOnView: true },
        { type: 'send_reminder', ifNotSignedAfter: 259200 } // 3 jours
      ]
    }
  ]
};

// --- 5. COPILOT PACK (IA & GraphRAG) ---
export const copilot: CopilotPack = {
  agents: [
    {
      id: 'sdr_bot',
      role: 'SDR Autonome (Sales Development Rep)',
      capabilities: ['outbound_prospecting', 'initial_qualification', 'meeting_booking'],
      autonomyLevel: 'medium', // Book RDV < 5k€ potentiel
      prompts: {
        system: `Tu es un SDR expert pour ${manifest.name}.
        Ta mission est de qualifier les leads entrants et sortants selon la méthode BANT (Budget, Authority, Need, Timeline).
        Sois direct, professionnel et orienté valeur.
        Si le lead montre un fort intérêt, propose immédiatement un créneau de démo.
        Ne jamais mentir sur les fonctionnalités.`
      }
    },
    {
      id: 'account_executive_assist',
      role: 'Assistant AE (Account Executive)',
      capabilities: ['call_summarization', 'objection_handling', 'proposal_generation', 'competitor_intel'],
      autonomyLevel: 'low', // Support décision humaine
      prompts: {
        system: `Tu assistes un Account Executive en temps réel pendant les appels et négociations.
        Fournis des arguments de défense contre les objections.
        Résume les appels automatiquement dans le CRM.
        Suggère le "Next Best Action" basé sur le succès historique similaire.`
      }
    },
    {
      id: 'churn_risk_detector',
      role: 'Détecteur de Risque de Churn (Opportunités)',
      capabilities: ['sentiment_analysis', 'engagement_scoring', 'risk_flagging'],
      prompts: {
        system: `Analyse les interactions pour détecter les signes de désintérêt ou de frustration.
        Alerte le commercial si le risque de perdre l'opportunité dépasse 60%.`
      }
    }
  ],
  graphRAG: {
    enabled: true,
    entitySchema: {
      Company: ['id', 'name', 'industry', 'size', 'tech_stack', 'recent_news', 'decision_makers'],
      Deal: ['id', 'value', 'stage', 'probability', 'competitors', 'pain_points'],
      Interaction: ['id', 'type', 'sentiment', 'topics_discussed', 'next_steps'],
      Competitor: ['name', 'strengths', 'weaknesses', 'pricing_comparison', 'battlecard_url']
    },
    retrievalStrategy: 'relationship_aware_traversal', // Comprendre les liens Decision Maker <-> Company <-> Deal
    freshnessPolicy: 'real_time_crm_sync'
  },
  safety: {
    piiMasking: true,
    complianceCheck: true, // Vérifier promesses conformes juridique
    antiSpam: true // Respecter limites d'envoi
  }
};

// --- 6. CONNECTOR PACK ---
export const connectors: ConnectorPack = {
  integrations: [
    {
      id: 'salesforce_sales',
      name: 'Salesforce Sales Cloud',
      type: 'crm',
      auth: 'oauth2',
      syncMode: 'bidirectional_realtime',
      mappings: {
        lead: 'Lead',
        opportunity: 'Opportunity',
        account: 'Account',
        contact: 'Contact',
        activity: 'Task/Event'
      }
    },
    {
      id: 'hubspot_crm',
      name: 'HubSpot',
      type: 'crm',
      auth: 'oauth2',
      syncMode: 'bidirectional'
    },
    {
      id: 'pipedrive',
      name: 'Pipedrive',
      type: 'crm',
      auth: 'oauth2',
      syncMode: 'bidirectional'
    },
    {
      id: 'linkedin_sales_nav',
      name: 'LinkedIn Sales Navigator',
      type: 'social_selling',
      auth: 'oauth2',
      features: ['profile_enrichment', 'inmail_send', 'lead_recommendations']
    },
    {
      id: 'clearbit_enrichment',
      name: 'Clearbit',
      type: 'data_enrichment',
      auth: 'api_key',
      features: ['company_lookup', 'person_lookup', 'logo_fetch']
    },
    {
      id: 'zoom_meetings',
      name: 'Zoom',
      type: 'conferencing',
      auth: 'oauth2',
      features: ['meeting_create', 'recording_transcribe', 'summary_ai']
    },
    {
      id: 'docu_sign',
      name: 'DocuSign',
      type: 'esignature',
      auth: 'oauth2',
      features: ['envelope_send', 'status_track', 'signed_store']
    }
  ]
};

// --- 7. PERMISSIONS PACK ---
export const permissions: PermissionPack = {
  roles: [
    {
      id: 'sdr',
      name: 'Sales Development Rep',
      permissions: ['lead.read.assigned', 'lead.write.own', 'meeting.book', 'sequence.send'],
      restrictions: ['discount.approve', 'contract.send', 'lead.reassign']
    },
    {
      id: 'account_executive',
      name: 'Account Executive',
      permissions: ['opportunity.manage.all', 'proposal.generate', 'discount.request', 'contract.initiate'],
      restrictions: ['discount.override', 'territory.change']
    },
    {
      id: 'sales_manager',
      name: 'Directeur Commercial',
      permissions: ['pipeline.view.all', 'lead.reassign', 'discount.approve.tier1', 'forecast.edit', 'team.coach'],
      restrictions: ['compensation.change', 'territory.restructure']
    },
    {
      id: 'vp_sales',
      name: 'VP Sales',
      permissions: ['*', 'discount.approve.unlimited', 'territory.manage', 'quota.set'],
      restrictions: []
    }
  ],
  menuFilter: {
    'sdr': ['leads', 'sequences', 'calendar', 'tasks'],
    'account_executive': ['pipeline', 'accounts', 'proposals', 'meetings'],
    'sales_manager': ['pipeline', 'forecast', 'reports', 'team_dashboard', 'coaching'],
    'vp_sales': ['*', 'strategy', 'compensation', 'territories']
  }
};

// Export du Plugin Complet
export default {
  manifest,
  branding,
  dashboard,
  workflows,
  copilot,
  connectors,
  permissions
};
