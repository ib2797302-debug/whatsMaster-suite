import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/use-auth";
import { useGetUsers } from "@workspace/api-client-react";
import { MOCK_USERS } from "@/lib/mock-data";
import { ShieldAlert, Plus, Shield, User as UserIcon, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const { data, isError } = useGetUsers();
  const usersData = isError || !data ? MOCK_USERS : data;

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <ShieldAlert className="w-16 h-16 text-destructive mb-4 opacity-80" />
          <h1 className="text-2xl font-bold mb-2">Accès Refusé</h1>
          <p className="text-muted-foreground max-w-md">Vous devez être administrateur pour accéder à cette page. Veuillez contacter votre responsable.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold">Gestion des Utilisateurs</h1>
            <p className="text-muted-foreground text-sm mt-1">Gérez les accès de votre équipe à la plateforme.</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" /> Nouvel Utilisateur
          </button>
        </div>

        <div className="glass-card rounded-3xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-5 font-medium">Utilisateur</th>
                <th className="p-5 font-medium">Rôle</th>
                <th className="p-5 font-medium">Statut</th>
                <th className="p-5 font-medium">Date de création</th>
                <th className="p-5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {usersData.users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{u.name}</div>
                        <div className="text-xs text-muted-foreground">@{u.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-white/10 text-white/80 border border-white/5'}`}>
                      {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                      {u.role}
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${u.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                      <span className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                      {u.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="p-5 text-muted-foreground">
                    {format(new Date(u.createdAt), 'dd MMMM yyyy', { locale: fr })}
                  </td>
                  <td className="p-5 text-right">
                    <button className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
