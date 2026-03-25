/**
 * THEME-PLUGIN: Commerce Conversationnel
 * PRIORITÉ 2 : WhatsApp Commerce, Retail, E-commerce
 * 
 * Architecture Autonome : Catalogue intelligent, Upsell, Paiement, GraphRAG Produit.
 */

import type { ThemePluginManifest, BrandingPack, DashboardPack, WorkflowPack, CopilotPack, ConnectorPack, PermissionPack } from '../../types/theme-plugin';

// --- 1. MANIFESTE & LICENSING ---
export const manifest: ThemePluginManifest = {
  id: 'com.whatsmaster.theme.commerce-conversational',
  name: 'Commerce Conversationnel',
  version: '1.0.0',
  description: 'Plateforme de vente conversationnelle avec catalogue intelligent, upsell automatique et paiement intégré.',
  vendor: {
    name: 'WhatsMaster Labs',
    certification: 'verified_enterprise',
    contact: 'enterprise@whatsmaster.io'
  },
  licensing: {
    type: 'proprietary',
    model: 'revenue_share',
    price: { amount: 0, currency: 'EUR', period: 'monthly', transactionFee: 0.015 }, // 1.5% sur ventes
    trialDays: 30
  },
  compliance: {
    gdprReady: true,
    pciDssCompliant: true, // Obligatoire pour paiement
    soc2Compliant: true,
    dataResidency: ['EU', 'US']
  },
  compatibility: {
    minPlatformVersion: '2.5.0',
    channels: ['whatsapp', 'instagram', 'facebook_messenger', 'telegram']
  }
};

// --- 2. BRANDING PACK (UI/UX) ---
export const branding: BrandingPack = {
  theme: {
    light: {
      primary: '#10B981', // Émeraude Commerce
      secondary: '#F59E0B', // Ambre pour CTA
      accent: '#EF4444', // Promo/Urgence
      background: '#FAFAF9',
      surface: '#FFFFFF',
      text: '#1C1917'
    },
    dark: {
      primary: '#34D399',
      secondary: '#FBBF24',
      accent: '#F87171',
      background: '#1C1917',
      surface: '#292524',
      text: '#FAFAF9'
    }
  },
  typography: {
    fontFamily: '"Poppins", "Inter", sans-serif', // Plus moderne/commerce
    scale: 'mobile-first'
  },
  toneOfVoice: {
    style: 'friendly_sales',
    guidelines: [
      'Être enthousiaste mais pas intrusif',
      'Mettre en avant les bénéfices client plutôt que features',
      'Utiliser l\'urgence éthique (stock limité, promo finissante)',
      'Personnaliser avec le prénom et historique d\'achat'
    ],
    forbiddenPhrases: ['Achetez maintenant', 'Vous devez'],
    preferredPhrases: ['Je pense que vous allez adorer...', 'Voici une offre spéciale pour vous', 'Souhaitez-vous compléter votre commande ?']
  },
  iconSet: 'heroicons-solid', // Plus visuel
  logoUrl: '/assets/themes/commerce-conversational/logo.svg'
};

// --- 3. DASHBOARD PACK (KPIs & Vues) ---
export const dashboard: DashboardPack = {
  roles: [
    {
      roleId: 'sales_agent',
      views: [
        {
          id: 'active_conversations',
          title: 'Conversations Actives',
          widgets: [
            { type: 'cart_recovery_list', filter: 'abandoned_24h' },
            { type: 'hot_leads', sortBy: 'intent_score_desc' }
          ]
        }
      ]
    },
    {
      roleId: 'commerce_manager',
      views: [
        {
          id: 'sales_performance',
          title: 'Performance Ventes',
          widgets: [
            { type: 'kpi_card', metric: 'conversion_rate', target: 0.25 },
            { type: 'kpi_card', metric: 'average_order_value', target: 85 },
            { type: 'kpi_card', metric: 'cart_recovery_rate', target: 0.15 },
            { type: 'chart_bar', metric: 'revenue_by_channel', range: '7d' },
            { type: 'funnel', metric: 'purchase_funnel', stages: ['view', 'add_cart', 'checkout', 'paid'] },
            { type: 'product_heatmap', metric: 'most_viewed_products', dataSource: 'catalog' }
          ]
        }
      ]
    }
  ],
  alerts: [
    { id: 'high_value_cart', condition: 'cart_total > 500', channel: 'whatsapp_agent' },
    { id: 'vip_abandon', condition: 'customer_tier == "gold" && cart_abandoned', channel: 'sms' }
  ]
};

// --- 4. WORKFLOW PACK (Automatisations) ---
export const workflows: WorkflowPack = {
  automations: [
    {
      id: 'abandoned_cart_sequence',
      name: 'Relance Panier Abandonné',
      trigger: { type: 'timer', condition: 'cart_abandoned_duration > 3600' },
      steps: [
        { type: 'check_inventory', products: 'cart_items' },
        { type: 'generate_offer', discount: 0.05, maxDiscount: 20 }, // 5% max 20€
        { type: 'send_message', template: 'cart_recovery_with_offer' },
        { type: 'wait', duration: 86400 },
        { type: 'send_message', template: 'final_reminder', condition: 'cart_still_abandoned' }
      ]
    },
    {
      id: 'intelligent_upsell',
      name: 'Upsell Intelligent GraphRAG',
      trigger: { type: 'message_received', conditions: ['product_interest_detected'] },
      steps: [
        { type: 'graph_rag_lookup', entityTypes: ['product', 'compatibility', 'frequently_bought_together'] },
        { type: 'recommend_products', limit: 3, strategy: 'complementary' },
        { type: 'send_carousel', template: 'product_recommendations' }
      ]
    },
    {
      id: 'payment_link_generator',
      name: 'Génération Lien de Paiement',
      trigger: { type: 'intent_detected', intent: 'want_to_buy' },
      steps: [
        { type: 'confirm_cart', requireExplicitYes: true },
        { type: 'create_payment_link', provider: 'stripe', expiry: 3600 },
        { type: 'send_message', template: 'payment_link_secure' },
        { type: 'watch_payment_status', onSuccess: 'send_receipt', onFailure: 'send_retry_offer' }
      ]
    },
    {
      id: 'post_purchase_followup',
      name: 'Suivi Post-Achat',
      trigger: { type: 'event', event: 'payment_confirmed' },
      steps: [
        { type: 'send_receipt', includeTracking: true },
        { type: 'wait', duration: 259200 }, // 3 jours
        { type: 'send_survey', type: 'delivery_satisfaction' },
        { type: 'wait', duration: 604800 }, // 7 jours après livraison estimée
        { type: 'request_review', platform: 'google_my_business' }
      ]
    }
  ]
};

// --- 5. COPILOT PACK (IA & GraphRAG) ---
export const copilot: CopilotPack = {
  agents: [
    {
      id: 'shopping_assistant',
      role: 'Assistant Shopping Personnel',
      capabilities: ['product_search', 'size_recommendation', 'style_advice', 'comparison'],
      autonomyLevel: 'medium', // Propose, humain valide pour >100€
      prompts: {
        system: `Tu es un conseiller de vente expert dans ${manifest.name}.
        Ta mission est d'aider le client à trouver le produit parfait en posant des questions pertinentes.
        Utilise GraphRAG pour connaître les compatibilités et les avis produits.
        Propose des accessoires complémentaires uniquement si pertinents.
        Ton : Chaleureux, Expert, Persuasif mais éthique.`
      }
    },
    {
      id: 'negotiation_bot',
      role: 'Négociateur Automatique',
      capabilities: ['discount_approval', 'bundle_creation', 'loyalty_application'],
      autonomyLevel: 'low', // Limites strictes
      constraints: {
        maxDiscountPercent: 0.15,
        requiresHumanAbove: 1000
      },
      prompts: {
        system: `Tu peux négocier dans la limite de 15% de réduction ou 50€.
        Au-delà, transfère à un humain. Mets en avant la valeur plutôt que le prix.`
      }
    }
  ],
  graphRAG: {
    enabled: true,
    entitySchema: {
      Product: ['id', 'name', 'price', 'stock', 'attributes', 'reviews_avg', 'compatibilities'],
      Customer: ['id', 'preferences', 'size_profile', 'purchase_history', 'wishlist'],
      Promotion: ['id', 'rules', 'stackable', 'target_segments']
    },
    retrievalStrategy: 'vector_similarity_with_rules',
    freshnessPolicy: 'real_time_inventory'
  },
  safety: {
    piiMasking: true,
    fraudDetection: true, // Détection abus codes promo
    priceManipulationPrevention: true
  }
};

// --- 6. CONNECTOR PACK ---
export const connectors: ConnectorPack = {
  integrations: [
    {
      id: 'shopify_store',
      name: 'Shopify',
      type: 'ecommerce_platform',
      auth: 'oauth2',
      syncMode: 'bidirectional',
      mappings: {
        product: 'Product',
        order: 'Order',
        customer: 'Customer',
        inventory: 'InventoryLevel'
      }
    },
    {
      id: 'woocommerce_store',
      name: 'WooCommerce',
      type: 'ecommerce_platform',
      auth: 'api_key',
      syncMode: 'bidirectional'
    },
    {
      id: 'stripe_payments',
      name: 'Stripe',
      type: 'payment_gateway',
      auth: 'secret_key',
      features: ['payment_links', 'checkout_sessions', 'refunds', 'subscriptions']
    },
    {
      id: 'paypal_payments',
      name: 'PayPal',
      type: 'payment_gateway',
      auth: 'oauth2',
      features: ['checkout', 'refunds']
    },
    {
      id: 'shipping_fedex',
      name: 'FedEx',
      type: 'logistics',
      auth: 'api_key',
      features: ['rate_calculation', 'label_generation', 'tracking']
    }
  ]
};

// --- 7. PERMISSIONS PACK ---
export const permissions: PermissionPack = {
  roles: [
    {
      id: 'sales_agent',
      name: 'Conseiller de Vente',
      permissions: ['conversation.read.assigned', 'order.create', 'discount.apply.limited', 'customer.read.basic'],
      restrictions: ['refund.approve', 'price.override', 'product.delete']
    },
    {
      id: 'store_manager',
      name: 'Manager Boutique',
      permissions: ['order.manage.all', 'discount.approve', 'report.view.sales', 'inventory.adjust'],
      restrictions: ['payout.view', 'api_keys.manage']
    },
    {
      id: 'commerce_admin',
      name: 'Administrateur Commerce',
      permissions: ['*', 'payment.configure', 'tax.manage', 'shipping.configure'],
      restrictions: []
    }
  ],
  menuFilter: {
    'sales_agent': ['conversations', 'catalog', 'orders', 'customers'],
    'store_manager': ['conversations', 'catalog', 'orders', 'reports', 'promotions'],
    'commerce_admin': ['*', 'settings', 'integrations', 'finance']
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
