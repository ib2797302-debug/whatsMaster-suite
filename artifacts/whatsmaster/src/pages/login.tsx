import { useState, FormEvent, KeyboardEvent } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { MessageCircle, Loader2, ArrowRight, User, Lock } from "lucide-react";

interface DemoAccount {
  role: string;
  username: string;
  password: string;
  label: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  { role: "Admin", username: "admin", password: "admin", label: "Administrateur" },
  { role: "Agent", username: "user", password: "user", label: "Agent de support" },
];

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDemoClick = (demo: DemoAccount) => {
    setUsername(demo.username);
    setPassword(demo.password);
    setError("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, demo: DemoAccount) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleDemoClick(demo);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    try {
      await login({ username, password });
    } catch (err: any) {
      setError(err.message || "Échec de la connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#050505] flex flex-col justify-center relative overflow-hidden"
      role="main"
      aria-label="Page de connexion"
    >
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/20 blur-[150px] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-6">
        <Link href="/">
          <div className="flex justify-center items-center gap-3 mb-10 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-[0_0_30px_rgba(37,211,102,0.3)] group-hover:scale-105 transition-transform">
              <MessageCircle className="w-7 h-7 text-primary-foreground" aria-hidden="true" />
            </div>
            <span className="text-3xl font-display font-bold tracking-tight text-white">
              Whats<span className="text-primary">Master</span>
            </span>
          </div>
        </Link>
        <h1 
          className="text-center text-2xl font-bold tracking-tight text-white mb-8"
          id="login-heading"
        >
          Connexion à votre espace
        </h1>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-6">
        <div className="glass-card py-10 px-8 rounded-3xl shadow-2xl">
          <form 
            className="space-y-6" 
            onSubmit={handleSubmit}
            aria-labelledby="login-heading"
            noValidate
          >
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium leading-6 text-white/80"
              >
                Nom d'utilisateur
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-white/40" aria-hidden="true" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-xl border-0 py-3.5 pl-11 pr-4 bg-black/40 text-white shadow-inner ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary focus:outline-none sm:text-sm sm:leading-6 transition-all"
                  placeholder="admin ou user"
                  aria-required="true"
                  disabled={isSubmitting || isLoading}
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium leading-6 text-white/80"
              >
                Mot de passe
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/40" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border-0 py-3.5 pl-11 pr-4 bg-black/40 text-white shadow-inner ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary focus:outline-none sm:text-sm sm:leading-6 transition-all"
                  placeholder="••••••••"
                  aria-required="true"
                  disabled={isSubmitting || isLoading}
                />
              </div>
            </div>

            {error && (
              <div 
                className="p-3 text-sm text-destructive-foreground bg-destructive/20 border border-destructive/30 rounded-lg"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading || isSubmitting || !username || !password}
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-primary px-3 py-4 text-sm font-bold leading-6 text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-busy={isLoading || isSubmitting}
              >
                {(isLoading || isSubmitting) ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                    <span className="sr-only">Connexion en cours...</span>
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-sm text-white/50 mb-3" id="demo-accounts-label">
              Comptes de démonstration :
            </p>
            <div 
              className="flex flex-col gap-2 text-sm font-mono"
              role="group"
              aria-labelledby="demo-accounts-label"
            >
              {DEMO_ACCOUNTS.map((demo) => (
                <div
                  key={demo.username}
                  className="bg-white/5 py-2 px-4 rounded-lg border border-white/5 cursor-pointer hover:bg-white/10 transition-colors focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  onClick={() => handleDemoClick(demo)}
                  onKeyDown={(e) => handleKeyDown(e, demo)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Utiliser le compte ${demo.label}: ${demo.username}`}
                >
                  {demo.role}: <span className="text-primary">{demo.username}</span> / <span className="text-primary">{demo.password}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
