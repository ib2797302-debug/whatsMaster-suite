import { Link } from "wouter";
import { motion } from "framer-motion";
import { MessageCircle, Zap, Shield, BarChart, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const features = [
    { icon: MessageCircle, title: "Inbox Intelligent", desc: "Gérez toutes vos conversations WhatsApp dans une interface unique, rapide et pensée pour la productivité." },
    { icon: MegaphoneIcon, title: "Campagnes Massives", desc: "Envoyez des milliers de messages ciblés avec des taux d'ouverture de 98%." },
    { icon: Zap, title: "Automatisation IA", desc: "Des chatbots intelligents qui répondent 24/7 et qualifient vos leads automatiquement." },
    { icon: BarChart, title: "Analytics Temps Réel", desc: "Suivez vos performances, temps de réponse et ROI avec des tableaux de bord détaillés." },
    { icon: Users, title: "Multi-Agents", desc: "Collaborez en équipe sur le même numéro WhatsApp sans collision ni confusion." },
    { icon: Shield, title: "Sécurité & Conformité", desc: "Respect total des RGPD et des politiques de Meta. Vos données sont chiffrées de bout en bout." },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 font-sans overflow-x-hidden relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} alt="Background" className="w-full h-full object-cover opacity-40 mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-panel border-t-0 border-x-0 border-b-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.4)]">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight text-white">Whats<span className="text-primary">Master</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#social-proof" className="hover:text-white transition-colors">Clients</a>
            <a href="#pricing" className="hover:text-white transition-colors">Tarifs</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <button className="px-6 py-2.5 rounded-full text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                Connexion
              </button>
            </Link>
            <Link href="/login">
              <button className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] hover:-translate-y-0.5 transition-all">
                Démarrer <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center lg:text-left flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-primary/30 text-primary text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              <span className="text-glow">Nouvelle version 2.0 disponible</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight leading-[1.1]">
              Dominez <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">WhatsApp Business.</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              La plateforme ultime pour centraliser vos conversations, automatiser vos ventes et lancer des campagnes massives sur l'application la plus utilisée au monde.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <Link href="/login">
                <button className="w-full sm:w-auto px-8 py-4 rounded-full text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                  Essai Gratuit <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 rounded-full text-lg font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                Voir la démo
              </button>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 text-white/40 text-sm font-medium">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Sans carte bancaire</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Annulation à tout moment</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="flex-1 w-full relative perspective-[1000px]"
          >
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden glass-panel border border-white/20 shadow-[0_0_100px_rgba(37,211,102,0.15)] transform rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700">
              <img src={`${import.meta.env.BASE_URL}images/app-mockup.png`} alt="WhatsMaster Dashboard" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-white/5 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10k+", label: "Entreprises clientes" },
              { value: "50M+", label: "Messages envoyés / mois" },
              { value: "99.9%", label: "Uptime garanti" },
              { value: "4.9/5", label: "Note sur TrustPilot" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-display font-bold text-white mb-2 text-glow">{stat.value}</div>
                <div className="text-sm font-medium text-white/50 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-32">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Un arsenal complet pour <br/><span className="text-primary">votre croissance.</span></h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">Tout ce dont vous avez besoin pour transformer WhatsApp en votre meilleur canal de vente et de support.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={i} 
                className="glass-card p-8 rounded-3xl group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(37,211,102,0.2)] transition-all">
                  <f.icon className="w-7 h-7 text-white/70 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-white/50 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section id="social-proof" className="max-w-7xl mx-auto px-6 py-20 relative">
          <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            <div className="glass-card p-10 rounded-3xl">
              <div className="flex text-primary mb-6">{"★".repeat(5)}</div>
              <p className="text-xl font-medium text-white/90 mb-8 leading-relaxed">"Depuis que nous utilisons WhatsMaster, notre temps de réponse est passé de 4h à 5 minutes. Nos ventes via WhatsApp ont augmenté de 300%."</p>
              <div className="flex items-center gap-4">
                <img src={`${import.meta.env.BASE_URL}images/avatar-1.png`} alt="Avatar" className="w-14 h-14 rounded-full border-2 border-white/10 object-cover" />
                <div>
                  <div className="font-bold text-white">Claire Martin</div>
                  <div className="text-sm text-white/50">Directrice Marketing, TechFlow</div>
                </div>
              </div>
            </div>
            <div className="glass-card p-10 rounded-3xl">
              <div className="flex text-primary mb-6">{"★".repeat(5)}</div>
              <p className="text-xl font-medium text-white/90 mb-8 leading-relaxed">"La fonctionnalité de campagnes massives est incroyable. Nous pouvons relancer 10 000 clients inactifs en un clic avec des messages personnalisés."</p>
              <div className="flex items-center gap-4">
                <img src={`${import.meta.env.BASE_URL}images/avatar-2.png`} alt="Avatar" className="w-14 h-14 rounded-full border-2 border-white/10 object-cover" />
                <div>
                  <div className="font-bold text-white">Marc Dubois</div>
                  <div className="text-sm text-white/50">CEO, E-Shop Plus</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="max-w-7xl mx-auto px-6 py-32 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Des tarifs clairs, <br/>sans surprise.</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto text-left">
            {[
              { name: "Starter", price: "49€", desc: "Pour les petites équipes qui se lancent.", features: ["1 Agent", "1000 messages/mois", "Inbox basique", "Support email"] },
              { name: "Pro", price: "149€", desc: "La puissance totale de WhatsApp Business.", features: ["5 Agents", "Messages illimités", "Campagnes massives", "Automatisation IA", "Support prioritaire"], popular: true },
              { name: "Enterprise", price: "Sur devis", desc: "Solutions sur-mesure pour les grands comptes.", features: ["Agents illimités", "SLA 99.9%", "API Dédiée", "Account Manager"] }
            ].map((plan, i) => (
              <div key={i} className={cn("glass-card p-8 rounded-3xl relative flex flex-col", plan.popular && "neon-border -translate-y-4")}>
                {plan.popular && <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1/2"><span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">LE PLUS POPULAIRE</span></div>}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-sm text-white/50 h-10">{plan.desc}</div>
                <div className="my-8"><span className="text-4xl font-display font-bold">{plan.price}</span><span className="text-white/50">/mois</span></div>
                <ul className="space-y-4 flex-1 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-white/80"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> {f}</li>
                  ))}
                </ul>
                <Link href="/login">
                  <button className={cn("w-full py-4 rounded-xl font-bold transition-all", plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-white/5 hover:bg-white/10")}>
                    Choisir {plan.name}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 glass-panel border-x-0 border-b-0">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-primary" />
            <span className="text-xl font-display font-bold text-white">WhatsMaster</span>
          </div>
          <p className="text-white/40 text-sm">© 2025 WhatsMaster Suite. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

// Polyfill for icon used in array
function MegaphoneIcon(props: any) {
  return <Megaphone {...props} />;
}
import { Megaphone } from "lucide-react";
