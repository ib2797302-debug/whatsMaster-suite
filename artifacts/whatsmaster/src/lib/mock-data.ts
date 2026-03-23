import { 
  DashboardStats, 
  ConversationsResponse, 
  ContactsResponse, 
  CampaignsResponse, 
  UsersResponse,
  ConversationDetail,
  MessageDirection,
  MessageType,
  MessageStatus,
  ConversationStatus,
  CampaignStatus
} from "@workspace/api-client-react";

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalConversations: 1248,
  openConversations: 89,
  resolvedConversations: 1159,
  totalContacts: 3450,
  totalCampaigns: 24,
  messagesThisMonth: 45200,
  responseRate: 94.5,
  avgResponseTime: 4.2, // minutes
  recentActivity: [
    { id: "1", type: "message", description: "Nouveau message de Jean Dupont", time: new Date().toISOString(), contact: "Jean Dupont" },
    { id: "2", type: "campaign", description: "Campagne 'Promo Hiver' terminée", time: new Date(Date.now() - 3600000).toISOString() },
    { id: "3", type: "contact", description: "Nouveau contact ajouté", time: new Date(Date.now() - 7200000).toISOString(), contact: "Marie Martin" },
  ],
  conversationsByDay: [
    { date: "Lun", count: 120 },
    { date: "Mar", count: 180 },
    { date: "Mer", count: 150 },
    { date: "Jeu", count: 210 },
    { date: "Ven", count: 190 },
    { date: "Sam", count: 80 },
    { date: "Dim", count: 60 },
  ]
};

export const MOCK_CONVERSATIONS: ConversationsResponse = {
  total: 89,
  page: 1,
  limit: 20,
  conversations: [
    { id: "c1", contactName: "Sophie Bernard", contactPhone: "+33612345678", lastMessage: "Bonjour, j'aimerais des infos sur le produit X.", lastMessageAt: new Date().toISOString(), status: "open", unreadCount: 2 },
    { id: "c2", contactName: "Luc Dubois", contactPhone: "+33698765432", lastMessage: "Merci beaucoup pour votre aide !", lastMessageAt: new Date(Date.now() - 3600000).toISOString(), status: "resolved", unreadCount: 0 },
    { id: "c3", contactName: "Entreprise ABC", contactPhone: "+33123456789", lastMessage: "Avez-vous reçu mon paiement ?", lastMessageAt: new Date(Date.now() - 7200000).toISOString(), status: "pending", unreadCount: 1 },
    { id: "c4", contactName: "Julie Rousseau", contactPhone: "+33655443322", lastMessage: "Je passerai demain à 14h.", lastMessageAt: new Date(Date.now() - 86400000).toISOString(), status: "open", unreadCount: 0 },
  ]
};

export const MOCK_CONVERSATION_DETAIL: ConversationDetail = {
  conversation: MOCK_CONVERSATIONS.conversations[0],
  messages: [
    { id: "m1", conversationId: "c1", direction: "inbound", body: "Bonjour, êtes-vous ouverts aujourd'hui ?", type: "text", status: "read", createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: "m2", conversationId: "c1", direction: "outbound", body: "Bonjour ! Oui, nous sommes ouverts jusqu'à 19h.", type: "text", status: "read", createdAt: new Date(Date.now() - 86300000).toISOString() },
    { id: "m3", conversationId: "c1", direction: "inbound", body: "Super, j'aimerais des infos sur le produit X.", type: "text", status: "delivered", createdAt: new Date().toISOString() },
  ]
};

export const MOCK_CONTACTS: ContactsResponse = {
  total: 3450,
  page: 1,
  contacts: [
    { id: "cnt1", name: "Sophie Bernard", phone: "+33612345678", email: "sophie@example.com", tags: ["VIP", "Client"], isBlocked: false, createdAt: new Date(Date.now() - 30 * 86400000).toISOString() },
    { id: "cnt2", name: "Luc Dubois", phone: "+33698765432", email: "luc@example.com", tags: ["Prospect"], isBlocked: false, createdAt: new Date(Date.now() - 15 * 86400000).toISOString() },
    { id: "cnt3", name: "Entreprise ABC", phone: "+33123456789", tags: ["B2B"], isBlocked: false, createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: "cnt4", name: "Spammer", phone: "+33600000000", tags: [], isBlocked: true, createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  ]
};

export const MOCK_CAMPAIGNS: CampaignsResponse = {
  total: 24,
  campaigns: [
    { id: "camp1", name: "Promo Black Friday", message: "Profitez de -30% avec le code BF30 !", status: "sent", recipientCount: 1500, sentCount: 1490, deliveredCount: 1450, readCount: 1200, createdAt: new Date(Date.now() - 30 * 86400000).toISOString() },
    { id: "camp2", name: "Vœux Nouvelle Année", message: "Toute l'équipe vous souhaite une excellente année !", status: "scheduled", recipientCount: 3450, sentCount: 0, deliveredCount: 0, readCount: 0, scheduledAt: new Date(Date.now() + 5 * 86400000).toISOString(), createdAt: new Date().toISOString() },
    { id: "camp3", name: "Rappel Panier Abandonné", message: "Vous avez oublié des articles !", status: "draft", recipientCount: 45, sentCount: 0, deliveredCount: 0, readCount: 0, createdAt: new Date().toISOString() },
  ]
};

export const MOCK_USERS: UsersResponse = {
  total: 3,
  users: [
    { id: "u1", name: "Admin Principal", username: "admin", role: "admin", isActive: true, createdAt: new Date(Date.now() - 365 * 86400000).toISOString() },
    { id: "u2", name: "Agent Support 1", username: "user", role: "user", isActive: true, createdAt: new Date(Date.now() - 100 * 86400000).toISOString() },
    { id: "u3", name: "Agent Commercial", username: "commercial", role: "user", isActive: false, createdAt: new Date(Date.now() - 50 * 86400000).toISOString() },
  ]
};
