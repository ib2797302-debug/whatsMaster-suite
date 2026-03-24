import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useGetContacts, useCreateContact, useDeleteContact } from "@workspace/api-client-react";
import { MOCK_CONTACTS } from "@/lib/mock-data";
import { Search, Plus, MoreHorizontal, UserX, UserCheck } from "lucide-react";
import { formatRelativeTime, formatPhoneNumber, capitalize } from "@/lib/formatters";

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isError } = useGetContacts({ search: searchTerm });
  const contactsData = isError || !data ? MOCK_CONTACTS : data;

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Carnet de Contacts</h1>
            <p className="text-muted-foreground text-sm mt-1">Gérez vos {contactsData.total} contacts et listes de diffusion.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-[0_0_15px_rgba(37,211,102,0.3)] hover:shadow-[0_0_25px_rgba(37,211,102,0.5)] transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Ajouter un contact
          </button>
        </div>

        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-4 border-b border-white/5 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom ou numéro..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5 text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Téléphone</th>
                  <th className="p-4 font-medium hidden md:table-cell">Tags</th>
                  <th className="p-4 font-medium hidden sm:table-cell">Ajouté le</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {contactsData.contacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground shrink-0">
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{contact.name}</div>
                          {contact.email && <div className="text-xs text-muted-foreground">{contact.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-white/80">{formatPhoneNumber(contact.phone)}</td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex gap-2 flex-wrap">
                        {contact.tags?.map(tag => (
                          <span key={tag} className="px-2 py-1 rounded-md bg-white/10 text-xs font-medium border border-white/5">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell text-muted-foreground">
                      {formatRelativeTime(new Date(contact.createdAt))}
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-white/5 text-center text-sm text-muted-foreground">
            Affiche {contactsData.contacts.length} sur {contactsData.total} contacts
          </div>
        </div>
      </div>

      {/* Simple Create Contact Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-6">Ajouter un contact</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/70 block mb-1">Nom complet</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 focus:ring-1 focus:ring-primary focus:outline-none" placeholder="Ex: Jean Dupont" />
              </div>
              <div>
                <label className="text-sm text-white/70 block mb-1">Numéro de téléphone</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 focus:ring-1 focus:ring-primary focus:outline-none" placeholder="+33 6 12 34 56 78" />
              </div>
            </div>
            <div className="mt-8 flex gap-3 justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">Annuler</button>
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
