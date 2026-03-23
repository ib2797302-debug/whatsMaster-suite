# WhatsMaster Suite

Application de gestion WhatsApp professionnelle avec tableau de bord, boîte de réception, contacts, campagnes et analytiques.

## 🚀 Fonctionnalités

- **Tableau de bord** : Vue d'ensemble des statistiques et activités
- **Boîte de réception** : Gestion des conversations en temps réel
- **Contacts** : CRM complet pour gérer vos contacts
- **Campagnes** : Création et envoi de campagnes marketing
- **Analytiques** : Rapports détaillés et insights
- **Administration** : Gestion des utilisateurs et paramètres

## 🛠️ Technologies

- **Frontend** : React 18, TypeScript, Vite
- **UI** : Tailwind CSS, Radix UI, shadcn/ui
- **State Management** : React Query (TanStack Query)
- **Routing** : Wouter
- **Tests** : Vitest, React Testing Library
- **Forms** : React Hook Form, Zod

## 📦 Installation

```bash
# Installer les dépendances
pnpm install

# Démarrer le serveur de développement
pnpm dev

# Build de production
pnpm build

# Exécuter les tests
pnpm test

# Tests avec couverture
pnpm test:coverage
```

## 🔐 Authentification

Comptes de démonstration :
- **Admin** : `admin` / `admin`
- **Agent** : `user` / `user`

## 🏗️ Architecture

```
src/
├── components/     # Composants UI réutilisables
├── hooks/          # Hooks personnalisés
├── lib/           # Utilitaires et API client
├── pages/         # Pages de l'application
└── test/          # Configuration et utilitaires de test
```

## 🔒 Sécurité

- Tokens JWT avec expiration (24h)
- Validation stricte des données utilisateur
- Protection contre les injections XSS
- Headers de sécurité HTTP

## 🧪 Tests

Les tests sont écrits avec Vitest et React Testing Library :

```bash
# Lancer tous les tests
pnpm test

# Mode watch pour le développement
pnpm test -- --watch

# Couverture de code
pnpm test:coverage
```

## 🌍 Variables d'environnement

Copiez `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Variables requises :
- `VITE_API_URL` : URL de l'API backend
- `BASE_PATH` : Chemin de base pour le déploiement
- `PORT` : Port pour le développement

## 📄 Licence

Propriétaire - Tous droits réservés
