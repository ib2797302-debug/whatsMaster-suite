# 🎨 Theme-Plugins Visual Suite - Guide Complet

## Vue d'ensemble
Ce document présente les spécifications visuelles détaillées pour les **10 Theme-Plugins Métier** de WhatsMaster Suite. Chaque thème dispose d'une identité visuelle unique, optimisée pour son cas d'usage métier spécifique.

---

## 🏗️ Design System Global

### Typographie
- **Famille** : Inter, SF Pro Display, Apple System
- **Échelle** : 0.75rem → 2.25rem (6 niveaux)
- **Graisses** : 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Couleurs Neutres (Slate Palette)
| Nuance | Code | Usage |
|--------|------|-------|
| Slate 50 | `#f8fafc` | Fonds légers |
| Slate 100 | `#f1f5f9` | Surfaces secondaires |
| Slate 200 | `#e2e8f0` | Bordures subtiles |
| Slate 600 | `#475569` | Texte secondaire |
| Slate 800 | `#1e293b` | Texte principal |
| Slate 900 | `#0f172a` | Titres, contrastes forts |

### Composants Standardisés
- **Cartes** : Radius 12px, Ombre douce, Border semi-transparente
- **Boutons** : Radius 8px, 3 variants (solid, outline, ghost)
- **Inputs** : Radius 8px, Focus ring bleu 2px

---

## 📊 Les 10 Thèmes Visuels Détaillés

### 1. 🤖 Support Expert GraphRAG
**Couleurs** : Bleu Corporate (#2563EB) + Cyan (#06B6D4)  
**Ambiance** : Professionnelle, Data-dense, Rassurante  
**Layout** : Split 60/40 (Conversation vs Graphe de connaissance)  

**Composants Clés** :
- Flux de conversation en temps réel avec highlights d'entités
- Panel droit "Graph Context" visualisant les relations Client-Produit-Ticket
- Cartes KPI : CSAT, Temps de résolution, Risque SLA
- Boîte de suggestions IA avec actions rapides

**Prompt Midjourney** :
```
/imagine prompt: High-fidelity UI design of an enterprise customer support dashboard, split screen view. Left side: WhatsApp-style chat interface with AI suggested responses highlighted in blue. Right side: Interactive knowledge graph visualization showing connections between 'Customer', 'Product Issue', and 'Solution Node'. Clean white background, corporate blue accents (#2563EB), glassmorphism cards, Inter font, data-dense but airy, 4k resolution, UX/UI presentation, dribbble style, enterprise SaaS aesthetic. --ar 16:9 --v 6.0 --style raw --q 2 --chaos 10
```

---

### 2. 🛒 Commerce Conversationnel
**Couleurs** : Émeraude (#10B981) + Ambre (#F59E0B)  
**Ambiance** : Dynamique, Incitative, Mobile-first  
**Layout** : Feed vertical avec cartes produits immersives  

**Composants Clés** :
- Cartes produits Rich Media (Image HD + Prix + CTA)
- Bannière Upsell contextuelle intelligente
- Widget de génération de lien de paiement
- Indicateur de stock en temps réel

**Prompt Midjourney** :
```
/imagine prompt: Mobile app UI design for conversational commerce on WhatsApp. Screen showing a chat interface where a product card is embedded with high-res image, price tag, and 'Add to Cart' button. Below, a horizontal carousel of recommended products. Bottom sticky bar with total price and 'Pay Now' button in emerald green. Clean white background, soft shadows, modern e-commerce aesthetic, Shopify-like polish, 8k render, ultra-detailed. --ar 9:16 --v 6.0 --style raw --q 2 --chaos 10
```

---

### 3. 💼 Sales Copilot
**Couleurs** : Indigo (#6366F1) + Violet (#8B5CF6)  
**Ambiance** : Compétitive, Orientée résultats, Moderne  
**Layout** : Kanban board avec sidebar de scoring  

**Composants Clés** :
- Pipeline Kanban (Prospect → Qualifié → Négociation → Clos)
- Jauge de Lead Score (0-100) avec tendance
- Notifications Toast "AI Insights"
- Bouton flottant "Next Best Action"

**Prompt Midjourney** :
```
/imagine prompt: Desktop dashboard UI for sales team, CRM style. Central view is a Kanban board with columns for deal stages. Cards show company logo, deal value, and a colored 'AI Score' badge (green/yellow/red). Right sidebar shows a 'Lead Insights' panel with a radar chart. Color scheme: Indigo and Violet gradients. Modern, clean, Salesforce Lightning inspired but more modern, glass effects, high contrast data visualization. --ar 16:9 --v 6.0 --style raw --q 2 --chaos 10
```

---

### 4. 💗 Customer Success & Retention
**Couleurs** : Rose (#EC4899) + Pink (#F472B6)  
**Ambiance** : Empathique, Analytique, Préventive  
**Layout** : Matrice de santé + Flux d'alertes  

**Composants Clés** :
- Matrice de Santé Client (Scatter plot : Usage vs Satisfaction)
- Liste d'alertes Churn Risk triée par urgence
- Tracker de étapes de Playbook automatisé
- Graphique linéaire de tendance NPS

**Prompt Midjourney** :
```
/imagine prompt: Enterprise SaaS dashboard for Customer Success Managers. Main visual is a scatter plot matrix showing customers positioned by 'Usage' and 'Satisfaction'. Quadrants are subtly shaded. Red dots indicate 'At Risk' clients. A side panel lists 'Recommended Actions' with checkboxes. Color palette: Rose and Pink accents on clean white. Professional, analytical, clean lines, Tableau-inspired aesthetics but integrated in a workflow tool. --ar 16:9 --v 6.0 --style raw --q 2 --chaos 10
```

---

### 5. 🔐 Compliance & Identity
**Couleurs** : Navy (#0F172A) + Bleu électrique (#3B82F6)  
**Ambiance** : Sécurisée, Institutionnelle, Sérieuse  
**Layout** : Wizard étape-par-étape + Viewer de documents  

**Composants Clés** :
- Overlay de scan de document d'identité (vue mobile avec AR)
- Anneau de statut de vérification biométrique
- Toggles de gestion des consentements
- Table de logs d'audit immuables (style blockchain)

**Prompt Midjourney** :
```
/imagine prompt: Security-focused UI design for identity verification. Split screen: Left side shows a mobile mockup scanning a passport with AR overlay borders. Right side shows a desktop 'Audit Trail' with cryptographic hashes and timestamps in a monospace font. Dark mode option visible. Colors: Slate gray, deep navy, and electric blue accents. Trustworthy, bank-grade security aesthetic, serious, clean, cyber-security theme. --ar 16:9 --v 6.0 --style raw --q 2 --chaos 10
```

---

### 6. 🎙️ Voice-First Operations
**Couleurs** : Orange vif (#F97316) + Ambre (#FB923C)  
**Ambiance** : Énergique, Terrain, Utility-first  
**Layout** : Visualiseur de waveform + Liste de commandes  

**Composants Clés** :
- Animation de waveform audio en temps réel
- Boutons d'action rapide par commande vocale
- Zone de transcription avec diarisation des locuteurs
- Indicateur de synchronisation offline

**Prompt Midjourney** :
```
/imagine prompt: Mobile UI design for field workers using voice commands. Large central microphone button with animated sound waves radiating outwards. Below, a list of recognized commands with checkmarks. Top section shows a transcription of the last voice note. Color scheme: Vibrant Orange and Amber. High contrast for outdoor visibility. Large touch targets. Modern, energetic, utility-focused design. --ar 9:16 --v 6.0 --style raw --q 2 --chaos 10
```

---

### 7. ✨ Hyper-Personnalisation
**Couleurs** : Violet (#8B5CF6) + Lavande (#C4B5FD)  
**Ambiance** : Créative, Magique, Intuitive  
**Layout** : Carte Persona + Diagramme de flux comportemental  

**Composants Clés** :
- Carte Profil Utilisateur 360° (Bio + Psychographie)
- Map de Journey Comportemental (Timeline)
- Previewer de variantes A/B Test
- Builder de règles de segmentation (No-code)

**Prompt Midjourney** :
```
/imagine prompt: Marketing analytics dashboard UI. Center stage is a 'User Persona' card with an avatar, demographic stats, and psychological traits tags (e.g., 'Early Adopter', 'Price Sensitive'). Background shows a subtle flow chart of user behavior. Color palette: Purple and Violet gradients, very modern and creative. Dribbble top trend style, soft shadows, rounded corners, magical feel. --ar 16:9 --v 6.0 --style raw --q 2 --chaos 10
```

---

### 8. 🌱 FinOps & GreenOps
**Couleurs** : Teal (#14B8A6) + Émeraude (#5EEAD4)  
**Ambiance** : Responsable, Écologique, Précise  
**Layout** : Scatter Plot Coût vs Carbone + Jauges de budget  

**Composants Clés** :
- Graphique de Burn Rate des coûts en temps réel
- Compteur d'équivalent CO2 (icône arbre)
- Matrice d'efficacité de routing LLM
- Sliders de seuils d'alerte budget

**Prompt Midjourney** :
```
/imagine prompt: Sustainability and Finance dashboard UI. Large gauge chart showing 'AI Carbon Footprint' with a leaf icon. Next to it, a currency cost tracker. A table below lists 'Optimization Opportunities' to save money and CO2. Color scheme: Teal, Emerald, and Mint green. Clean, eco-conscious, corporate responsibility aesthetic. Data visualization is clear and precise. --ar 16:9 --v 6.0 --style raw --q 2 --chaos 10
```

---

### 9. 🤖 Agentic Workspace
**Couleurs** : Bleu (#3B82F6) + Cyan (#60A5FA)  
**Ambiance** : Futuriste, Orchestration, Tech-heavy  
**Layout** : Visualisation de Swarm d'agents + Queue de tâches  

**Composants Clés** :
- Représentation visuelle des Agents actifs (Avatars)
- Graphe de dépendances de tâches
- Modal d'approbation Human-in-the-loop
- Matrice de capacités des Agents

**Prompt Midjourney** :
```
/imagine prompt: Futuristic AI orchestration dashboard. Visual representation of multiple 'AI Agents' working together, shown as connected nodes or avatars. Lines connecting them represent task handoffs. A central console shows 'Active Tasks' and requires 'Human Approval' for critical steps. Color scheme: Blue and Cyan, tech-heavy, sci-fi interface but clean enough for enterprise. HUD elements, glowing edges. --ar 16:9 --v 6.0 --style raw --q 2 --chaos 10
```

---

### 10. 🏪 Franchise Command Center
**Couleurs** : Rouge (#DC2626) + Corail (#F87171)  
**Ambiance** : Logistique, Opérationnelle, Multi-sites  
**Layout** : Carte géo interactive + Leaderboard de performance  

**Composants Clés** :
- Carte interactive avec Pins colorés par performance
- Barres de comparaison KPI Régional vs National
- Feed de communication Franchiseurs
- Checklist de conformité par site

**Prompt Midjourney** :
```
/imagine prompt: Multi-location retail management dashboard. Main feature is a map view with pins representing store locations, colored red to green based on performance. Sidebar shows a leaderboard of 'Top Performing Franchises'. Clean, logistical, operational aesthetic. Red and neutral gray color scheme. Professional, logistics software style like Uber Freight or Amazon Logistics. --ar 16:9 --v 6.0 --style raw --q 2 --chaos 10
```

---

## 🛠️ Comment Utiliser ces Prompts

### Pour Midjourney v6
1. Copiez le prompt complet (incluant les paramètres `--ar`, `--v`, etc.)
2. Collez-le dans Discord avec `/imagine`
3. Ajustez `--chaos` (0-100) pour plus/moins de variété
4. Utilisez `--stylize` (0-1000) pour intensifier le style artistique

### Pour DALL-E 3
1. Copiez uniquement la partie descriptive du prompt (avant `--ar`)
2. Ajoutez "Wide angle view, professional UI/UX design" si nécessaire
3. Spécifiez le format dans l'interface (16:9 ou 9:16)

### Pour un Designer Humain (Figma)
1. Utilisez la section "Brief Design" générée par `generateFigmaBrief()`
2. Importez les palettes de couleurs dans les Styles Figma
3. Créez des Components pour chaque élément clé listé
4. Suivez les spécifications techniques (typo, espacements, radius)

---

## 📈 Standards de Qualité Visuelle

| Critère | Niveau Requis | Référence |
|---------|---------------|-----------|
| Contraste | WCAG AAA (7:1) | Accessibilité |
| Densité | 1.2 à 1.5 informations/cm² | Enterprise SaaS |
| Temps de chargement perçu | < 100ms (skeleton screens) | Performance |
| Cohérence | 8pt Grid System | Material Design |
| Responsive | Mobile, Tablet, Desktop, 4K | Multi-device |

---

## 🚀 Prochaines Étapes

1. **Génération des maquettes** : Exécutez les prompts Midjourney pour chaque thème
2. **Création du Design System** : Implémentez les tokens dans Figma
3. **Prototypage interactif** : Liez les écrans clés pour démos clients
4. **Handoff Dev** : Exportez les specs CSS/Tailwind pour l'équipe engineering
5. **Tests utilisateurs** : Validez l'ergonomie sur chaque persona métier

---

*Document généré automatiquement depuis `src/types/theme-plugin-visuals.ts`*  
*Dernière mise à jour : $(date +%Y-%m-%d)*
