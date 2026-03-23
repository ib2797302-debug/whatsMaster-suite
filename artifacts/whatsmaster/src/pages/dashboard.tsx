import { useAuth } from "@/hooks/use-auth";
import { useGetDashboardStats } from "@workspace/api-client-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MOCK_DASHBOARD_STATS } from "@/lib/mock-data";
import { MessageSquare, Users, Megaphone, Clock, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Use mock data fallback if API fails
  const { data: realStats, isError, isLoading } = useGetDashboardStats();
  const stats = isError || !realStats ? MOCK_DASHBOARD_STATS : realStats;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  const kpis = [
    { name: "Conversations Ouvertes", value: stats.openConversations, icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Total Contacts", value: stats.totalContacts, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "Campagnes Actives", value: stats.totalCampaigns, icon: Megaphone, color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Temps Réponse Moyen", value: `${stats.avgResponseTime} min`, icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Bonjour, {user?.name.split(' ')[0]} 👋</h1>
          <p className="text-muted-foreground mt-2">Voici un aperçu de l'activité WhatsApp de votre entreprise aujourd'hui.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl flex flex-col relative overflow-hidden group">
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${kpi.bg.replace('/10', '')}`} />
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${kpi.bg}`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                  +12% <ArrowUpRight className="w-3 h-3 ml-1" />
                </span>
              </div>
              <div className="text-3xl font-display font-bold mb-1">{kpi.value}</div>
              <div className="text-sm text-muted-foreground font-medium">{kpi.name}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 glass-card rounded-3xl p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Volume de conversations</h2>
              <select className="bg-white/5 border border-white/10 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.conversationsByDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="glass-card rounded-3xl p-6 flex flex-col">
            <h2 className="text-xl font-bold mb-6">Activité Récente</h2>
            <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar pr-2">
              {stats.recentActivity.map((activity, i) => (
                <div key={activity.id} className="flex gap-4 relative">
                  {i !== stats.recentActivity.length - 1 && (
                    <div className="absolute left-5 top-10 bottom-[-24px] w-[2px] bg-white/5" />
                  )}
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 z-10">
                    {activity.type === 'message' ? <MessageSquare className="w-4 h-4 text-blue-400" /> : 
                     activity.type === 'campaign' ? <Megaphone className="w-4 h-4 text-purple-400" /> :
                     <Users className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/90">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">
                      {format(new Date(activity.time), 'HH:mm - eeee d', { locale: fr })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
