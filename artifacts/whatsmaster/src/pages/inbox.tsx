import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useGetConversations, useGetConversation, useSendMessage, Conversation } from "@workspace/api-client-react";
import { MOCK_CONVERSATIONS, MOCK_CONVERSATION_DETAIL } from "@/lib/mock-data";
import { Search, Send, Filter, CheckCircle2, Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function InboxPage() {
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "resolved">("all");
  const [messageText, setMessageText] = useState("");

  const { data: convData, isError: convError } = useGetConversations();
  const conversationsList = convError || !convData ? MOCK_CONVERSATIONS.conversations : convData.conversations;

  const filteredConversations = conversationsList.filter(c => filter === "all" ? true : c.status === filter);

  const { data: detailData, isError: detailError } = useGetConversation(selectedConvId || "");
  const conversationDetail = selectedConvId 
    ? (detailError || !detailData ? { ...MOCK_CONVERSATION_DETAIL, conversation: conversationsList.find(c => c.id === selectedConvId) || MOCK_CONVERSATION_DETAIL.conversation } : detailData)
    : null;

  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConvId) return;
    
    // In a real app with working API:
    // sendMessage({ id: selectedConvId, data: { body: messageText } }, { onSuccess: () => { setMessageText(""); invalidateQueries... } });
    
    // For visual demo, just clear input
    setMessageText("");
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex gap-6 overflow-hidden">
        
        {/* Left Panel: Conversation List */}
        <div className="w-1/3 min-w-[320px] max-w-[400px] glass-card rounded-3xl flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-white/5 space-y-4">
            <h2 className="text-xl font-bold px-2">Boîte de réception</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Rechercher une conversation..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <div className="flex gap-2 px-1">
              <button onClick={() => setFilter("all")} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", filter === "all" ? "bg-white/10 text-white" : "text-muted-foreground hover:bg-white/5")}>Tout</button>
              <button onClick={() => setFilter("open")} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", filter === "open" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-white/5")}>Ouverts</button>
              <button onClick={() => setFilter("resolved")} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", filter === "resolved" ? "bg-emerald-500/20 text-emerald-400" : "text-muted-foreground hover:bg-white/5")}>Résolus</button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {filteredConversations.map(conv => (
              <div 
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={cn(
                  "p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors flex gap-4 relative",
                  selectedConvId === conv.id && "bg-white/5 border-l-2 border-l-primary"
                )}
              >
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-bold shrink-0">
                  {conv.contactName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-sm truncate">{conv.contactName}</h3>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                      {conv.lastMessageAt ? format(new Date(conv.lastMessageAt), 'HH:mm') : ''}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="absolute right-4 bottom-4 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(37,211,102,0.5)]">
                    {conv.unreadCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Chat Area */}
        <div className="flex-1 glass-card rounded-3xl flex flex-col overflow-hidden relative">
          {conversationDetail ? (
            <>
              {/* Chat Header */}
              <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-white/[0.01]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold">
                    {conversationDetail.conversation.contactName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold">{conversationDetail.conversation.contactName}</h3>
                    <p className="text-xs text-muted-foreground">{conversationDetail.conversation.contactPhone}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {conversationDetail.conversation.status === "open" ? (
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-colors">
                      <CheckCircle2 className="w-4 h-4" /> Marquer Résolu
                    </button>
                  ) : (
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold transition-colors">
                      <Clock className="w-4 h-4" /> Rouvrir
                    </button>
                  )}
                  <button className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground transition-colors"><Info className="w-5 h-5"/></button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-black/20">
                <div className="text-center">
                  <span className="text-xs font-medium bg-white/5 px-3 py-1 rounded-full text-muted-foreground">Aujourd'hui</span>
                </div>
                {conversationDetail.messages.map((msg) => {
                  const isOutbound = msg.direction === "outbound";
                  return (
                    <div key={msg.id} className={cn("flex flex-col max-w-[75%]", isOutbound ? "ml-auto items-end" : "mr-auto items-start")}>
                      <div className={cn(
                        "p-3 rounded-2xl text-sm shadow-sm",
                        isOutbound 
                          ? "bg-primary text-primary-foreground rounded-br-sm" 
                          : "bg-white/10 text-white rounded-bl-sm border border-white/5"
                      )}>
                        {msg.body}
                      </div>
                      <div className="flex items-center gap-1 mt-1 px-1">
                        <span className="text-[10px] text-muted-foreground">{format(new Date(msg.createdAt), 'HH:mm')}</span>
                        {isOutbound && (
                          <CheckCircle2 className={cn("w-3 h-3", msg.status === 'read' ? "text-blue-400" : "text-muted-foreground")} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                <form onSubmit={handleSend} className="flex gap-2">
                  <input 
                    type="text" 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Écrivez votre message..." 
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!messageText.trim() || isSending}
                    className="w-12 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(37,211,102,0.3)] disabled:opacity-50 transition-all"
                  >
                    <Send className="w-5 h-5 ml-1" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <MessageSquare className="w-10 h-10 opacity-50" />
              </div>
              <p>Sélectionnez une conversation pour commencer</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
