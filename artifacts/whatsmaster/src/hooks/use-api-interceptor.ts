/**
 * Hook d'interception des requêtes API pour WhatsMaster Suite
 * 
 * Ce hook intercepte toutes les requêtes fetch pour:
 * - Gérer automatiquement les tokens d'authentification expirés
 * - Rafraîchir les tokens si nécessaire
 * - Déconnecter l'utilisateur en cas d'erreur 401
 * - Logger les erreurs API pour le débogage
 */

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

// Conserver une référence au fetch original
const originalFetch = window.fetch;

export function useApiInterceptor() {
  const { logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Intercepter toutes les requêtes fetch
    window.fetch = async function (...args) {
      const [url, options] = args;
      
      try {
        const response = await originalFetch.apply(window, args);
        
        // Gérer les réponses 401 (non autorisé)
        if (response.status === 401) {
          console.warn("[API Interceptor] Token expiré ou invalide");
          
          // Déconnecter l'utilisateur
          await logout();
          
          // Afficher une notification
          toast({
            title: "Session expirée",
            description: "Votre session a expiré. Veuillez vous reconnecter.",
            variant: "destructive",
          });
          
          // Retourner la réponse originale pour que le code puisse la gérer
          return response;
        }
        
        // Gérer les erreurs serveur (5xx)
        if (response.status >= 500 && response.status < 600) {
          console.error(`[API Interceptor] Erreur serveur: ${response.status}`);
          
          toast({
            title: "Erreur serveur",
            description: "Le serveur rencontre des difficultés. Veuillez réessayer plus tard.",
            variant: "destructive",
          });
        }
        
        return response;
      } catch (error) {
        // Gérer les erreurs réseau
        console.error("[API Interceptor] Erreur réseau:", error);
        
        // Ne pas afficher de toast pour les erreurs de déconnexion
        const urlStr = typeof url === "string" ? url : url.toString();
        if (!urlStr.includes("/auth/logout")) {
          toast({
            title: "Erreur de connexion",
            description: "Impossible de se connecter au serveur. Vérifiez votre connexion internet.",
            variant: "destructive",
          });
        }
        
        throw error;
      }
    };

    // Nettoyer lors du démontage
    return () => {
      window.fetch = originalFetch;
    };
  }, [logout, toast]);
}

export default useApiInterceptor;
