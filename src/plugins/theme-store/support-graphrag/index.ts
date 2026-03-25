/**
 * THEME-PLUGIN: Support Expert GraphRAG
 * PRIORITÉ 1 : SAV, IT Helpdesk, Service Client Premium
 * 
 * Architecture Autonome : Embarque UI, Workflows, IA, Connecteurs et Permissions.
 * Indépendant du core, activable en un clic.
 */

import type { ThemePluginManifest, BrandingPack, DashboardPack, WorkflowPack, CopilotPack, ConnectorPack, PermissionPack } from '../../types/theme-plugin';

// --- 1. MANIFESTE & LICENSING ---
export const manifest: ThemePluginManifest = {
  id: 'com.whatsmaster.theme.support-graphrag',
  name: 'Support Expert GraphRAG',
  version: '1.0.0',
  description: 'Solution autonome de support client augmentée par GraphRAG pour résolution contextuelle et escalade intelligente.',
  vendor: {
    name: 'WhatsMaster Labs',
    certification: 'verified_enterprise',
    contact: 'enterprise@whatsmaster.io'
  },
  licensing: {
    type: 'proprietary',
    model: 'per_agent_seat',
    price: { amount: 89, currency: 'EUR', period: 'monthly' },
    trialDays: 14
  },
  compliance: {
    gdprReady: true,
    soc2Compliant: true,
    iso27001Compliant: true,
    dataResidency: ['EU', 'US', 'SG']
  },
  compatibility: {
    minPlatformVersion: '2.5.0',
    channels: ['whatsapp', 'webchat', 'messenger', 'instagram']
  }
};

// --- 2. BRANDING PACK (UI/UX) ---
export const branding: BrandingPack = {
  theme: {
    light: {
      primary: '#2563EB', // Bleu Enterprise
      secondary: '#0EA5E9',
      accent: '#F59E0B', // Alertes
      background: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#0F172A'
    },
    dark: {
      primary: '#3B82F6',
      secondary: '#0EA5E9',
      accent: '#FBBF24',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F1F5F9'
    }
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", sans-serif',
    scale: 'modern-comfortable'
  },
  toneOfVoice: {
    style: 'empathetic_professional',
    guidelines: [
      'Toujours commencer par valider l\'émotion du client',
      'Utiliser un langage clair et non technique sauf si demandé',
      'Proposer systématiquement une étape suivante concrète'
    ],
    forbiddenPhrases: ['Ce n\'est pas notre problème', 'Je ne sais pas'],
    preferredPhrases: ['Je comprends votre frustration', 'Laissez-moi vérifier cela pour vous immédiatement']
  },
  iconSet: 'heroicons-outline',
  logoUrl: '/assets/themes/support-graphrag/logo.svg'
};

// --- 3. DASHBOARD PACK (KPIs & Vues) ---
export const dashboard: DashboardPack = {
  roles: [
    {
      roleId: 'support_agent',
      views: [
        {
          id: 'my_queue',
          title: 'Ma File d\'Attente',
          widgets: [
            { type: 'ticket_list', filter: 'assigned_to_me', sortBy: 'priority_desc' },
            { type: 'sla_timer', alertThreshold: 300 } // 5 min avant breach
          ]
        }
      ]
    },
    {
      roleId: 'support_manager',
      views: [
        {
          id: 'ops_overview',
          title: 'Vue Opérationnelle',
          widgets: [
            { type: 'kpi_card', metric: 'csat_score', target: 4.5 },
            { type: 'kpi_card', metric: 'first_response_time', target: 120 },
            { type: 'kpi_card', metric: 'resolution_rate_auto', target: 0.60 },
            { type: 'chart_line', metric: 'volume_by_hour', range: '24h' },
            { type: 'heatmap', metric: 'issue_clusters', dataSource: 'graph_rag' }
          ]
        }
      ]
    }
  ],
  alerts: [
    { id: 'vip_customer', condition: 'customer_tier == "platinum"', channel: 'slack' },
    { id: 'sla_breach_risk', condition: 'time_to_breach < 300', channel: 'sms' }
  ]
};

// --- 4. WORKFLOW PACK (Automatisations) ---
export const workflows: WorkflowPack = {
  automations: [
    {
      id: 'auto_triage_graphrag',
      name: 'Tri & Enrichissement Automatique',
      trigger: { type: 'message_received', conditions: ['is_new_ticket'] },
      steps: [
        { type: 'ai_intent_detection', model: 'hybrid-v2' },
        { type: 'graph_rag_lookup', entityTypes: ['product', 'error_code', 'order'], confidenceThreshold: 0.85 },
        { type: 'draft_response', template: 'suggested_answer', requireApproval: true },
        { type: 'route_ticket', logic: 'skill_based_routing' }
      ]
    },
    {
      id: 'sla_escalation_handler',
      name: 'Gestion Escalade SLA',
      trigger: { type: 'timer', condition: 'time_since_last_reply > 3600' },
      steps: [
        { type: 'notify_manager', message: 'Risque de breach SLA sur ticket {{ticket_id}}' },
        { type: 'upgrade_priority', newLevel: 'high' },
        { type: 'assign_agent', criteria: 'seniority_level >= 3' }
      ]
    },
    {
      id: 'auto_close_satisfaction',
      name: 'Clôture & Satisfaction',
      trigger: { type: 'status_change', to: 'resolved' },
      steps: [
        { type: 'wait', duration: 3600 }, // Attendre 1h
        { type: 'send_survey', type: 'csat_one_click' },
        { type: 'close_ticket', condition: 'no_customer_reply' }
      ]
    }
  ]
};

// --- 5. COPILOT PACK (IA & GraphRAG) ---
export const copilot: CopilotPack = {
  agents: [
    {
      id: 'tier1_resolver',
      role: 'Agent de Niveau 1 Autonome',
      capabilities: ['faq_retrieval', 'order_status', 'password_reset'],
      autonomyLevel: 'high', // Résout sans humain si confiance > 0.9
      prompts: {
        system: `Tu es l'expert support de ${manifest.name}. 
        Ta mission est de résoudre les problèmes techniques en utilisant la base de connaissances GraphRAG.
        Si la confiance est < 0.85, demande poliment plus de détails ou propose un humain.
        Ton : Empathique, Concis, Professionnel.`
      }
    },
    {
      id: 'agent_assist',
      role: 'Assistant pour Agents Humains',
      capabilities: ['summarization', 'sentiment_analysis', 'next_best_action'],
      prompts: {
        system: `Tu assistes un agent humain. Fournis un résumé du contexte, détecte l'émotion et suggère 3 réponses possibles basées sur l'historique similaire (GraphRAG).`
      }
    }
  ],
  graphRAG: {
    enabled: true,
    entitySchema: {
      Product: ['id', 'name', 'known_issues', 'firmware_version'],
      Customer: ['id', 'tier', 'purchase_history', 'sentiment_score'],
      Issue: ['category', 'solution_steps', 'related_products']
    },
    retrievalStrategy: 'hybrid_vector_graph',
    freshnessPolicy: 'real_time_sync'
  },
  safety: {
    piiMasking: true,
    hallucinationCheck: true,
    maxAutonomousActions: 3
  }
};

// --- 6. CONNECTOR PACK ---
export const connectors: ConnectorPack = {
  integrations: [
    {
      id: 'salesforce_service',
      name: 'Salesforce Service Cloud',
      type: 'crm',
      auth: 'oauth2',
      syncMode: 'bidirectional',
      mappings: {
        ticket: 'Case',
        contact: 'Contact',
        solution: 'Knowledge__kav'
      }
    },
    {
      id: 'jira_service_desk',
      name: 'Jira Service Management',
      type: 'itsm',
      auth: 'api_key',
      syncMode: 'bidirectional'
    },
    {
      id: 'zendesk',
      name: 'Zendesk Support',
      type: 'helpdesk',
      auth: 'oauth2',
      syncMode: 'read_only' // Mode migration ou backup
    }
  ]
};

// --- 7. PERMISSIONS PACK ---
export const permissions: PermissionPack = {
  roles: [
    {
      id: 'support_agent',
      name: 'Agent Support',
      permissions: ['ticket.read.own', 'ticket.write.own', 'knowledge.read', 'customer.read.basic'],
      restrictions: ['refund.approve', 'ticket.delete']
    },
    {
      id: 'support_lead',
      name: 'Team Lead',
      permissions: ['ticket.read.all', 'ticket.assign', 'macro.execute', 'report.view.team'],
      restrictions: ['system.config']
    },
    {
      id: 'support_admin',
      name: 'Administrateur Support',
      permissions: ['*', 'workflow.edit', 'connector.manage'],
      restrictions: []
    }
  ],
  menuFilter: {
    'support_agent': ['queue', 'tickets', 'knowledge'],
    'support_lead': ['queue', 'tickets', 'reports', 'team_performance'],
    'support_admin': ['*', 'settings', 'billing']
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
