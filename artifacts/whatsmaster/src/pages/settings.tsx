import DashboardLayout from "@/components/layout/DashboardLayout";
import { MessageCircle, Webhook, Building, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold">Paramètres de l'espace</h1>
          <p className="text-muted-foreground text-sm mt-1">Configurez l'intégration WhatsApp Business et vos préférences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Settings Nav */}
          <div className="space-y-1">
            {[
              { id: 'whatsapp', name: 'WhatsApp API', icon: MessageCircle },
              { id: 'company', name: 'Entreprise', icon: Building },
              { id: 'notifications', name: 'Notifications', icon: Bell },
              { id: 'webhooks', name: 'Webhooks', icon: Webhook },
            ].map((tab, i) => (
              <button key={tab.id} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${i === 0 ? 'bg-white/10 text-white' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}>
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="md:col-span-3 space-y-6">
            <div className="glass-card p-8 rounded-3xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MessageCircle className="text-primary w-6 h-6" /> Configuration Meta
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-white/80 block mb-2">WhatsApp Business Account ID</label>
                  <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 font-mono text-sm focus:ring-1 focus:ring-primary focus:outline-none" defaultValue="1049382057391" />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/80 block mb-2">Phone Number ID</label>
                  <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 font-mono text-sm focus:ring-1 focus:ring-primary focus:outline-none" defaultValue="1092837465928" />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/80 block mb-2">Permanent Access Token</label>
                  <input type="password" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 font-mono text-sm focus:ring-1 focus:ring-primary focus:outline-none" defaultValue="EAAGm0PX4ZC38BO4ZBC..." />
                </div>
                
                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <button className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                    Enregistrer les clés
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl border-emerald-500/30 bg-emerald-500/5">
              <h3 className="font-bold text-emerald-400 mb-2">Statut de la connexion</h3>
              <p className="text-sm text-white/70 mb-4">Votre numéro <strong className="text-white">+33 6 12 34 56 78</strong> est correctement connecté à l'API Meta. Qualité du numéro : ÉLEVÉE.</p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <span className="text-sm font-medium text-primary">Connecté et actif</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
