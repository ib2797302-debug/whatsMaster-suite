import { Router } from "express";
import { db } from "@workspace/db";
import { conversationsTable, messagesTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "./middleware";
import { z } from "zod";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const { status, page = "1", limit = "20" } = req.query as Record<string, string>;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  let query = db.select().from(conversationsTable).orderBy(desc(conversationsTable.lastMessageAt));

  const conversations = await query.limit(limitNum).offset(offset);
  const [total] = await db.select({ count: conversationsTable.id }).from(conversationsTable);

  res.json({
    conversations: conversations.map((c) => ({
      id: String(c.id),
      contactName: c.contactName,
      contactPhone: c.contactPhone,
      lastMessage: c.lastMessage,
      lastMessageAt: c.lastMessageAt?.toISOString(),
      status: c.status,
      unreadCount: c.unreadCount,
      assignedTo: c.assignedTo,
    })),
    total: conversations.length,
    page: pageNum,
    limit: limitNum,
  });
});

router.get("/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const [conv] = await db.select().from(conversationsTable).where(eq(conversationsTable.id, id)).limit(1);

  if (!conv) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  const messages = await db.select().from(messagesTable).where(eq(messagesTable.conversationId, id)).orderBy(messagesTable.createdAt);

  res.json({
    conversation: {
      id: String(conv.id),
      contactName: conv.contactName,
      contactPhone: conv.contactPhone,
      lastMessage: conv.lastMessage,
      lastMessageAt: conv.lastMessageAt?.toISOString(),
      status: conv.status,
      unreadCount: conv.unreadCount,
      assignedTo: conv.assignedTo,
    },
    messages: messages.map((m) => ({
      id: String(m.id),
      conversationId: String(m.conversationId),
      direction: m.direction,
      body: m.body,
      type: m.type,
      status: m.status,
      createdAt: m.createdAt.toISOString(),
    })),
  });
});

router.post("/:id/messages", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const schema = z.object({ body: z.string().min(1), type: z.enum(["text", "template"]).optional().default("text") });
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [msg] = await db.insert(messagesTable).values({
    conversationId: id,
    direction: "outbound",
    body: parsed.data.body,
    type: "text",
    status: "sent",
  }).returning();

  await db.update(conversationsTable).set({
    lastMessage: parsed.data.body,
    lastMessageAt: new Date(),
  }).where(eq(conversationsTable.id, id));

  if (!msg) {
    res.status(500).json({ error: "Failed to create message" });
    return;
  }

  res.status(201).json({
    id: String(msg.id),
    conversationId: String(msg.conversationId),
    direction: msg.direction,
    body: msg.body,
    type: msg.type,
    status: msg.status,
    createdAt: msg.createdAt.toISOString(),
  });
});

export default router;
