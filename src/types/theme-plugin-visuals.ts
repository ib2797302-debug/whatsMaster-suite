/**
 * THEME-PLUGIN VISUAL SUITE
 * 
 * Ce fichier contient les spécifications de design system et les prompts
 * pour générer les interfaces UI des 10 Theme-Plugins Métier.
 * 
 * Standard: Enterprise Multinational (Salesforce Lightning + Apple Human Interface)
 * Style: Glassmorphism subtil, Data-Dense, Accessibilité WCAG AAA.
 */

import { ThemePluginManifest } from '../types/theme-plugin';

// ============================================================================
// 1. DESIGN SYSTEM GLOBAL (BASE COMMUNE)
// ============================================================================

export const GlobalDesignSystem = {
  typography: {
    fontStack: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    scale: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.5rem', '2xl': '2.25rem' },
    weights: { regular: 400, medium: 500, semibold: 600, bold: 700 }
  },
  colors: {
    // Palette neutre enterprise
    slate: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a' },
    // States
    success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6'
  },
  components: {
    card: { radius: '12px', shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: '1px solid rgba(226, 232, 240, 0.8)' },
    button: { radius: '8px', style: 'solid | outline | ghost' },
    input: { radius: '8px', focusRing: '2px solid #3b82f6' }
  }
};

// ============================================================================
// 2. SPÉCIFICATIONS VISUELLES PAR THÈME (IMAGE BLUEPRINTS)
// ============================================================================

export interface VisualBlueprint {
  themeId: string;
  name: string;
  description: string;
  colorPalette: { primary: string; secondary: string; accent: string; background: string };
  layoutStructure: string;
  keyComponents: string[];
  dataVizStyle: string;
  // Prompt optimisé pour Midjourney v6 / DALL-E 3
  aiImagePrompt: string;
  // Description détaillée pour un designer UI (Figma)
  figmaSpec: string;
}

export const ThemeVisuals: VisualBlueprint[] = [
  {
    themeId: 'com.whatsmaster.theme.support-graphrag',
    name: 'Support Expert GraphRAG',
    description: 'Interface de centre de commandement pour le support client augmenté par IA relationnelle.',
    colorPalette: { primary: '#2563EB', secondary: '#1E40AF', accent: '#06B6D4', background: '#F8FAFC' },
    layoutStructure: 'Sidebar gauche navigation, Header recherche globale, Main split 60/40 (Conversation vs Knowledge Graph)',
    keyComponents: [
      'Live Conversation Stream avec highlights d\'entités',
      'Panel droit "Graph Context" montrant les nœuds connectés (Client, Produit, Ticket)',
      'KPI Cards: CSAT, Temps de résolution, SLA Breach Risk',
      'AI Suggestion Box avec boutons d\'action rapide'
    ],
    dataVizStyle: 'Network graphs with force-directed layout, soft gradients, node sizing by importance.',
    aiImagePrompt: "High-fidelity UI design of an enterprise customer support dashboard, split screen view. Left side: WhatsApp-style chat interface with AI suggested responses highlighted in blue. Right side: Interactive knowledge graph visualization showing connections between 'Customer', 'Product Issue', and 'Solution Node'. Clean white background, corporate blue accents (#2563EB), glassmorphism cards, Inter font, data-dense but airy, 4k resolution, UX/UI presentation, dribbble style, enterprise SaaS aesthetic.",
    figmaSpec: "Utiliser une grille de 12 colonnes. Carte de conversation à gauche avec bulles de message arrondies (16px). Panel droit avec fond légèrement grisé (#F1F5F9) contenant un canvas SVG pour le graphe. Les nœuds du graphe doivent avoir des ombres portées douces. Typographie : Inter, gris foncé (#1E293B) pour le texte principal."
  },
  {
    themeId: 'com.whatsmaster.theme.commerce-conversational',
    name: 'Commerce Conversationnel',
    description: 'Expérience d\'achat immersive intégrée au chat, focalisée sur la conversion.',
    colorPalette: { primary: '#10B981', secondary: '#059669', accent: '#F59E0B', background: '#FFFFFF' },
    layoutStructure: 'Mobile-first feed, Product Cards carousel, Sticky Checkout Bar',
    keyComponents: [
      'Rich Media Product Cards (Image + Prix + Bouton Ajout)',
      'Smart Upsell Banner contextuel',
      'Payment Link Generator widget',
      'Inventory Status Indicator (temps réel)'
    ],
    dataVizStyle: 'Clean e-commerce grids, large imagery, minimal text, high contrast CTAs.',
    aiImagePrompt: "Mobile app UI design for conversational commerce on WhatsApp. Screen showing a chat interface where a product card is embedded with high-res image, price tag, and 'Add to Cart' button. Below, a horizontal carousel of recommended products. Bottom sticky bar with total price and 'Pay Now' button in emerald green. Clean white background, soft shadows, modern e-commerce aesthetic, Shopify-like polish, 8k render, ultra-detailed.",
    figmaSpec: "Focus sur l'imagerie produit. Les cartes produits doivent occuper 80% de la largeur. Utiliser des ombres portées pour détacher les éléments du fond blanc. Le bouton de paiement doit être fixe en bas de l'écran (sticky) avec un effet de flou d'arrière-plan (backdrop-filter: blur)."
  },
  {
    themeId: 'com.whatsmaster.theme.sales-copilot',
    name: 'Sales Copilot',
    description: 'Tableau de bord de pilotage commercial avec scoring de leads et automatisation.',
    colorPalette: { primary: '#6366F1', secondary: '#4F46E5', accent: '#8B5CF6', background: '#F3F4F6' },
    layoutStructure: 'Kanban Board view, Lead Scoring Sidebar, Activity Timeline',
    keyComponents: [
      'Pipeline Kanban (Prospect -> Qualifié -> Négociation -> Clos)',
      'Lead Score Gauge (0-100) avec indicateur de tendance',
      'AI Insight Toast notifications',
      'Next Best Action floating button'
    ],
    dataVizStyle: 'Funnel charts, linear progress bars, heatmaps for activity intensity.',
    aiImagePrompt: "Desktop dashboard UI for sales team, CRM style. Central view is a Kanban board with columns for deal stages. Cards show company logo, deal value, and a colored 'AI Score' badge (green/yellow/red). Right sidebar shows a 'Lead Insights' panel with a radar chart. Color scheme: Indigo and Violet gradients. Modern, clean, Salesforce Lightning inspired but more modern, glass effects, high contrast data visualization.",
    figmaSpec: "Utiliser des cartes Kanban avec un header coloré selon le score IA. Le graphique radar doit être fin et élégant, utilisant des lignes de 1px d'épaisseur. Espacement généreux entre les colonnes (24px)."
  },
  {
    themeId: 'com.whatsmaster.theme.customer-success',
    name: 'Customer Success & Retention',
    description: 'Vue santé client avec détection de churn et playbooks d\'activation.',
    colorPalette: { primary: '#EC4899', secondary: '#DB2777', accent: '#F472B6', background: '#FFF1F2' },
    layoutStructure: 'Health Score Matrix, Alert Feed, Playbook Wizard',
    keyComponents: [
      'Customer Health Matrix (Scatter plot : Usage vs Satisfaction)',
      'Churn Risk Alert List (trié par urgence)',
      'Automated Playbook Step Tracker',
      'NPS Trend Line Chart'
    ],
    dataVizStyle: 'Scatter plots with quadrant backgrounds, traffic light indicators, smooth area charts.',
    aiImagePrompt: "Enterprise SaaS dashboard for Customer Success Managers. Main visual is a scatter plot matrix showing customers positioned by 'Usage' and 'Satisfaction'. Quadrants are subtly shaded. Red dots indicate 'At Risk' clients. A side panel lists 'Recommended Actions' with checkboxes. Color palette: Rose and Pink accents on clean white. Professional, analytical, clean lines, Tableau-inspired aesthetics but integrated in a workflow tool.",
    figmaSpec: "Le nuage de points doit être interactif visuellement (effet hover). Utiliser des codes couleurs sémaphores (Vert/Orange/Rouge) pour les statuts de santé. Typographie monospace pour les données chiffrées."
  },
  {
    themeId: 'com.whatsmaster.theme.compliance-identity',
    name: 'Compliance & Identity',
    description: 'Interface sécurisée pour la vérification d\'identité et la conformité réglementaire.',
    colorPalette: { primary: '#0F172A', secondary: '#334155', accent: '#3B82F6', background: '#FFFFFF' },
    layoutStructure: 'Step-by-step Wizard, Document Viewer, Audit Log Timeline',
    keyComponents: [
      'ID Document Scanner Overlay (mobile view)',
      'Biometric Verification Status Ring',
      'Consent Management Toggle Switches',
      'Immutable Audit Log Table (blockchain style)'
    ],
    dataVizStyle: 'Minimalist, high contrast, security-focused icons, monospaced logs.',
    aiImagePrompt: "Security-focused UI design for identity verification. Split screen: Left side shows a mobile mockup scanning a passport with AR overlay borders. Right side shows a desktop 'Audit Trail' with cryptographic hashes and timestamps in a monospace font. Dark mode option visible. Colors: Slate gray, deep navy, and electric blue accents. Trustworthy, bank-grade security aesthetic, serious, clean, cyber-security theme.",
    figmaSpec: "Ambiance sérieuse et institutionnelle. Utiliser des bordures fines (1px) et des contrastes élevés. Les logs d'audit doivent utiliser une police 'JetBrains Mono' ou 'Fira Code'. Icônes de cadenas et de boucliers stylisés en outline."
  },
  {
    themeId: 'com.whatsmaster.theme.voice-first',
    name: 'Voice-First Operations',
    description: 'Interface centrée sur l'audio pour les équipes terrain et logistiques.',
    colorPalette: { primary: '#F97316', secondary: '#EA580C', accent: '#FB923C', background: '#FFFBEB' },
    layoutStructure: 'Waveform Visualizer, Voice Command List, Transcription Editor',
    keyComponents: [
      'Real-time Audio Waveform Animation',
      'Voice Command Quick Actions (Microphone buttons)',
      'Transcript Text Area with Speaker Diarization',
      'Offline Sync Status Indicator'
    ],
    dataVizStyle: 'Dynamic waveforms, large touch targets, high visibility status indicators.',
    aiImagePrompt: "Mobile UI design for field workers using voice commands. Large central microphone button with animated sound waves radiating outwards. Below, a list of recognized commands with checkmarks. Top section shows a transcription of the last voice note. Color scheme: Vibrant Orange and Amber. High contrast for outdoor visibility. Large touch targets. Modern, energetic, utility-focused design.",
    figmaSpec: "Boutons très larges (min 60px de hauteur) pour une utilisation facile sur le terrain. Animations de waveform fluides. Mode sombre fortement recommandé pour l'économie de batterie et la lisibilité extérieure."
  },
  {
    themeId: 'com.whatsmaster.theme.hyper-personalization',
    name: 'Hyper-Personnalisation',
    description: 'Moteur de segmentation comportementale et de profilage psychographique.',
    colorPalette: { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#C4B5FD', background: '#F5F3FF' },
    layoutStructure: 'User Persona Card, Behavior Flow Diagram, Dynamic Content Preview',
    keyComponents: [
      '360° User Profile Card (Bio + Psychographics)',
      'Behavioral Journey Map (Timeline)',
      'A/B Test Variant Previewer',
      'Segmentation Rule Builder (No-code)'
    ],
    dataVizStyle: 'Flow diagrams, user avatars, colorful tags, soft gradients.',
    aiImagePrompt: "Marketing analytics dashboard UI. Center stage is a 'User Persona' card with an avatar, demographic stats, and psychological traits tags (e.g., 'Early Adopter', 'Price Sensitive'). Background shows a subtle flow chart of user behavior. Color palette: Purple and Violet gradients, very modern and creative. Dribbble top trend style, soft shadows, rounded corners, magical feel.",
    figmaSpec: "Esthétique créative et douce. Utiliser des dégradés subtils en arrière-plan des cartes. Les tags de personnalité doivent ressembler à des pilules colorées. Typographie arrondie pour les titres."
  },
  {
    themeId: 'com.whatsmaster.theme.finops-greenops',
    name: 'FinOps & GreenOps',
    description: 'Suivi des coûts et de l'impact carbone des conversations IA.',
    colorPalette: { primary: '#14B8A6', secondary: '#0D9488', accent: '#5EEAD4', background: '#F0FDFA' },
    layoutStructure: 'Cost vs Carbon Scatter Plot, Budget Gauge, Optimization Recommendations',
    keyComponents: [
      'Real-time Cost Burn Rate Chart',
      'CO2 Equivalent Counter (Tree icon equivalent)',
      'LLM Routing Efficiency Matrix',
      'Budget Alert Threshold Sliders'
    ],
    dataVizStyle: 'Eco-friendly greens, clean line charts, tree/leaf metaphors for data.',
    aiImagePrompt: "Sustainability and Finance dashboard UI. Large gauge chart showing 'AI Carbon Footprint' with a leaf icon. Next to it, a currency cost tracker. A table below lists 'Optimization Opportunities' to save money and CO2. Color scheme: Teal, Emerald, and Mint green. Clean, eco-conscious, corporate responsibility aesthetic. Data visualization is clear and precise.",
    figmaSpec: "Utiliser des icônes de feuilles et d'arbres pour représenter les données écologiques. Les graphiques financiers doivent être précis et alignés à droite. Ambiance rassurante et responsable."
  },
  {
    themeId: 'com.whatsmaster.theme.agentic-workspace',
    name: 'Agentic Workspace',
    description: 'Orchestration multi-agents autonomes pour tâches complexes.',
    colorPalette: { primary: '#3B82F6', secondary: '#2563EB', accent: '#60A5FA', background: '#EFF6FF' },
    layoutStructure: 'Agent Swarm Visualization, Task Queue, Execution Log',
    keyComponents: [
      'Visual representation of active Agents (Avatars)',
      'Task Dependency Graph',
      'Human-in-the-loop Approval Modal',
      'Agent Capability Matrix'
    ],
    dataVizStyle: 'Node-link diagrams, status pulsing dots, futuristic but usable.',
    aiImagePrompt: "Futuristic AI orchestration dashboard. Visual representation of multiple 'AI Agents' working together, shown as connected nodes or avatars. Lines connecting them represent task handoffs. A central console shows 'Active Tasks' and requires 'Human Approval' for critical steps. Color scheme: Blue and Cyan, tech-heavy, sci-fi interface but clean enough for enterprise. HUD elements, glowing edges.",
    figmaSpec: "Style 'Sci-Fi Enterprise'. Utiliser des effets de lueur (glow) subtils sur les éléments actifs. Les connexions entre agents doivent être animées (lignes pointillées en mouvement). Police technologique mais lisible."
  },
  {
    themeId: 'com.whatsmaster.theme.franchise-command',
    name: 'Franchise Command Center',
    description: 'Pilotage centralisé pour réseaux multi-sites avec benchmarking.',
    colorPalette: { primary: '#DC2626', secondary: '#B91C1C', accent: '#F87171', background: '#FEF2F2' },
    layoutStructure: 'Geo-Map View, Site Performance Leaderboard, Regional Aggregates',
    keyComponents: [
      'Interactive Map with Site Pins (Color-coded by performance)',
      'Regional vs National KPI Comparison Bars',
      'Franchisee Communication Feed',
      'Compliance Checklist per Site'
    ],
    dataVizStyle: 'Geospatial maps, bar rankings, heatmaps by region.',
    aiImagePrompt: "Multi-location retail management dashboard. Main feature is a map view with pins representing store locations, colored red to green based on performance. Sidebar shows a leaderboard of 'Top Performing Franchises'. Clean, logistical, operational aesthetic. Red and neutral gray color scheme. Professional, logistics software style like Uber Freight or Amazon Logistics.",
    figmaSpec: "La carte doit occuper 60% de l'écran. Les pins doivent afficher un tooltip au survol avec les KPI clés. Le leaderboard doit utiliser des médaillons (Or, Argent, Bronze) pour le top 3."
  }
];

// ============================================================================
// 3. GÉNÉRATEUR DE PROMPTS OPTIMISÉS (UTILITAIRE)
// ============================================================================

/**
 * Génère un prompt détaillé pour Midjourney v6 incluant les paramètres techniques.
 */
export function generateMidjourneyPrompt(blueprint: VisualBlueprint): string {
  return `/imagine prompt: ${blueprint.aiImagePrompt} --ar 16:9 --v 6.0 --style raw --q 2 --chaos 10`;
}

/**
 * Génère une description structurée pour un brief designer (Figma/Adobe XD).
 */
export function generateFigmaBrief(blueprint: VisualBlueprint): string {
  return `
# BRIEF DESIGN : ${blueprint.name}
## Concept
${blueprint.description}

## Palette de Couleurs
- Primaire: ${blueprint.colorPalette.primary}
- Secondaire: ${blueprint.colorPalette.secondary}
- Accent: ${blueprint.colorPalette.accent}
- Fond: ${blueprint.colorPalette.background}

## Structure de la Page
${blueprint.layoutStructure}

## Composants Clés à Designer
${blueprint.keyComponents.map(c => `- ${c}`).join('\n')}

## Style de Visualisation de Données
${blueprint.dataVizStyle}

## Spécifications Techniques
${blueprint.figmaSpec}
  `.trim();
}

// Exemple d'utilisation (à exécuter dans un environnement Node)
// ThemeVisuals.forEach(theme => {
//   console.log(`--- ${theme.name} ---`);
//   console.log(generateMidjourneyPrompt(theme));
// });
