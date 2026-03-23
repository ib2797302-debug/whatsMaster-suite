#!/bin/bash
# Script d'initialisation MongoDB - Indexes et Sharding

mongosh <<EOF

// Utilisation de la base de données
use whatsmaster

// ==================== INDEXES AVANCÉS ====================

// Index pour les requêtes par tenant + date (très fréquent)
db.users.createIndex({ tenantId: 1, createdAt: -1 })
db.contacts.createIndex({ tenantId: 1, createdAt: -1 })
db.conversations.createIndex({ tenantId: 1, updatedAt: -1 })
db.campaigns.createIndex({ tenantId: 1, createdAt: -1 })
db.messages.createIndex({ tenantId: 1, timestamp: -1 })

// Index composés pour les filtres courants
db.contacts.createIndex({ tenantId: 1, status: 1, tags: 1 })
db.campaigns.createIndex({ tenantId: 1, status: 1, scheduledAt: 1 })
db.conversations.createIndex({ tenantId: 1, status: 1, lastMessageAt: -1 })

// Index pour les recherches textuelles
db.contacts.createIndex({ 
  name: "text", 
  phoneNumber: "text", 
  email: "text" 
}, { 
  name: "contacts_search_index",
  default_language: "french"
})

db.conversations.createIndex({ 
  participantNames: "text" 
}, { 
  name: "conversations_search_index"
})

// Index pour les analytics (agrégations rapides)
db.analytics.createIndex({ tenantId: 1, date: -1, metricType: 1 })
db.auditLogs.createIndex({ tenantId: 1, action: 1, timestamp: -1 })
db.auditLogs.createIndex({ userId: 1, timestamp: -1 })

// Index TTL pour les sessions et tokens expirés
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
db.refreshTokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Index pour les webhooks
db.webhookLogs.createIndex({ tenantId: 1, receivedAt: -1 })
db.webhookLogs.createIndex({ processed: 1, receivedAt: 1 })

// ==================== VUES MATÉRIALISÉES ====================

// Vue matérialisée pour les statistiques de campagnes
db.createView("campaignStatsView", "campaigns", [
  {
    \$match: { status: { \$in: ["completed", "sending"] } }
  },
  {
    \$lookup: {
      from: "messages",
      localField: "_id",
      foreignField: "campaignId",
      as: "messages"
    }
  },
  {
    \$project: {
      _id: 1,
      name: 1,
      tenantId: 1,
      status: 1,
      totalRecipients: "\$recipientCount",
      messagesSent: { \$size: "\$messages" },
      createdAt: 1,
      completedAt: 1
    }
  }
])

// Vue pour les métriques d'engagement par jour
db.createView("dailyEngagementView", "messages", [
  {
    \$match: { type: "outbound" }
  },
  {
    \$group: {
      _id: {
        tenantId: "\$tenantId",
        date: { \$dateToString: { format: "%Y-%m-%d", date: "\$timestamp" } }
      },
      totalSent: { \$sum: 1 },
      delivered: { 
        \$sum: { \$cond: [{ \$eq: ["\$status", "delivered"] }, 1, 0] } 
      },
      read: { 
        \$sum: { \$cond: [{ \$eq: ["\$status", "read"] }, 1, 0] } 
      },
      failed: { 
        \$sum: { \$cond: [{ \$eq: ["\$status", "failed"] }, 1, 0] } 
      }
    }
  },
  {
    \$project: {
      _id: 0,
      tenantId: "\$_id.tenantId",
      date: "\$_id.date",
      totalSent: 1,
      delivered: 1,
      read: 1,
      failed: 1,
      deliveryRate: { 
        \$round: [{ \$multiply: [{ \$divide: ["\$delivered", "\$totalSent"] }, 100] }, 2] 
      },
      readRate: { 
        \$round: [{ \$multiply: [{ \$divide: ["\$read", "\$totalSent"] }, 100] }, 2] 
      }
    }
  },
  { \$sort: { date: -1 } }
])

// ==================== CONFIGURATION SHARDING ====================

// Activer le sharding (à exécuter dans un environnement shardé)
try {
  sh.enableSharding("whatsmaster")
  
  // Shard par tenantId pour isoler les données clients
  sh.shardCollection("whatsmaster.users", { tenantId: "hashed" })
  sh.shardCollection("whatsmaster.contacts", { tenantId: "hashed" })
  sh.shardCollection("whatsmaster.conversations", { tenantId: "hashed" })
  sh.shardCollection("whatsmaster.campaigns", { tenantId: "hashed" })
  sh.shardCollection("whatsmaster.messages", { tenantId: "hashed", timestamp: 1 })
  sh.shardCollection("whatsmaster.analytics", { tenantId: "hashed", date: -1 })
  
  print("Sharding activé avec succès")
} catch (e) {
  print("Sharding non disponible dans cet environnement (nécessite une config replica set)")
}

// ==================== RÔLES ET UTILISATEURS ====================

// Créer un rôle personnalisé pour l'application
db.createRole({
  role: "whatsmasterApp",
  privileges: [
    {
      resource: { db: "whatsmaster", collection: "" },
      actions: ["find", "insert", "update", "delete", "aggregate"]
    }
  ],
  roles: []
})

print("Initialisation MongoDB terminée avec succès!")

EOF
