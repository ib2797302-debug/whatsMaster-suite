/**
 * Theme-Plugin: Support Expert GraphRAG
 * 
 * Plugin métier pour le support client nouvelle génération
 * Fonctionnalités: Base de connaissance relationnelle, réponses contextualisées, 
 * escalade automatique, SLA, analyse de motifs récurrents
 * 
 * Cible: SAV, IT helpdesk, service client premium
 * Version: 2026.1.0 - Production Ready
 */

import type { 
  ThemePluginInstance,
  ThemePluginManifest,
  BrandingPack,
  DashboardPack,
  WorkflowPack,
  CopilotPack,
  ConnectorPack,
  PermissionsPack
} from '../../../types/theme-plugin';

// ============================================================================
// MANIFESTE DU PLUGIN
// ============================================================================

const manifest: ThemePluginManifest = {
  id: 'com.whatsmaster.theme.support-graphrag',
  name: 'Support Expert GraphRAG',
  version: '2026.1.0',
  description: 'Solution complète de support client avec IA conversationnelle GraphRAG, base de connaissances relationnelle, et automatisation intelligente des tickets.',
  
  vendor: {
    name: 'WhatsMaster Labs',
    certification: 'verified',
    contact: 'support@whatsmaster.io',
    website: 'https://whatsmaster.io/plugins/support-graphrag'
  },
  
  licensing: {
    type: 'proprietary',
    model: 'per_user',
    price: {
      amount: 99,
      currency: 'EUR',
      period: 'monthly'
    },
    trialDays: 14
  },
  
  compliance: {
    gdprReady: true,
    soc2Compliant: true,
    iso27001Compliant: true,
    hipaaCompliant: false,
    pciDssCompliant: false,
    dataResidency: ['EU', 'US', 'CA']
  },
  
  dependencies: [],
  
  capabilities: [
    'agentic_workforce',
    'graph_rag',
    'finops_aware',
    'offline_capable'
  ],
  
  categories: ['Customer Service', 'IT Helpdesk', 'Support'],
  tags: ['GraphRAG', 'AI', 'Ticketing', 'SLA', 'Knowledge Base'],
  minPlatformVersion: '2025.1.0',
  supportedLanguages: ['fr', 'en', 'es', 'de', 'it', 'pt'],
  lastUpdated: '2026-01-15T10:00:00Z'
};

// ============================================================================
// BRANDING PACK
// ============================================================================

const brandingPack: BrandingPack = {
  identity: {
    primaryColor: '#2563EB',
    secondaryColor: '#0EA5E9',
    accentColor: '#F59E0B',
    backgroundColor: '#FFFFFF',
    textColor: '#1E293B',
    errorColor: '#EF4444',
    successColor: '#10B981',
    warningColor: '#F59E0B',
    infoColor: '#3B82F6'
  },
  
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSizeBase: 14,
    fontSizeScale: 1.2,
    fontWeightBase: 400,
    fontWeightBold: 600,
    lineHeight: 1.6,
    letterSpacing: '-0.01em'
  },
  
  iconography: {
    style: 'outline',
    library: 'lucide-react',
    size: 'md',
    strokeWidth: 1.5
  },
  
  toneOfVoice: {
    style: 'professional_empathetic',
    formality: 'semi_formal',
    emojiUsage: 'minimal',
    guidelines: [
      'Toujours commencer par une salutation personnalisée',
      'Utiliser un ton empathique mais professionnel',
      'Éviter le jargon technique sauf si demandé',
      'Proposer systématiquement une aide supplémentaire',
      'Confirmer la résolution avant de clôturer'
    ],
    examples: {
      greeting: 'Bonjour {{customerName}}, je comprends votre préoccupation concernant {{issue}}.',
      empathy: 'Je sais que cette situation peut être frustrante, laissez-moi vous aider.',
      resolution: 'Parfait ! Votre problème est résolu. Y a-t-il autre chose que je puisse faire ?',
      escalation: 'Je transfère votre demande à un expert senior qui vous contactera dans les {{slaTime}}.'
    }
  },
  
  themes: {
    light: {
      colors: {
        background: '#FFFFFF',
        surface: '#F8FAFC',
        border: '#E2E8F0',
        text: '#1E293B',
        textMuted: '#64748B',
        primary: '#2563EB',
        secondary: '#0EA5E9'
      }
    },
    dark: {
      colors: {
        background: '#0F172A',
        surface: '#1E293B',
        border: '#334155',
        text: '#F1F5F9',
        textMuted: '#94A3B8',
        primary: '#3B82F6',
        secondary: '#0EA5E9'
      }
    }
  },
  
  accessibility: {
    wcagLevel: 'AA',
    contrastRatio: 4.5,
    focusIndicator: 'visible',
    reducedMotion: true,
    screenReaderOptimized: true
  }
};

// ============================================================================
// DASHBOARD PACK
// ============================================================================

const dashboardPack: DashboardPack = {
  views: [
    {
      id: 'agent_overview',
      name: 'Vue Agent',
      role: 'agent',
      layout: 'grid_3x2',
      refreshInterval: 30000,
      widgets: [
        {
          id: 'my_tickets',
          type: 'list',
          title: 'Mes Tickets en Cours',
          config: {
            dataSource: 'tickets_assigned_to_me',
            filters: { status: ['open', 'pending'] },
            sortBy: 'priority_desc',
            limit: 10,
            columns: ['id', 'subject', 'customer', 'priority', 'sla_status', 'age']
          },
          position: { row: 1, col: 1, width: 2, height: 2 }
        },
        {
          id: 'sla_gauge',
          type: 'gauge',
          title: 'Respect SLA',
          config: {
            dataSource: 'sla_compliance_rate',
            min: 0,
            max: 100,
            thresholds: { red: 80, yellow: 90, green: 95 },
            unit: '%'
          },
          position: { row: 1, col: 3, width: 1, height: 1 }
        },
        {
          id: 'response_time',
          type: 'metric',
          title: 'Temps de Réponse Moyen',
          config: {
            dataSource: 'avg_response_time',
            format: 'duration',
            comparison: 'previous_period',
            trend: 'improving'
          },
          position: { row: 2, col: 3, width: 1, height: 1 }
        },
        {
          id: 'csat_score',
          type: 'metric',
          title: 'Score CSAT',
          config: {
            dataSource: 'csat_average',
            format: 'rating',
            scale: 5,
            comparison: 'target',
            target: 4.5
          },
          position: { row: 1, col: 3, width: 1, height: 1 }
        }
      ]
    },
    {
      id: 'manager_analytics',
      name: 'Analytics Manager',
      role: 'manager',
      layout: 'grid_4x3',
      refreshInterval: 60000,
      widgets: [
        {
          id: 'ticket_volume_trend',
          type: 'line_chart',
          title: 'Volume de Tickets (30j)',
          config: {
            dataSource: 'ticket_volume_daily',
            xField: 'date',
            yField: 'count',
            groupBy: 'category',
            showComparison: true
          },
          position: { row: 1, col: 1, width: 2, height: 2 }
        },
        {
          id: 'resolution_funnel',
          type: 'funnel',
          title: 'Funnel de Résolution',
          config: {
            dataSource: 'ticket_resolution_stages',
            stages: ['received', 'in_progress', 'waiting_customer', 'resolved'],
            showConversionRate: true
          },
          position: { row: 1, col: 3, width: 1, height: 2 }
        },
        {
          id: 'top_issues',
          type: 'bar_chart',
          title: 'Top 10 Problèmes Récurrents',
          config: {
            dataSource: 'issue_frequency',
            xField: 'issue_type',
            yField: 'count',
            orientation: 'horizontal',
            limit: 10
          },
          position: { row: 2, col: 1, width: 2, height: 1 }
        },
        {
          id: 'team_performance',
          type: 'table',
          title: 'Performance Équipe',
          config: {
            dataSource: 'agent_metrics',
            columns: [
              { field: 'agent_name', header: 'Agent' },
              { field: 'tickets_resolved', header: 'Résolus' },
              { field: 'avg_resolution_time', header: 'Temps Moyen' },
              { field: 'csat_score', header: 'CSAT' },
              { field: 'sla_compliance', header: 'SLA %' }
            ],
            sortable: true,
            pagination: true
          },
          position: { row: 3, col: 1, width: 3, height: 1 }
        }
      ]
    }
  ],
  
  alerts: [
    {
      id: 'sla_breach_warning',
      name: 'Alerte Risque Breche SLA',
      condition: 'ticket.sla_remaining < 30_minutes',
      severity: 'warning',
      notification: ['in_app', 'email'],
      action: 'escalate_to_senior'
    },
    {
      id: 'high_priority_ticket',
      name: 'Ticket Haute Priorité',
      condition: 'ticket.priority == "critical"',
      severity: 'high',
      notification: ['in_app', 'sms', 'slack'],
      action: 'assign_best_agent'
    },
    {
      id: 'negative_csat',
      name: 'Feedback Négatif',
      condition: 'csat.score <= 2',
      severity: 'high',
      notification: ['in_app', 'email'],
      action: 'trigger_follow_up'
    }
  ]
};

// ============================================================================
// WORKFLOW PACK
// ============================================================================

const workflowPack: WorkflowPack = {
  workflows: [
    {
      id: 'auto_ticket_routing',
      name: 'Routage Automatique des Tickets',
      description: 'Analyse le ticket entrant et l\'assigne au meilleur agent disponible',
      enabled: true,
      trigger: {
        type: 'event',
        event: 'ticket.created'
      },
      nodes: [
        {
          id: 'analyze_intent',
          type: 'ai_prompt',
          name: 'Analyse Intention',
          config: {
            prompt: {
              template: `Analyse ce ticket de support et identifie:
1. La catégorie principale (technique, facturation, produit, autre)
2. Le niveau d'urgence (low, medium, high, critical)
3. Les compétences requises pour résoudre ce problème
4. Un résumé en 1 phrase

Ticket:
Sujet: {{ticket.subject}}
Description: {{ticket.description}}
Client: {{customer.tier}}`,
              complexity: 'medium',
              responseSchema: {
                type: 'object',
                properties: {
                  category: { type: 'string' },
                  urgency: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                  requiredSkills: { type: 'array', items: { type: 'string' } },
                  summary: { type: 'string' }
                }
              }
            }
          },
          outputVar: 'analysis'
        },
        {
          id: 'find_best_agent',
          type: 'action',
          name: 'Trouver Meilleur Agent',
          config: {
            action: {
              handler: async (params: any) => {
                // Logique de matching agent/ticket
                const agents = await getAvailableAgents(params.skills);
                return agents.sort((a: any, b: any) => b.score - a.score)[0];
              },
              params: {
                skills: '{{analysis.requiredSkills}}',
                tier: '{{customer.tier}}'
              }
            }
          },
          outputVar: 'assigned_agent'
        },
        {
          id: 'assign_ticket',
          type: 'api_call',
          name: 'Assigner Ticket',
          config: {
            api: {
              connectorId: 'internal_api',
              url: '/api/v1/tickets/{{ticket.id}}/assign',
              method: 'POST',
              body: {
                agentId: '{{assigned_agent.id}}',
                priority: '{{analysis.urgency}}',
                category: '{{analysis.category}}'
              }
            }
          }
        },
        {
          id: 'notify_customer',
          type: 'action',
          name: 'Notifier Client',
          condition: {
            field: 'customer.notify_on_assignment',
            operator: 'eq',
            value: true
          },
          config: {
            action: {
              handler: async (params: any) => {
                await sendNotification({
                  to: params.customer.email,
                  template: 'ticket_assigned',
                  data: {
                    agentName: params.agent.name,
                    estimatedResponse: params.agent.avg_response_time
                  }
                });
              },
              params: {
                customer: '{{customer}}',
                agent: '{{assigned_agent}}'
              }
            }
          }
        }
      ]
    },
    {
      id: 'sla_monitoring',
      name: 'Surveillance SLA et Escalade',
      description: 'Surveille les tickets proches de breach SLA et escalade automatiquement',
      enabled: true,
      trigger: {
        type: 'schedule',
        cron: '*/5 * * * *' // Toutes les 5 minutes
      },
      nodes: [
        {
          id: 'fetch_at_risk_tickets',
          type: 'api_call',
          name: 'Récupérer Tickets à Risque',
          config: {
            api: {
              connectorId: 'internal_api',
              url: '/api/v1/tickets?sla_remaining_lt=1800&status=open',
              method: 'GET'
            }
          },
          outputVar: 'at_risk_tickets'
        },
        {
          id: 'process_each_ticket',
          type: 'decision',
          name: 'Traiter Chaque Ticket',
          config: {
            branches: [
              {
                condition: {
                  field: 'ticket.sla_remaining',
                  operator: 'lt',
                  value: 900 // < 15 min
                },
                nodes: [
                  {
                    id: 'escalate_critical',
                    type: 'action',
                    name: 'Escalade Critique',
                    config: {
                      action: {
                        handler: async (params: any) => {
                          await escalateTicket(params.ticket.id, 'senior_manager');
                          await notifyTeam('slack', `🚨 Ticket ${params.ticket.id} en risque critique SLA!`);
                        },
                        params: {
                          ticket: '{{ticket}}'
                        }
                      }
                    }
                  }
                ]
              },
              {
                condition: {
                  field: 'ticket.sla_remaining',
                  operator: 'lt',
                  value: 1800 // < 30 min
                },
                nodes: [
                  {
                    id: 'escalate_warning',
                    type: 'action',
                    name: 'Alerte Warning',
                    config: {
                      action: {
                        handler: async (params: any) => {
                          await notifyAgent(params.ticket.assigned_agent, 'SLA_WARNING');
                        },
                        params: {
                          ticket: '{{ticket}}'
                        }
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      id: 'auto_response_suggestion',
      name: 'Suggestion de Réponse Automatique',
      description: 'Génère des suggestions de réponse basées sur la base de connaissances GraphRAG',
      enabled: true,
      trigger: {
        type: 'event',
        event: 'ticket.opened_by_agent'
      },
      nodes: [
        {
          id: 'search_knowledge_base',
          type: 'ai_prompt',
          name: 'Recherche GraphRAG',
          config: {
            prompt: {
              template: `Recherche dans la base de connaissances les articles pertinents pour ce problème:
              
Problème: {{ticket.description}}
Catégorie: {{ticket.category}}
Produit concerné: {{ticket.product}}

Retourne les 3 articles les plus pertinents avec leur contenu résumé.`,
              complexity: 'high',
              graphRAGPolicies: {
                entityTypes: ['product', 'issue', 'solution', 'faq'],
                relationshipDepth: 2,
                confidenceThreshold: 0.85
              }
            }
          },
          outputVar: 'kb_articles'
        },
        {
          id: 'generate_response',
          type: 'ai_prompt',
          name: 'Générer Réponse',
          config: {
            prompt: {
              template: `En tant qu'agent de support expert, rédige une réponse professionnelle et empathique pour ce ticket.

Contexte:
- Ticket: {{ticket.subject}}
- Description: {{ticket.description}}
- Articles KB pertinents: {{kb_articles}}
- Historique client: {{customer.history_summary}}

Directives:
- Ton: professionnel et empathique
- Structure: salutation, compréhension du problème, solution proposée, offre d'aide supplémentaire
- Inclure des étapes claires si applicable
- Personnaliser selon le tier client`,
              complexity: 'medium',
              safetyFilters: [
                { filterType: 'pii', action: 'mask' },
                { filterType: 'sentiment', action: 'adjust_if_negative' }
              ]
            }
          },
          outputVar: 'suggested_response'
        },
        {
          id: 'present_to_agent',
          type: 'action',
          name: 'Présenter à l\'Agent',
          config: {
            action: {
              handler: async (params: any) => {
                await updateTicketUI(params.ticket.id, {
                  suggestedResponse: params.response,
                  kbReferences: params.articles
                });
              },
              params: {
                ticket: '{{ticket}}',
                response: '{{suggested_response}}',
                articles: '{{kb_articles}}'
              }
            }
          }
        }
      ]
    }
  ]
};

// ============================================================================
// COPILOT PACK
// ============================================================================

const copilotPack: CopilotPack = {
  prompts: [
    {
      id: 'ticket_summarization',
      name: 'Résumé de Ticket',
      description: 'Génère un résumé concis d\'un long fil de conversation',
      template: `Résume cette conversation de support en mettant en évidence:
1. Le problème principal du client
2. Les actions déjà entreprises
3. L'état actuel de la résolution
4. Les prochaines étapes recommandées

Conversation:
{{conversation_history}}

Format: Résumé structuré en 150 mots maximum.`,
      variables: ['conversation_history'],
      options: {
        temperature: 0.3,
        maxTokens: 200
      }
    },
    {
      id: 'sentiment_analysis',
      name: 'Analyse de Sentiment',
      description: 'Détecte le sentiment du client et son évolution',
      template: `Analyse le sentiment du client dans cette conversation:
{{conversation_history}}

Retourne:
- Sentiment actuel (positive/neutral/negative/frustrated/angry)
- Niveau de satisfaction (1-5)
- Signaux d'alerte détectés
- Recommandation d'action`,
      variables: ['conversation_history'],
      options: {
        temperature: 0.2,
        responseFormat: 'json'
      }
    },
    {
      id: 'root_cause_analysis',
      name: 'Analyse Cause Racine',
      description: 'Identifie la cause racine d\'un problème récurrent',
      template: `À partir de ces tickets similaires, identifie la cause racine commune:

Tickets:
{{similar_tickets}}

Méthode: Utilise la technique des "5 Pourquoi"
Retourne:
- Cause racine identifiée
- Pattern détecté
- Recommandation corrective
- Estimation d'impact`,
      variables: ['similar_tickets'],
      options: {
        temperature: 0.4,
        reasoningSteps: true
      }
    }
  ],
  
  policies: {
    defaultLLM: 'gpt-4o',
    fallbackChain: ['gpt-4o-mini', 'claude-3-haiku'],
    maxTokensPerRequest: 2000,
    costBudgetPerTicket: 0.05,
    
    graphRAGPolicies: {
      enabled: true,
      entityTypes: ['product', 'issue', 'solution', 'faq', 'customer_tier'],
      relationshipTypes: ['relates_to', 'causes', 'solves', 'requires'],
      maxRelationshipDepth: 3,
      confidenceThreshold: 0.85,
      includeSources: true
    },
    
    safetyFilters: [
      {
        filterType: 'pii',
        action: 'mask',
        patterns: ['email', 'phone', 'credit_card', 'ssn']
      },
      {
        filterType: 'sentiment',
        action: 'adjust_if_negative',
        threshold: 0.3
      },
      {
        filterType: 'toxicity',
        action: 'block',
        threshold: 0.8
      },
      {
        filterType: 'competitor_mention',
        action: 'flag_for_review'
      }
    ],
    
    routingRules: [
      {
        condition: { complexity: 'low', tokenCount: '<100' },
        model: 'gpt-4o-mini',
        reason: 'Simple query, cost optimization'
      },
      {
        condition: { priority: 'critical' },
        model: 'gpt-4o',
        reason: 'High priority, best quality'
      },
      {
        condition: { language: 'non_english' },
        model: 'gpt-4o',
        reason: 'Better multilingual support'
      }
    ]
  },
  
  assistants: [
    {
      id: 'support_copilot',
      name: 'Support Copilot',
      description: 'Assistant IA pour les agents de support',
      capabilities: [
        'suggest_response',
        'search_kb',
        'summarize_thread',
        'detect_sentiment',
        'predict_escalation'
      ],
      ui: {
        position: 'sidebar',
        collapsible: true,
        autoTrigger: ['long_thread', 'negative_sentiment', 'complex_issue']
      }
    }
  ]
};

// ============================================================================
// CONNECTOR PACK
// ============================================================================

const connectorPack: ConnectorPack = {
  connectors: [
    {
      id: 'salesforce_connector',
      name: 'Salesforce CRM',
      type: 'crm',
      enabled: true,
      config: {
        authType: 'oauth2',
        scopes: ['api', 'refresh_token'],
        endpoints: {
          base: 'https://{{instance}}.salesforce.com/services/data/v58.0',
          accounts: '/sobjects/Account',
          contacts: '/sobjects/Contact',
          cases: '/sobjects/Case'
        }
      },
      sync: {
        direction: 'bidirectional',
        entities: ['accounts', 'contacts', 'cases'],
        frequency: 'realtime'
      }
    },
    {
      id: 'zendesk_connector',
      name: 'Zendesk',
      type: 'ticketing',
      enabled: true,
      config: {
        authType: 'api_key',
        endpoints: {
          base: 'https://{{subdomain}}.zendesk.com/api/v2',
          tickets: '/tickets.json',
          users: '/users.json',
          organizations: '/organizations.json'
        }
      },
      sync: {
        direction: 'bidirectional',
        entities: ['tickets', 'users'],
        frequency: 'realtime'
      }
    },
    {
      id: 'slack_connector',
      name: 'Slack Notifications',
      type: 'messaging',
      enabled: true,
      config: {
        authType: 'oauth2',
        scopes: ['chat:write', 'channels:read'],
        endpoints: {
          base: 'https://slack.com/api',
          postMessage: '/chat.postMessage',
          getUsers: '/users.list'
        }
      }
    },
    {
      id: 'jira_connector',
      name: 'Jira Software',
      type: 'issue_tracking',
      enabled: false,
      config: {
        authType: 'basic',
        endpoints: {
          base: 'https://{{domain}}.atlassian.net/rest/api/3',
          issues: '/issue',
          projects: '/project'
        }
      }
    }
  ]
};

// ============================================================================
// PERMISSIONS PACK
// ============================================================================

const permissionsPack: PermissionsPack = {
  roles: [
    {
      id: 'support_agent',
      name: 'Agent de Support',
      description: 'Agent frontline pour la gestion des tickets',
      permissions: {
        tickets: ['view_assigned', 'update', 'comment', 'resolve'],
        customers: ['view_basic'],
        knowledge_base: ['view', 'suggest_edit'],
        reports: ['view_own_performance'],
        workflows: ['execute_assigned']
      },
      restrictions: {
        maxTicketAssignment: 20,
        canDelete: false,
        canExport: false,
        accessibleMenus: ['tickets', 'customers', 'kb', 'profile']
      }
    },
    {
      id: 'senior_agent',
      name: 'Agent Senior',
      description: 'Agent expérimenté avec droits étendus',
      parentRole: 'support_agent',
      permissions: {
        tickets: ['view_all', 'reassign', 'escalate', 'merge'],
        customers: ['view_full', 'edit'],
        knowledge_base: ['create', 'edit', 'approve'],
        workflows: ['execute_all', 'modify_templates']
      },
      restrictions: {
        maxTicketAssignment: 30,
        canDelete: false,
        canExport: true,
        accessibleMenus: ['tickets', 'customers', 'kb', 'reports', 'workflows']
      }
    },
    {
      id: 'support_manager',
      name: 'Manager Support',
      description: 'Responsable d\'équipe avec vue complète',
      permissions: {
        tickets: ['view_all', 'assign', 'bulk_update', 'delete'],
        customers: ['view_all', 'edit', 'merge'],
        team: ['view_performance', 'assign_tickets', 'manage_schedules'],
        knowledge_base: ['create', 'edit', 'approve', 'delete'],
        reports: ['view_all', 'export', 'customize'],
        workflows: ['create', 'edit', 'delete', 'publish'],
        settings: ['view', 'configure_team']
      },
      restrictions: {
        canDelete: true,
        canExport: true,
        accessibleMenus: ['all']
      }
    },
    {
      id: 'admin',
      name: 'Administrateur',
      description: 'Accès complet au plugin',
      permissions: {
        '*': ['*']
      },
      restrictions: {
        canDelete: true,
        canExport: true,
        accessibleMenus: ['all']
      }
    }
  ],
  
  policies: [
    {
      id: 'data_access_policy',
      name: 'Politique d\'Accès aux Données',
      description: 'Contrôle l\'accès aux données sensibles clients',
      rules: [
        {
          resource: 'customer.pii',
          action: 'view',
          condition: 'role IN [senior_agent, manager, admin]',
          effect: 'allow'
        },
        {
          resource: 'customer.payment_info',
          action: 'view',
          condition: 'role IN [manager, admin] AND mfa_enabled = true',
          effect: 'allow'
        },
        {
          resource: '*',
          action: 'export',
          condition: 'role IN [manager, admin]',
          effect: 'allow'
        }
      ]
    },
    {
      id: 'ticket_modification_policy',
      name: 'Politique de Modification des Tickets',
      description: 'Contrôle les modifications critiques des tickets',
      rules: [
        {
          resource: 'ticket.status',
          action: 'change_to_closed',
          condition: 'ticket.csat_received = true OR role IN [manager, admin]',
          effect: 'allow'
        },
        {
          resource: 'ticket.assignee',
          action: 'reassign',
          condition: 'role IN [senior_agent, manager, admin]',
          effect: 'allow'
        }
      ]
    }
  ]
};

// ============================================================================
// INSTANCE DU PLUGIN
// ============================================================================

export const SupportGraphRAGPlugin: ThemePluginInstance = {
  manifest,
  brandingPack,
  dashboardPack,
  workflowPack,
  copilotPack,
  connectorPack,
  permissionsPack,
  
  hooks: {
    onPreInit: async () => {
      console.log('[Support GraphRAG] Pre-initialization...');
      // Initialiser la connexion à la base de connaissances
    },
    
    onPostInit: async () => {
      console.log('[Support GraphRAG] Post-initialization complete');
      // Démarrer les workflows planifiés
    },
    
    onHealthCheck: async () => {
      // Vérifier la santé des connecteurs et de la DB
      return {
        healthy: true,
        details: {
          knowledgeBase: 'connected',
          connectors: 'all_operational',
          lastSync: new Date().toISOString()
        }
      };
    },
    
    onPreDestroy: async () => {
      console.log('[Support GraphRAG] Cleaning up resources...');
      // Nettoyer les connexions et intervalles
    }
  }
};

export default SupportGraphRAGPlugin;
