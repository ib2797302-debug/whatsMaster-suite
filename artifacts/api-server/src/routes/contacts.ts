import { Router } from "express";
import { db } from "@workspace/db";
import { contactsTable } from "@workspace/db/schema";
import { eq, ilike } from "drizzle-orm";
import { requireAuth } from "./middleware";
import { z } from "zod";

const router = Router();

const createContactSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

router.get("/", requireAuth, async (req, res) => {
  const { search, page = "1" } = req.query as Record<string, string>;
  const pageNum = parseInt(page);
  const offset = (pageNum - 1) * 20;

  const contacts = await db.select().from(contactsTable).limit(20).offset(offset);

  res.json({
    contacts: contacts.map((c) => ({
      id: String(c.id),
      name: c.name,
      phone: c.phone,
      email: c.email,
      tags: c.tags ?? [],
      isBlocked: c.isBlocked,
      createdAt: c.createdAt.toISOString(),
    })),
    total: contacts.length,
    page: pageNum,
  });
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = createContactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [contact] = await db.insert(contactsTable).values({
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    tags: parsed.data.tags,
  }).returning();

  if (!contact) {
    res.status(500).json({ error: "Failed to create contact" });
    return;
  }

  res.status(201).json({
    id: String(contact.id),
    name: contact.name,
    phone: contact.phone,
    email: contact.email,
    tags: contact.tags ?? [],
    isBlocked: contact.isBlocked,
    createdAt: contact.createdAt.toISOString(),
  });
});

router.put("/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const parsed = createContactSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [contact] = await db.update(contactsTable).set(parsed.data).where(eq(contactsTable.id, id)).returning();

  if (!contact) {
    res.status(404).json({ error: "Contact not found" });
    return;
  }

  res.json({
    id: String(contact.id),
    name: contact.name,
    phone: contact.phone,
    email: contact.email,
    tags: contact.tags ?? [],
    isBlocked: contact.isBlocked,
    createdAt: contact.createdAt.toISOString(),
  });
});

router.delete("/:id", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  await db.delete(contactsTable).where(eq(contactsTable.id, id));
  res.json({ message: "Contact deleted" });
});

export default router;
