import { Router } from "express";
import { db } from "@workspace/db";
import { conversationsTable, contactsTable, campaignsTable, messagesTable } from "@workspace/db/schema";
import { count, eq } from "drizzle-orm";
import { requireAuth } from "./middleware";

const router = Router();

router.get("/stats", requireAuth, async (req, res) => {
  const [totalConv] = await db.select({ count: count() }).from(conversationsTable);
  const [openConv] = await db.select({ count: count() }).from(conversationsTable).where(eq(conversationsTable.status, "open"));
  const [resolvedConv] = await db.select({ count: count() }).from(conversationsTable).where(eq(conversationsTable.status, "resolved"));
  const [totalContacts] = await db.select({ count: count() }).from(contactsTable);
  const [totalCampaigns] = await db.select({ count: count() }).from(campaignsTable);
  const [totalMessages] = await db.select({ count: count() }).from(messagesTable);

  const conversations = await db.select({
    id: conversationsTable.id,
    contactName: conversationsTable.contactName,
    lastMessage: conversationsTable.lastMessage,
    lastMessageAt: conversationsTable.lastMessageAt,
    status: conversationsTable.status,
  }).from(conversationsTable).orderBy(conversationsTable.lastMessageAt).limit(5);

  const recentActivity = conversations.map((c) => ({
    id: String(c.id),
    type: "message",
    description: c.lastMessage ?? "Nouvelle conversation",
    time: c.lastMessageAt?.toISOString() ?? new Date().toISOString(),
    contact: c.contactName,
  }));

  const conversationsByDay = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 40) + 10,
    };
  });

  res.json({
    totalConversations: totalConv?.count ?? 0,
    openConversations: openConv?.count ?? 0,
    resolvedConversations: resolvedConv?.count ?? 0,
    totalContacts: totalContacts?.count ?? 0,
    totalCampaigns: totalCampaigns?.count ?? 0,
    messagesThisMonth: totalMessages?.count ?? 0,
    responseRate: 94.2,
    avgResponseTime: 3.5,
    recentActivity,
    conversationsByDay,
  });
});

export default router;
