# 🚀 Prototypes Avancés WhatsMaster Suite

Ce dossier contient les 4 prototypes d'améliorations intelligentes basés sur les dernières tendances du marché (Edge AI, GraphRAG, Text-to-Workflow, FinOps).

## 📁 Structure des Prototypes

```
src/plugins/
├── ai-rag-agent/
│   └── hybrid-engine.ts        # Prototype 1: RAG Hybride (ONNX Edge + Cloud)
├── graph-rag/
│   └── connector.ts            # Prototype 2: Connecteur Neo4j GraphRAG
├── workflow-ai/
│   └── text-to-workflow.ts     # Prototype 3: Génération de workflows par prompt
└── finops-dashboard/
    └── tracker.ts              # Prototype 4: Tracking FinOps & coûts par requête
```

---

## 🔍 Détail des Prototypes

### 1. Moteur RAG Hybride (`hybrid-engine.ts`)

**Objectif** : Réduire les coûts LLM de 70% et la latence à <200ms pour 80% des requêtes.

**Fonctionnement** :
1. **Classification locale** avec modèle ONNX léger (Phi-3, DistilBERT)
2. **Cache sémantique** Redis pour réponses fréquentes
3. **Routage intelligent** :
   - Requêtes simples → Réponse locale immédiate
   - Requêtes complexes → Fallback Cloud + RAG complet
4. **Intégration GraphRAG** pour contexte relationnel enrichi

**Installation** :
```bash
npm install onnxruntime-node ioredis
```

**Configuration** :
```typescript
import { hybridRAG } from './src/plugins/ai-rag-agent/hybrid-engine';

await hybridRAG.initialize('./models/intent-classifier.onnx');

// Utilisation
const response = await hybridRAG.processMessage(
  'tenant_123',
  'Comment réinitialiser mon mot de passe ?',
  ['Historique message 1', 'Historique message 2']
);
```

**Gains attendus** :
- ✅ -70% coûts API LLM
- ✅ Latence moyenne : 180ms vs 2500ms (cloud seul)
- ✅ 85% des requêtes traitées localement

---

### 2. Connecteur GraphRAG (`connector.ts`)

**Objectif** : Améliorer la pertinence des réponses RAG en exploitant les relations entre entités.

**Fonctionnement** :
1. **Double indexation** : Vector Store (similarité) + Neo4j (relations)
2. **Extraction d'entités** depuis la question utilisateur
3. **Requête Cypher** pour trouver relations implicites
4. **Contexte enrichi** injecté dans le prompt LLM

**Prérequis** :
```bash
npm install neo4j-driver
docker run -p 7687:7687 -p 7474:7474 \
  -e NEO4J_AUTH=neo4j/password \
  neo4j:latest
```

**Configuration** :
```typescript
import { graphRagConnector } from './src/plugins/graph-rag/connector';

await graphRagConnector.connect();

// Indexation d'un document
await graphRagConnector.indexDocument(
  'tenant_123',
  'doc_001',
  'Le produit X est compatible avec Y mais pas avec Z.',
  ['Produit X', 'Option Y', 'Option Z']
);

// Création relation explicite
await graphRagConnector.createRelation(
  'tenant_123',
  'Produit X',
  'Option Y',
  'COMPATIBLE_AVEC',
  { since: '2024-01-01' }
);

// Requête contextuelle
const context = await graphRagConnector.queryRelations(
  'tenant_123',
  'Le produit X fonctionne-t-il avec Y ?'
);
```

**Cas d'usage** :
- Questions de compatibilité produit
- Relations hiérarchiques (organisation, catégories)
- Déduction logique ("Si A→B et B→C, alors A→C")

---

### 3. Moteur Text-to-Workflow (`text-to-workflow.ts`)

**Objectif** : Permettre aux utilisateurs non techniques de créer des automatisations complexes par simple description textuelle.

**Fonctionnement** :
1. **Prompt utilisateur** en langage naturel
2. **Génération LLM** vers DSL JSON structuré
3. **Validation syntaxique et sémantique**
4. **Mode brouillon** avec test/simulation avant activation

**Exemple d'utilisation** :
```typescript
import { textToWorkflow } from './src/plugins/workflow-ai/text-to-workflow';

const result = await textToWorkflow.generateFromPrompt(
  'tenant_123',
  'Si un client VIP se plaint, envoyer un bon de 20€ et notifier le manager',
  'user_456'
);

if (result.success && result.workflow) {
  console.log('Workflow généré :', result.workflow.name);
  console.log('Noeuds créés :', result.workflow.nodes.length);
  
  // Test du workflow
  await textToWorkflow.executeWorkflow(result.workflow, {
    customer: { tier: 'vip', name: 'Jean Dupont' },
    message: 'Je suis mécontent de votre service !'
  });
} else {
  console.error('Erreurs :', result.errors);
}
```

**Actions supportées** :
- `send_email`, `send_sms`, `send_whatsapp`
- `create_ticket`, `add_tag`, `notify_user`
- `wait`, `update_field`, `http_request`

**Triggers disponibles** :
- `message_received`, `user_joined`, `tag_added`
- `form_submitted`, `schedule` (cron)

---

### 4. Dashboard FinOps (`tracker.ts`)

**Objectif** : Visibilité totale sur les coûts par conversation, campagne et tenant, avec alertes prédictives.

**Fonctionnement** :
1. **Tagging automatique** de chaque appel API (LLM, SMS, Email, WhatsApp)
2. **Calcul temps réel** basé sur des taux configurables
3. **Agrégation multi-dimensionnelle** (par jour, service, conversation, campagne)
4. **Alertes prédictives** de dépassement budget
5. **Recommandations d'optimisation** basées sur l'IA

**Installation** :
```typescript
import { finOpsTracker, createFinOpsMiddleware } from './src/plugins/finops-dashboard/tracker';

// Configuration budgets
finOpsTracker.setBudget('tenant_123', 500); // $500/mois

// Middleware Express pour tracking auto
app.use(createFinOpsMiddleware());

// Tracking manuel si nécessaire
await finOpsTracker.trackAPICall({
  tenantId: 'tenant_123',
  conversationId: 'conv_789',
  serviceType: 'llm',
  operation: 'chat_completion_output',
  quantity: 150, // tokens
  metadata: { model: 'gpt-4-turbo' }
});
```

**Dashboard API** :
```typescript
// Coût total par tenant
const breakdown = await finOpsTracker.getCostBreakdown('tenant_123', 30);
console.log('Dépenses 30 jours :', breakdown.total);
console.log('Par service :', breakdown.byService);
console.log('Par conversation :', breakdown.byConversation);

// Coût d'une conversation spécifique
const convCost = await finOpsTracker.getConversationCost('conv_789');

// Recommandations d'optimisation
const recommendations = await finOpsTracker.getOptimizationRecommendations('tenant_123');
console.log(recommendations);
// Ex: "70% de vos coûts viennent des appels LLM. Activez le cache sémantique..."

// Export CSV pour reporting
const csv = finOpsTracker.exportToCSV('tenant_123', 30);
```

**Gains attendus** :
- ✅ Identification des conversations/campagnes non rentables
- ✅ Alertes avant dépassement budget (75%, 90%)
- ✅ Réduction moyenne de 25% des coûts via recommandations

---

## 🔗 Intégration Complète

Pour une expérience optimale, combinez les 4 prototypes :

```typescript
import { hybridRAG } from './ai-rag-agent/hybrid-engine';
import { graphRagConnector } from './graph-rag/connector';
import { textToWorkflow } from './workflow-ai/text-to-workflow';
import { finOpsTracker } from './finops-dashboard/tracker';

// Initialisation au démarrage
async function initializePlugins() {
  await hybridRAG.initialize('./models/intent.onnx');
  await graphRagConnector.connect();
  
  finOpsTracker.setBudget('tenant_123', 1000);
  console.log('✅ Plugins avancés initialisés');
}

// Exemple : Conversation enrichie avec tracking FinOps
async function handleCustomerMessage(tenantId: string, conversationId: string, message: string) {
  // 1. Traitement RAG hybride
  const response = await hybridRAG.processMessage(tenantId, message);
  
  // 2. Tracking coût
  await finOpsTracker.trackAPICall({
    tenantId,
    conversationId,
    serviceType: 'llm',
    operation: 'response_generation',
    quantity: 200,
    metadata: { responseLength: response.length }
  });
  
  // 3. Vérification si workflow déclenché
  const workflowResult = await textToWorkflow.generateFromPrompt(
    tenantId,
    `Créer un workflow pour : ${message}`,
    'system'
  );
  
  return { response, workflowGenerated: workflowResult.success };
}
```

---

## 📊 Métriques de Performance Attendues

| KPI | Avant | Après Prototypes | Gain |
|-----|-------|------------------|------|
| Coût moyen par conversation | $0.15 | $0.05 | -67% |
| Latence réponse IA | 2500ms | 180ms (80% cas) | -93% |
| Temps création automation | 45 min | 2 min | -96% |
| Visibilité coûts | 0% | 100% | +100% |
| Dépassements budget | Fréquents | Alertes prédictives | -90% |

---

## 🛠️ Prochaines Étapes

1. **Tests de charge** : Valider performance avec 10K requêtes simultanées
2. **Fine-tuning LLM** : Entraîner un modèle spécialisé sur la syntaxe workflow
3. **Dashboard UI** : Créer interface React pour visualisation FinOps
4. **Production Ready** : Ajouter persistance MongoDB, queue RabbitMQ
5. **Documentation API** : Générer Swagger/OpenAPI pour tous endpoints

---

## 📞 Support & Contribution

Pour toute question ou amélioration :
- Consulter la documentation complète dans `AMÉLIORATIONS-SUPPLÉMENTAIRES.md`
- Ouvrir une issue GitHub avec le tag `prototype`
- Contacter l'équipe R&D WhatsMaster

**Version** : 1.0.0-alpha  
**Dernière mise à jour** : 2024  
**Statut** : Prototype de production
