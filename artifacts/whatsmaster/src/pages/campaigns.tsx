import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useGetCampaigns } from "@workspace/api-client-react";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { Plus, Megaphone, Clock, CheckCircle2, Play, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function CampaignsPage() {
  const { data, isError } = useGetCampaigns();
  const campaignsData = isError || !data ? MOCK_CAMPAIGNS : data;
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'sent': return { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Envoyée' };
      case 'scheduled': return { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Planifiée' };
      case 'sending': return { icon: Play, color: 'text-primary', bg: 'bg-primary/10 border-primary/20', label: 'En cours' };
      case 'failed': return { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/20', label: 'Échouée' };
      default: return { icon: CheckCircle2, color: 'text-muted-foreground', bg: 'bg-white/5 border-white/10', label: 'Brouillon' };
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Campagnes Marketing</h1>
            <p className="text-muted-foreground text-sm mt-1">Créez et suivez vos envois de masse sur WhatsApp.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-[0_0_15px_rgba(37,211,102,0.3)] hover:shadow-[0_0_25px_rgba(37,211,102,0.5)] transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Nouvelle Campagne
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {campaignsData.campaigns.map((camp) => {
            const status = getStatusConfig(camp.status);
            const deliveryRate = camp.recipientCount > 0 ? Math.round((camp.deliveredCount / camp.recipientCount) * 100) : 0;
            const readRate = camp.recipientCount > 0 ? Math.round((camp.readCount / camp.recipientCount) * 100) : 0;

            return (
              <div key={camp.id} className="glass-card p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-900/40 flex items-center justify-center shrink-0 border border-primary/20">
                  <Megaphone className="w-6 h-6 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold truncate">{camp.name}</h3>
                    <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${status.bg} ${status.color}`}>
                      <status.icon className="w-3 h-3" /> {status.label}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mb-2">{camp.message}</p>
                  <div className="text-xs text-white/40">
                    {camp.status === 'scheduled' ? 'Prévue pour le ' : 'Créée le '}
                    {format(new Date(camp.scheduledAt || camp.createdAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                  </div>
                </div>

                <div className="w-full md:w-auto flex flex-row md:flex-col gap-6 md:gap-2 shrink-0 md:min-w-[200px] border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                  <div className="flex-1 md:w-full">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Destinataires</span>
                      <span className="font-mono font-bold">{camp.recipientCount}</span>
                    </div>
                    {camp.status === 'sent' && (
                      <>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Ouverture</span>
                          <span className="font-mono font-bold text-emerald-400">{readRate}%</span>
                        </div>
                        <div className="w-full bg-black/50 rounded-full h-1.5 mt-2 overflow-hidden">
                          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${readRate}%` }}></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-2xl rounded-3xl p-8 shadow-2xl relative animate-in slide-in-from-bottom-8 duration-300">
            <h2 className="text-2xl font-bold mb-6">Créer une campagne</h2>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-white/80 block mb-2">Nom de la campagne</label>
                <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all" placeholder="Ex: Promo Noël 2025" />
              </div>
              <div>
                <label className="text-sm font-medium text-white/80 block mb-2">Message (Template WhatsApp)</label>
                <textarea rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all resize-none" placeholder="Bonjour {{name}}, profitez de notre offre..."></textarea>
                <p className="text-xs text-muted-foreground mt-2">Utilisez les templates pré-approuvés par Meta pour les envois massifs initiaux.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white/80 block mb-2">Liste de contacts</label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all appearance-none text-white">
                    <option>Tous les clients (1450)</option>
                    <option>Prospects VIP (320)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-white/80 block mb-2">Date d'envoi</label>
                  <input type="datetime-local" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all text-white [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" />
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 flex gap-3 justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">Annuler</button>
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(37,211,102,0.3)] transition-all">Planifier la campagne</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
