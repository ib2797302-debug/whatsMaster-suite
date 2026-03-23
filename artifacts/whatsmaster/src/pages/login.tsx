import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { MessageCircle, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login({ username, password });
    } catch (err: any) {
      setError(err.message || "Échec de la connexion");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-6">
        <Link href="/">
          <div className="flex justify-center items-center gap-3 mb-10 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-[0_0_30px_rgba(37,211,102,0.3)] group-hover:scale-105 transition-transform">
              <MessageCircle className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-3xl font-display font-bold tracking-tight text-white">Whats<span className="text-primary">Master</span></span>
          </div>
        </Link>
        <h2 className="text-center text-2xl font-bold tracking-tight text-white mb-8">
          Connexion à votre espace
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-6">
        <div className="glass-card py-10 px-8 rounded-3xl shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium leading-6 text-white/80">Nom d'utilisateur</label>
              <div className="mt-2">
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-xl border-0 py-3.5 px-4 bg-black/40 text-white shadow-inner ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary focus:outline-none sm:text-sm sm:leading-6 transition-all"
                  placeholder="admin ou user"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-white/80">Mot de passe</label>
              <div className="mt-2">
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border-0 py-3.5 px-4 bg-black/40 text-white shadow-inner ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary focus:outline-none sm:text-sm sm:leading-6 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 text-sm text-destructive-foreground bg-destructive/20 border border-destructive/30 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-primary px-3 py-4 text-sm font-bold leading-6 text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Se connecter"}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-sm text-white/50 mb-3">Comptes de démonstration :</p>
            <div className="flex flex-col gap-2 text-sm font-mono">
              <div className="bg-white/5 py-2 px-4 rounded-lg border border-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => {setUsername('admin'); setPassword('admin');}}>
                Admin: <span className="text-primary">admin</span> / <span className="text-primary">admin</span>
              </div>
              <div className="bg-white/5 py-2 px-4 rounded-lg border border-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => {setUsername('user'); setPassword('user');}}>
                Agent: <span className="text-primary">user</span> / <span className="text-primary">user</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
