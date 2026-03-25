/**
 * Theme Plugin: Commerce Conversationnel
 * Priorité #2 - WhatsApp Commerce & Retail
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
// BRANDING PACK - Identité E-commerce
// ============================================================================

const commerceBranding: BrandingPack = {
  theme: {
    primary: { light: '#10B981', dark: '#059669' }, // Emerald
    secondary: { light: '#F59E0B', dark: '#D97706' }, // Amber
    accent: { light: '#3B82F6', dark: '#2563EB' },
    background: { light: '#FFFFFF', dark: '#111827' },
    surface: { light: '#F9FAFB', dark: '#1F2937' },
    text: { light: '#1F2937', dark: '#F9FAFB' },
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", sans-serif',
    fontSizeBase: '16px',
    fontWeightHeading: '700',
    fontWeightBody: '400',
    lineHeightTight: '1.25',
    lineHeightRelaxed: '1.625'
  },
  iconography: {
    style: 'rounded-filled',
    library: 'lucide-react',
    sizeScale: ['16px', '20px', '24px', '32px', '48px']
  },
  toneOfVoice: {
    personality: 'dynamique, chaleureux, orienté conversion',
    guidelines: [
      'Utiliser un ton enthousiaste mais professionnel',
      'Mettre en avant les bénéfices produits',
      'Créer un sentiment d\'urgence (offres limitées)',
      'Personnaliser avec le prénom et l\'historique',
      'Utiliser des emojis modérés 🛍️✨🎁'
    ],
    forbidden: [
      'Jargon technique incompréhensible',
      'Ton trop formel ou froid',
      'Pression excessive à l\'achat'
    ],
    examples: {
      greeting: 'Bonjour {{firstName}} ! 👋 J'ai vu que vous regardiez {{productName}}. Excellente选择！Il ne reste que {{stockCount}} pièces.',
      upsell: 'Psst... Les clients qui ont acheté {{productA}} adorent aussi {{productB}} ! Voulez-vous voir les détails ? 😊',
      cartAbandonment: 'Oh non ! Votre panier {{cartName}} vous attend encore 🛒. Profitez de -10% avec le code WELCOME10 (valable 2h) !'
    }
  },
  responsive: {
    mobileFirst: true,
    breakpoints: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
    touchFriendly: true,
    minTouchTarget: '44px'
  },
  accessibility: {
    wcagLevel: 'AA',
    contrastRatio: 4.5,
    keyboardNavigation: true,
    screenReaderOptimized: true
  },
  localization: {
    defaultLocale: 'fr-FR',
    supportedLocales: ['fr-FR', 'en-US', 'es-ES', 'de-DE', 'it-IT'],
    rtlSupport: false,
    currencyFormats: {
      'fr-FR': { symbol: '€', position: 'after', decimal: ',', thousand: '.' },
      'en-US': { symbol: '$', position: 'before', decimal: '.', thousand: ',' }
    }
  }
};

// ============================================================================
// DASHBOARD PACK - Vues E-commerce
// ============================================================================

const commerceDashboard: DashboardPack = {
  roles: [
    {
      roleId: 'commerce_manager',
      label: 'Responsable E-commerce',
      views: [
        {
          id: 'revenue_overview',
          title: 'Vue d\'ensemble Revenus',
          widgets: [
            { id: 'revenue_today', type: 'kpi_card', metric: 'revenue', period: 'today', comparison: 'yesterday' },
            { id: 'orders_count', type: 'kpi_card', metric: 'orders', period: 'today', trend: 'up' },
            { id: 'conversion_rate', type: 'gauge', metric: 'conversion_rate', target: 3.5 },
            { id: 'revenue_chart', type: 'line_chart', metric: 'revenue', granularity: 'hourly', days: 7 }
          ]
        },
        {
          id: 'product_performance',
          title: 'Performance Produits',
          widgets: [
            { id: 'top_products', type: 'leaderboard', metric: 'units_sold', limit: 10 },
            { id: 'low_stock_alerts', type: 'alert_list', threshold: 10, critical: 5 },
            { id: 'category_breakdown', type: 'pie_chart', dimension: 'category' }
          ]
        }
      ]
    },
    {
      roleId: 'sales_agent',
      label: 'Conseiller Vente',
      views: [
        {
          id: 'my_conversations',
          title: 'Mes Conversations Actives',
          widgets: [
            { id: 'active_chats', type: 'conversation_list', status: 'active', sortBy: 'lastMessage' },
            { id: 'pending_orders', type: 'task_list', status: 'pending_payment' },
            { id: 'quick_stats', type: 'mini_kpis', metrics: ['conversations_today', 'sales_closed', 'avg_response_time'] }
          ]
        }
      ]
    }
  ],
  widgets: {
    kpi_card: {
      component: 'KpiCard',
      refreshInterval: 30000,
      caching: { enabled: true, ttl: 60000 },
      alerts: [{ condition: 'drop > 20%', severity: 'warning', action: 'notify_manager' }]
    },
    conversation_list: {
      component: 'ConversationList',
      features: ['search', 'filter', 'bulk_actions', 'quick_reply_templates'],
      sorting: ['priority', 'last_message', 'customer_value'],
      pagination: { pageSize: 20, infiniteScroll: true }
    },
    leaderboard: {
      component: 'LeaderboardWidget',
      animation: 'countUp',
      highlightTop: 3,
      exportFormats: ['csv', 'pdf']
    }
  },
  realTimeUpdates: {
    enabled: true,
    websocket: true,
    fallbackPolling: 5000
  }
};

// ============================================================================
// WORKFLOW PACK - Automatisations Commerce
// ============================================================================

const commerceWorkflow: WorkflowPack = {
  automations: [
    {
      id: 'abandoned_cart_recovery',
      name: 'Relance Panier Abandonné',
      trigger: { type: 'event', event: 'cart_abandoned', delay: '1h' },
      conditions: [{ field: 'cart_value', operator: 'gte', value: 50 }],
      nodes: [
        { id: 'check_inventory', type: 'api_call', config: { endpoint: '/inventory/check', method: 'POST' } },
        { id: 'send_reminder', type: 'action', config: { action: 'send_message', template: 'cart_recovery_sms' } },
        { id: 'offer_discount', type: 'decision', config: { condition: 'cart_value > 100', truePath: 'apply_10pct', falsePath: 'apply_5pct' } },
        { id: 'apply_10pct', type: 'action', config: { action: 'generate_coupon', discount: 10 } },
        { id: 'apply_5pct', type: 'action', config: { action: 'generate_coupon', discount: 5 } },
        { id: 'follow_up', type: 'wait', config: { duration: '24h' } },
        { id: 'final_reminder', type: 'ai_prompt', config: { promptId: 'final_cart_nudge' } }
      ],
      errorHandling: { retries: 3, backoff: 'exponential', fallback: 'log_error' }
    },
    {
      id: 'post_purchase_upsell',
      name: 'Upsell Post-Achat',
      trigger: { type: 'event', event: 'order_completed' },
      nodes: [
        { id: 'analyze_purchase', type: 'data_transform', config: { transform: 'extract_categories' } },
        { id: 'recommend_products', type: 'ai_prompt', config: { promptId: 'product_recommendation', context: 'purchase_history' } },
        { id: 'send_offer', type: 'action', config: { action: 'send_message', channel: 'whatsapp' } }
      ]
    },
    {
      id: 'vip_customer_welcome',
      name: 'Accueil Client VIP',
      trigger: { type: 'condition', condition: 'customer_tier == "platinum"' },
      nodes: [
        { id: 'assign_agent', type: 'action', config: { action: 'assign_to_agent', skill: 'vip_specialist' } },
        { id: 'send_personalized_greeting', type: 'ai_prompt', config: { promptId: 'vip_greeting', tone: 'exclusive' } },
        { id: 'offer_exclusive_deal', type: 'action', config: { action: 'send_private_offer' } }
      ]
    }
  ],
  templates: {
    cart_recovery_sms: 'Salut {{firstName}}! Votre panier ({{cartTotal}}€) vous attend 🛒. Code -10%: CART10. Valable 2h!',
    order_confirmation: 'Merci {{firstName}}! Commande #{{orderId}} confirmée ✅. Livraison prévue le {{deliveryDate}}.',
    low_stock_alert: '⚠️ Stock critique: {{productName}} ({{currentStock}}/{{minThreshold}})'
  }
};

// ============================================================================
// COPILOT PACK - IA Commerce
// ============================================================================

const commerceCopilot: CopilotPack = {
  prompts: [
    {
      id: 'product_recommendation',
      name: 'Recommandation Produit Intelligente',
      systemPrompt: 'Tu es un conseiller vente expert. Recommande des produits pertinents basés sur l\'historique, les préférences et le contexte actuel.',
      userTemplate: 'Client: {{customerProfile}}\nHistorique: {{purchaseHistory}}\nContexte: {{currentContext}}\nBudget: {{budgetRange}}\n\nSuggère 3 produits avec arguments de vente.',
      variables: ['customerProfile', 'purchaseHistory', 'currentContext', 'budgetRange'],
      model: 'gpt-4-turbo',
      temperature: 0.7,
      maxTokens: 500
    },
    {
      id: 'objection_handling',
      name: 'Gestion des Objections',
      systemPrompt: 'Tu es un négociateur expérimenté. Réponds aux objections clients avec empathie et arguments convaincants.',
      userTemplate: 'Objection: "{{customerObjection}}"\nProduit: {{productName}}\nAvantages clés: {{keyBenefits}}\n\nPropose une réponse persuasive.',
      model: 'gpt-4',
      temperature: 0.6
    },
    {
      id: 'final_cart_nudge',
      name: 'Relance Finale Panier',
      systemPrompt: 'Crée un message urgent mais bienveillant pour convertir un panier abandonné.',
      userTemplate: 'Panier: {{cartItems}}\nValeur: {{cartValue}}\nTemps écoulé: {{timeElapsed}}\nOffre spéciale: {{discountOffer}}\n\nRédige un message accrocheur.',
      model: 'gpt-3.5-turbo',
      temperature: 0.8
    }
  ],
  graphRAGPolicies: {
    enabled: true,
    entityTypes: ['product', 'category', 'brand', 'customer_segment', 'promotion'],
    relationships: ['bought_together', 'similar_to', 'alternative_to', 'upgrade_from'],
    confidenceThreshold: 0.8,
    fallbackStrategy: 'keyword_search'
  },
  routing: {
    rules: [
      { intent: 'product_question', model: 'gpt-4-turbo', reason: 'besoin précision technique' },
      { intent: 'simple_order_status', model: 'gpt-3.5-turbo', reason: 'réponse factuelle simple' },
      { intent: 'complaint', model: 'gpt-4', reason: 'gestion émotionnelle requise' },
      { intent: 'upsell_opportunity', model: 'gpt-4-turbo', reason: 'argumentaire complexe' }
    ],
    costOptimization: {
      enabled: true,
      budgetLimit: 0.02, // par conversation
      preferCheaperWhenConfidence: 0.9
    }
  },
  safetyFilters: [
    { filterType: 'pii', action: 'mask', fields: ['credit_card', 'password'] },
    { filterType: 'profanity', action: 'block' },
    { filterType: 'competitor_mention', action: 'redirect_to_human' },
    { filterType: 'price_manipulation', action: 'block_and_alert' }
  ],
  conversationMemory: {
    enabled: true,
    retentionDays: 90,
    summarization: true,
    sentimentTracking: true
  }
};

// ============================================================================
// CONNECTOR PACK - Intégrations Commerce
// ============================================================================

const commerceConnector: ConnectorPack = {
  connectors: [
    {
      id: 'shopify',
      name: 'Shopify',
      type: 'ecommerce_platform',
      auth: { type: 'oauth2', scopes: ['read_products', 'write_orders', 'read_customers'] },
      endpoints: {
        products: '/admin/api/2024-01/products.json',
        orders: '/admin/api/2024-01/orders.json',
        customers: '/admin/api/2024-01/customers.json'
      },
      syncConfig: { interval: 300000, bidirectional: false, conflictResolution: 'remote_wins' },
      rateLimit: { requestsPerMinute: 100, burst: 20 }
    },
    {
      id: 'stripe',
      name: 'Stripe',
      type: 'payment',
      auth: { type: 'api_key', header: 'Authorization' },
      endpoints: {
        createPaymentLink: '/v1/payment_links',
        retrieveCustomer: '/v1/customers/{id}',
        createCharge: '/v1/charges'
      },
      webhooks: ['payment_intent.succeeded', 'payment_intent.failed', 'charge.refunded'],
      pciCompliant: true
    },
    {
      id: 'woocommerce',
      name: 'WooCommerce',
      type: 'ecommerce_platform',
      auth: { type: 'oauth1', consumerKey: true, consumerSecret: true },
      endpoints: {
        products: '/wp-json/wc/v3/products',
        orders: '/wp-json/wc/v3/orders'
      }
    },
    {
      id: 'google_analytics',
      name: 'Google Analytics 4',
      type: 'analytics',
      auth: { type: 'oauth2', scopes: ['https://www.googleapis.com/auth/analytics.readonly'] },
      metrics: ['purchase_revenue', 'transactions', 'conversion_rate']
    }
  ],
  dataSync: {
    strategy: 'incremental',
    lastSyncTracking: true,
    conflictDetection: true,
    rollbackSupport: true
  }
};

// ============================================================================
// PERMISSIONS PACK - RBAC Commerce
// ============================================================================

const commercePermissions: PermissionsPack = {
  roles: [
    {
      id: 'commerce_admin',
      name: 'Administrateur E-commerce',
      permissions: ['*'],
      description: 'Accès complet à toutes les fonctionnalités'
    },
    {
      id: 'commerce_manager',
      name: 'Responsable E-commerce',
      permissions: [
        'dashboard:view_all',
        'products:edit',
        'orders:manage',
        'promotions:create',
        'customers:view',
        'reports:export',
        'agents:assign'
      ],
      description: 'Gestion opérationnelle complète'
    },
    {
      id: 'sales_agent',
      name: 'Conseiller Vente',
      permissions: [
        'dashboard:view_own',
        'conversations:handle',
        'orders:create',
        'discounts:apply_limited',
        'customers:view_assigned',
        'templates:use'
      ],
      description: 'Gestion des conversations et ventes'
    },
    {
      id: 'support_agent',
      name: 'Agent Support',
      permissions: [
        'conversations:handle',
        'orders:view',
        'returns:process',
        'customers:view_basic'
      ],
      description: 'Support client et retours'
    }
  ],
  policies: [
    {
      id: 'discount_approval_policy',
      name: 'Politique de Remises',
      rules: [
        { role: 'sales_agent', maxDiscount: 10, requiresApproval: false },
        { role: 'sales_agent', maxDiscount: 20, requiresApproval: true, approver: 'commerce_manager' },
        { role: 'commerce_manager', maxDiscount: 30, requiresApproval: false }
      ]
    },
    {
      id: 'refund_policy',
      name: 'Politique de Remboursement',
      rules: [
        { condition: 'days_since_purchase <= 30', action: 'auto_approve' },
        { condition: 'days_since_purchase <= 60 AND product_condition == "unused"', action: 'manager_approval' },
        { condition: 'days_since_purchase > 60', action: 'deny' }
      ]
    }
  ],
  menuFiltering: {
    enabled: true,
    dynamicMenus: true,
    hideBasedOnPermissions: true
  },
  mfa: {
    required: true,
    methods: ['totp', 'sms', 'email'],
    exemptRoles: []
  }
};

// ============================================================================
// THEME PLUGIN MANIFEST
// ============================================================================

export const commerceThemePlugin: ThemePlugin = {
  manifest: {
    id: 'com.whatsmaster.theme.commerce-conversationnel',
    name: 'Commerce Conversationnel',
    version: '1.0.0',
    description: 'Solution complète pour le commerce conversationnel sur WhatsApp: catalogue intelligent, upsell, relance panier, paiement par lien, FAQ enrichie GraphRAG.',
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
      requiredFeatures: ['messaging', 'payments', 'catalog']
    },
    licensing: {
      type: 'proprietary',
      model: 'per_user',
      price: { amount: 99, currency: 'EUR', period: 'monthly' },
      trialDays: 14,
      volumeDiscounts: [
        { minUsers: 10, discount: 0.1 },
        { minUsers: 50, discount: 0.2 },
        { minUsers: 100, discount: 0.3 }
      ]
    },
    compliance: {
      gdprReady: true,
      soc2Compliant: true,
      iso27001Compliant: true,
      pciDssCompliant: true,
      dataResidency: ['EU', 'US', 'UK'],
      privacyPolicyUrl: 'https://whatsmaster.io/privacy',
      lastAudit: '2024-10-01'
    },
    categories: ['E-commerce', 'Retail', 'WhatsApp Business', 'Sales Automation'],
    tags: ['commerce', 'whatsapp', 'upsell', 'cart-recovery', 'payments', 'catalog'],
    screenshots: [
      { url: '/assets/commerce/dashboard.png', caption: 'Dashboard Revenus Temps Réel' },
      { url: '/assets/commerce/conversation.png', caption: 'Interface Conversation avec Catalogue' },
      { url: '/assets/commerce/analytics.png', caption: 'Analytics Performance Produits' }
    ],
    documentationUrl: 'https://docs.whatsmaster.io/themes/commerce',
    supportUrl: 'https://support.whatsmaster.io',
    changelog: 'https://github.com/whatsmaster/themes/commerce/CHANGELOG.md'
  },
  
  branding: commerceBranding,
  dashboard: commerceDashboard,
  workflow: commerceWorkflow,
  copilot: commerceCopilot,
  connector: commerceConnector,
  permissions: commercePermissions,
  
  metadata: {
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2024-11-15T10:00:00Z',
    author: 'WhatsMaster Product Team',
    license: 'Commercial'
  },
  
  healthChecks: [
    { id: 'connector_shopify', name: 'Connexion Shopify', type: 'connector', critical: true },
    { id: 'connector_stripe', name: 'Connexion Stripe', type: 'connector', critical: true },
    { id: 'workflow_abandoned_cart', name: 'Workflow Paniers Abandonnés', type: 'workflow', critical: false },
    { id: 'copilot_recommendations', name: 'IA Recommandations', type: 'copilot', critical: false }
  ],
  
  optionalDependencies: [
    { pluginId: 'com.whatsmaster.analytics', minVersion: '1.0.0', feature: 'Advanced Analytics', fallback: { enabled: false } },
    { pluginId: 'com.whatsmaster.email', minVersion: '1.0.0', feature: 'Email Marketing', fallback: { enabled: false } }
  ]
};

export default commerceThemePlugin;
