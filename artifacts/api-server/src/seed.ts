import { db } from "@workspace/db";
import { usersTable, contactsTable, conversationsTable, messagesTable, campaignsTable } from "@workspace/db/schema";
import crypto from "node:crypto";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function seed() {
  console.log("Seeding database...");

  // Seed users
  await db.insert(usersTable).values([
    {
      name: "Admin User",
      username: "admin",
      email: "admin@whatsmaster.io",
      password: hashPassword("admin"),
      role: "admin",
      isActive: true,
    },
    {
      name: "Regular User",
      username: "user",
      email: "user@whatsmaster.io",
      password: hashPassword("user"),
      role: "user",
      isActive: true,
    },
  ]).onConflictDoNothing();

  // Seed contacts
  const contacts = await db.insert(contactsTable).values([
    { name: "Marie Dupont", phone: "+33612345678", email: "marie@example.com", tags: ["VIP", "Client"], isBlocked: false },
    { name: "Jean Martin", phone: "+33698765432", email: "jean@example.com", tags: ["Prospect"], isBlocked: false },
    { name: "Sophie Bernard", phone: "+33677889900", email: "sophie@example.com", tags: ["Client"], isBlocked: false },
    { name: "Pierre Lefebvre", phone: "+33655443322", email: "pierre@example.com", tags: ["Lead"], isBlocked: false },
    { name: "Isabelle Moreau", phone: "+33688776655", email: "isabelle@example.com", tags: ["VIP"], isBlocked: false },
    { name: "François Simon", phone: "+33611223344", email: "francois@example.com", tags: ["Client", "Newsletter"], isBlocked: false },
    { name: "Nathalie Petit", phone: "+33644332211", email: "nathalie@example.com", tags: ["Prospect"], isBlocked: false },
    { name: "Alain Dubois", phone: "+33699887766", email: "alain@example.com", tags: ["Lead"], isBlocked: false },
    { name: "Céline Thomas", phone: "+33622334455", email: "celine@example.com", tags: ["VIP", "Client"], isBlocked: false },
    { name: "Michel Robert", phone: "+33677665544", email: "michel@example.com", tags: ["Newsletter"], isBlocked: false },
  ]).onConflictDoNothing().returning();

  if (contacts.length === 0) {
    console.log("Data already seeded, skipping...");
    return;
  }

  // Seed conversations
  const conversations = await db.insert(conversationsTable).values([
    {
      contactId: contacts[0]?.id,
      contactName: "Marie Dupont",
      contactPhone: "+33612345678",
      lastMessage: "Bonjour, j'aimerais en savoir plus sur vos services.",
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 30),
      status: "open",
      unreadCount: 2,
    },
    {
      contactId: contacts[1]?.id,
      contactName: "Jean Martin",
      contactPhone: "+33698765432",
      lastMessage: "Merci pour votre réponse rapide!",
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 90),
      status: "resolved",
      unreadCount: 0,
    },
    {
      contactId: contacts[2]?.id,
      contactName: "Sophie Bernard",
      contactPhone: "+33677889900",
      lastMessage: "Quand est-ce que je peux avoir une démo?",
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 180),
      status: "pending",
      unreadCount: 1,
    },
    {
      contactId: contacts[3]?.id,
      contactName: "Pierre Lefebvre",
      contactPhone: "+33655443322",
      lastMessage: "Le prix est-il négociable pour les grandes équipes?",
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 240),
      status: "open",
      unreadCount: 3,
    },
    {
      contactId: contacts[4]?.id,
      contactName: "Isabelle Moreau",
      contactPhone: "+33688776655",
      lastMessage: "Je vais passer la commande aujourd'hui.",
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 60),
      status: "open",
      unreadCount: 0,
    },
  ]).returning();

  // Seed messages for first conversation
  if (conversations[0]) {
    await db.insert(messagesTable).values([
      {
        conversationId: conversations[0].id,
        direction: "inbound",
        body: "Bonjour, j'aimerais en savoir plus sur vos services.",
        type: "text",
        status: "read",
      },
      {
        conversationId: conversations[0].id,
        direction: "outbound",
        body: "Bonjour Marie! Bien sûr, je suis là pour vous aider. Que souhaitez-vous savoir?",
        type: "text",
        status: "read",
      },
      {
        conversationId: conversations[0].id,
        direction: "inbound",
        body: "Je voudrais savoir combien coûte l'abonnement Pro.",
        type: "text",
        status: "read",
      },
      {
        conversationId: conversations[0].id,
        direction: "outbound",
        body: "L'abonnement Pro est à 149€/mois. Il inclut des campagnes illimitées, l'automatisation IA, et le support prioritaire. Voulez-vous une démo?",
        type: "text",
        status: "delivered",
      },
      {
        conversationId: conversations[0].id,
        direction: "inbound",
        body: "Bonjour, j'aimerais en savoir plus sur vos services.",
        type: "text",
        status: "delivered",
      },
    ]);
  }

  // Seed campaigns
  await db.insert(campaignsTable).values([
    {
      name: "Promo Été 2025",
      message: "🌞 Profitez de notre offre spéciale été! -30% sur tous nos abonnements jusqu'au 31 août. Utilisez le code ETE2025.",
      status: "sent",
      recipientCount: 523,
      sentCount: 521,
      deliveredCount: 498,
      readCount: 312,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
    {
      name: "Newsletter Mensuelle - Mars",
      message: "📢 Voici les nouvelles fonctionnalités de WhatsMaster ce mois-ci: automatisation avancée, nouveau tableau de bord analytique, et intégration CRM!",
      status: "scheduled",
      recipientCount: 847,
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    },
    {
      name: "Relance Prospects Q1",
      message: "👋 Bonjour! Nous n'avons pas eu de vos nouvelles depuis un moment. Avez-vous des questions sur WhatsMaster? Notre équipe est disponible pour une démo gratuite.",
      status: "draft",
      recipientCount: 0,
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
  ]).onConflictDoNothing();

  console.log("Seeding complete!");
}

seed().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
