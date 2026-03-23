import { Router } from "express";
import { db } from "@workspace/db";
import { campaignsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "./middleware";
import { z } from "zod";

const router = Router();

const createCampaignSchema = z.object({
  name: z.string().min(1),
  message: z.string().min(1),
  contactIds: z.array(z.string()),
  scheduledAt: z.string().optional(),
});

router.get("/", requireAuth, async (req, res) => {
  const campaigns = await db.select().from(campaignsTable);

  res.json({
    campaigns: campaigns.map((c) => ({
      id: String(c.id),
      name: c.name,
      message: c.message,
      status: c.status,
      recipientCount: c.recipientCount,
      sentCount: c.sentCount,
      deliveredCount: c.deliveredCount,
      readCount: c.readCount,
      scheduledAt: c.scheduledAt?.toISOString(),
      createdAt: c.createdAt.toISOString(),
    })),
    total: campaigns.length,
  });
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = createCampaignSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [campaign] = await db.insert(campaignsTable).values({
    name: parsed.data.name,
    message: parsed.data.message,
    recipientCount: parsed.data.contactIds.length,
    status: parsed.data.scheduledAt ? "scheduled" : "draft",
    scheduledAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : undefined,
  }).returning();

  if (!campaign) {
    res.status(500).json({ error: "Failed to create campaign" });
    return;
  }

  res.status(201).json({
    id: String(campaign.id),
    name: campaign.name,
    message: campaign.message,
    status: campaign.status,
    recipientCount: campaign.recipientCount,
    sentCount: campaign.sentCount,
    deliveredCount: campaign.deliveredCount,
    readCount: campaign.readCount,
    scheduledAt: campaign.scheduledAt?.toISOString(),
    createdAt: campaign.createdAt.toISOString(),
  });
});

export default router;
