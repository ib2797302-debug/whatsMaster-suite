/**
 * LIVING MEMORY ENGINE - IMPLEMENTATION
 * 
 * Moteur de mémoire cognitive combinant GraphRAG, vecteurs et profils bio-émotionnels.
 * Crée un jumeau numérique cognitif pour chaque utilisateur.
 */

import {
  CognitiveMemoryNode,
  LivingMemoryContext,
  BioSignature,
  DataResidencyZone
} from '../types/autonomous-os';

export class LivingMemoryEngine {
  private memoryStore: Map<string, CognitiveMemoryNode[]>;
  private bioProfiles: Map<string, BioSignature>;
  private vectorIndex: VectorIndexService;
  private graphStore: GraphRAGService;
  private dataResidency: DataResidencyZone;

  constructor(config: { 
    vectorDimension: number; 
    dataResidency: DataResidencyZone;
    bioIntegrationEnabled: boolean;
  }) {
    this.memoryStore = new Map();
    this.bioProfiles = new Map();
    this.vectorIndex = new VectorIndexService(config.vectorDimension);
    this.graphStore = new GraphRAGService();
    this.dataResidency = config.dataResidency;
    
    console.log(`[MEMORY] Living Memory Engine initialized in ${dataResidency}`);
  }

  /**
   * Récupère le contexte mémoire complet d'un utilisateur
   * Combine mémoire court terme, long terme, état bio et connaissances GraphRAG
   */
  async getLivingContext(userId: string): Promise<LivingMemoryContext> {
    const userMemories = this.memoryStore.get(userId) || [];
    
    // Séparation court terme / long terme
    const shortTerm = userMemories
      .filter(m => m.type === 'episodic')
      .sort((a, b) => b.id.localeCompare(a.id)) // Plus récent en premier
      .slice(0, 10); // Fenêtre des 10 derniers souvenirs

    // Génération du résumé long terme
    const longTermSummary = await this.generateLongTermSummary(userMemories);

    // Récupération de l'état bio
    const bioState = this.bioProfiles.get(userId) || this.getDefaultBioSignature();

    // Requêtage GraphRAG pour connaissances pertinentes
    const retrievedKnowledge = await this.graphStore.retrieveRelevant(userId, shortTerm);

    // Calcul de la trajectoire émotionnelle
    const emotionalTrajectory = this.calculateEmotionalTrajectory(shortTerm, bioState);

    return {
      userId,
      shortTerm,
      longTermSummary,
      bioState,
      retrievedKnowledge,
      emotionalTrajectory
    };
  }

  /**
   * Stocke un nouveau nœud de mémoire
   * Indexe automatiquement dans le vecteur et le graphe
   */
  async storeMemory(node: CognitiveMemoryNode): Promise<void> {
    const userId = node.ownerId;
    
    // Validation de la résidence des données
    if (!this.isDataResidencyCompliant(userId)) {
      throw new Error(`Data residency violation for user ${userId}`);
    }

    // Initialisation du store utilisateur si nécessaire
    if (!this.memoryStore.has(userId)) {
      this.memoryStore.set(userId, []);
    }

    // Indexation vectorielle
    await this.vectorIndex.insert(node.id, node.vectorEmbedding);

    // Insertion dans le graphe de connaissances
    if (node.graphRelations.length > 0) {
      await this.graphStore.addNode(node);
    }

    // Ajout au store local
    const userMemories = this.memoryStore.get(userId)!;
    userMemories.push(node);

    // Application du taux de décroissance (oubli progressif)
    await this.applyDecay(userId);

    console.log(`[MEMORY] Stored ${node.type} memory for user ${userId}`);
  }

  /**
   * Met à jour la signature bio d'un utilisateur
   * Nécessite un consentement explicite
   */
  async updateBioSignature(
    userId: string, 
    updates: Partial<BioSignature>,
    consentVersion: string
  ): Promise<void> {
    const current = this.bioProfiles.get(userId) || this.getDefaultBioSignature();
    
    // Vérification de version de consentement
    if (consentVersion !== current.consentVersion && consentVersion !== 'explicit_v2') {
      throw new Error('Consent version mismatch. Explicit consent required.');
    }

    const updated: BioSignature = {
      ...current,
      ...updates,
      lastUpdated: Date.now(),
      consentVersion
    };

    this.bioProfiles.set(userId, updated);
    console.log(`[MEMORY] Updated bio signature for user ${userId}`);
  }

  /**
   * Recherche sémantique dans la mémoire d'un utilisateur
   */
  async semanticSearch(
    userId: string, 
    queryVector: number[], 
    limit: number = 5
  ): Promise<CognitiveMemoryNode[]> {
    const userMemories = this.memoryStore.get(userId) || [];
    
    // Recherche des voisins les plus proches
    const nearestIds = await this.vectorIndex.search(queryVector, limit * 2);
    
    // Filtrage et correspondance avec les mémoires utilisateur
    const results = userMemories
      .filter(m => nearestIds.includes(m.id))
      .slice(0, limit);

    return results;
  }

  /**
   * Nettoie les mémoires expirées selon le decayRate
   */
  async applyDecay(userId: string): Promise<void> {
    const userMemories = this.memoryStore.get(userId) || [];
    const now = Date.now();
    
    const survivingMemories = userMemories.filter(memory => {
      // Calcul de l'âge relatif et application du decay
      const ageFactor = (now - parseInt(memory.id.split('-')[1] || '0')) / (1000 * 60 * 60 * 24); // jours
      const survivalProbability = Math.exp(-memory.decayRate * ageFactor);
      
      return Math.random() < survivalProbability;
    });

    if (survivingMemories.length < userMemories.length) {
      this.memoryStore.set(userId, survivingMemories);
      console.log(`[MEMORY] Decay applied: ${userMemories.length - survivingMemories.length} memories forgotten for ${userId}`);
    }
  }

  // Helpers privés
  private getDefaultBioSignature(): BioSignature {
    return {
      cognitiveStyle: 'pragmatic',
      emotionalBaseline: { valence: 0, arousal: 0.5 },
      communicationPreferences: {
        verbosity: 'medium',
        preferredChannels: ['whatsapp'],
        responseTimeExpectation: 'fast'
      },
      values: [],
      lastUpdated: Date.now(),
      consentVersion: 'explicit_v2'
    };
  }

  private async generateLongTermSummary(memories: CognitiveMemoryNode[]): Promise<string> {
    if (memories.length === 0) return '';
    
    // En production: appel à un LLM pour générer un résumé cohérent
    const episodicCount = memories.filter(m => m.type === 'episodic').length;
    const semanticCount = memories.filter(m => m.type === 'semantic').length;
    
    return `User has ${episodicCount} episodic and ${semanticCount} semantic memories stored.`;
  }

  private calculateEmotionalTrajectory(
    shortTerm: CognitiveMemoryNode[], 
    bioState: BioSignature
  ): number[] {
    // Extraction de la valence émotionnelle des souvenirs récents
    return shortTerm.map(memory => {
      // Simulation: en production, analyser le contenu avec un modèle d'émotion
      return bioState.emotionalBaseline.valence + (Math.random() - 0.5) * 0.3;
    });
  }

  private isDataResidencyCompliant(userId: string): boolean {
    // Vérification que l'utilisateur est bien dans la zone de résidence configurée
    // En production: vérification contre une base de données de localisation
    return true;
  }
}

/**
 * Service d'indexation vectorielle (simplifié)
 * En production: utiliser FAISS, Pinecone, ou Weaviate
 */
class VectorIndexService {
  private dimension: number;
  private index: Map<string, number[]>;

  constructor(dimension: number) {
    this.dimension = dimension;
    this.index = new Map();
  }

  async insert(id: string, vector: number[]): Promise<void> {
    if (vector.length !== this.dimension) {
      throw new Error(`Vector dimension mismatch: expected ${this.dimension}, got ${vector.length}`);
    }
    this.index.set(id, vector);
  }

  async search(queryVector: number[], limit: number): Promise<string[]> {
    // Recherche par similarité cosinus (simplifiée)
    const scores: Array<{ id: string; score: number }> = [];

    for (const [id, vector] of this.index.entries()) {
      const score = this.cosineSimilarity(queryVector, vector);
      scores.push({ id, score });
    }

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.id);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

/**
 * Service GraphRAG (simplifié)
 * En production: utiliser Neo4j, Amazon Neptune, ou TigerGraph
 */
class GraphRAGService {
  private nodes: Map<string, CognitiveMemoryNode>;
  private edges: Map<string, Set<string>>;

  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
  }

  async addNode(node: CognitiveMemoryNode): Promise<void> {
    this.nodes.set(node.id, node);

    // Création des arêtes
    for (const relation of node.graphRelations) {
      if (!this.edges.has(relation)) {
        this.edges.set(relation, new Set());
      }
      this.edges.get(relation)!.add(node.id);

      if (!this.edges.has(node.id)) {
        this.edges.set(node.id, new Set());
      }
      this.edges.get(node.id)!.add(relation);
    }
  }

  async retrieveRelevant(
    userId: string, 
    contextNodes: CognitiveMemoryNode[]
  ): Promise<any[]> {
    // Récupération des nœuds connectés dans le graphe
    const relevantIds = new Set<string>();

    for (const node of contextNodes) {
      const connections = this.edges.get(node.id);
      if (connections) {
        for (const connectedId of connections) {
          relevantIds.add(connectedId);
        }
      }
    }

    // Retour des nœuds pertinents (excluant ceux déjà dans le contexte)
    const contextIds = new Set(contextNodes.map(n => n.id));
    const results: any[] = [];

    for (const id of relevantIds) {
      if (!contextIds.has(id)) {
        const node = this.nodes.get(id);
        if (node && node.ownerId === userId) {
          results.push({ id, content: node.content, type: node.type });
        }
      }
    }

    return results.slice(0, 10);
  }
}
