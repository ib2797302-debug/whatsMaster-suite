import DashboardLayout from "@/components/layout/DashboardLayout";
import { MessageCircle, Webhook, Building, Bell, Moon, Sun, Monitor, Volume2, VolumeX, LayoutGrid, List } from "lucide-react";
import { useUserPreferences } from "@/hooks/use-preferences";
import { useTheme } from "@/hooks/use-theme";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useOnlineStatus } from "@/hooks/use-preferences";

export default function SettingsPage() {
  const { preferences, updatePreference, togglePreference, resetPreferences } = useUserPreferences();
  const { theme, setTheme } = useTheme();
  const isOnline = useOnlineStatus();
  
  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold">Paramètres</h1>
          <p className="text-muted-foreground text-sm mt-1">Configurez vos préférences personnelles et l'intégration WhatsApp Business.</p>
        </div>

        {/* État de connexion */}
        <div className={`glass-card p-6 rounded-3xl border ${isOnline ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-destructive/30 bg-destructive/5'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-destructive'}`} />
              <div>
                <h3 className="font-bold">{isOnline ? 'En ligne' : 'Hors ligne'}</h3>
                <p className="text-sm text-muted-foreground">
                  {isOnline 
                    ? 'Votre connexion est active. Toutes les fonctionnalités sont disponibles.' 
                    : 'Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.'}
                </p>
              </div>
            </div>
            {!isOnline && (
              <Badge variant="destructive">Hors ligne</Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Settings Nav */}
          <div className="space-y-1">
            {[
              { id: 'preferences', name: 'Préférences', icon: LayoutGrid },
              { id: 'whatsapp', name: 'WhatsApp API', icon: MessageCircle },
              { id: 'company', name: 'Entreprise', icon: Building },
              { id: 'notifications', name: 'Notifications', icon: Bell },
              { id: 'webhooks', name: 'Webhooks', icon: Webhook },
            ].map((tab) => (
              <button key={tab.id} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-muted-foreground hover:bg-white/5 hover:text-white">
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="md:col-span-3 space-y-6">
            
            {/* Préférences d'affichage */}
            <div className="glass-card p-8 rounded-3xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <LayoutGrid className="text-primary w-6 h-6" /> Préférences d'affichage
              </h2>
              
              <div className="space-y-6">
                {/* Thème */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {theme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : 
                       theme === 'light' ? <Sun className="w-5 h-5 text-primary" /> : 
                       <Monitor className="w-5 h-5 text-primary" />}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white/80 block">Thème</label>
                      <p className="text-xs text-muted-foreground">Choisissez l'apparence de l'application</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setTheme('light')}
                      className={`p-2 rounded-lg border transition-all ${theme === 'light' ? 'bg-primary text-primary-foreground border-primary' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                      title="Thème clair"
                    >
                      <Sun className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setTheme('dark')}
                      className={`p-2 rounded-lg border transition-all ${theme === 'dark' ? 'bg-primary text-primary-foreground border-primary' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                      title="Thème sombre"
                    >
                      <Moon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setTheme('system')}
                      className={`p-2 rounded-lg border transition-all ${theme === 'system' ? 'bg-primary text-primary-foreground border-primary' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                      title="Thème système"
                    >
                      <Monitor className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Mode compact */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <List className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white/80 block">Mode compact</label>
                      <p className="text-xs text-muted-foreground">Réduire l'espacement pour afficher plus de contenu</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.compactMode}
                    onCheckedChange={() => togglePreference('compactMode')}
                    aria-label="Activer le mode compact"
                  />
                </div>

                {/* Réinitialiser */}
                <div className="pt-6 border-t border-white/10">
                  <button 
                    onClick={resetPreferences}
                    className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    Réinitialiser les préférences
                  </button>
                </div>
              </div>
            </div>

            {/* Configuration Meta */}
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

            {/* Statut de la connexion */}
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
