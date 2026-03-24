/**
 * Prototype 2: Connecteur GraphRAG (Neo4j + Vector Store)
 * 
 * Stratégie :
 * 1. Indexer les connaissances dans un graphe de relations (Neo4j) en plus du vector store.
 * 2. Lors d'une requête, extraire non seulement les documents similaires (vecteurs),
 *    mais aussi les entités liées et leurs relations implicites.
 * 3. Combiner les deux contextes pour une réponse plus riche et déductive.
 * 
 * Cas d'usage : "Le produit X est-il compatible avec l'option Y ?" 
 * -> Le vecteur trouve les docs, le graphe déduit la compatibilité via les relations.
 */

import neo4j, { Driver, Session as Neo4jSession } from 'neo4j-driver';

export interface GraphRelation {
  source: string;
  target: string;
  relationship: string;
  properties: Record<string, any>;
}

export interface GraphContext {
  entities: string[];
  relations: GraphRelation[];
  summary: string;
}

export class GraphRAGConnector {
  private driver: Driver | null = null;
  private uri: string;
  private user: string;
  private password: string;

  constructor(uri: string, user: string, password: string) {
    this.uri = uri;
    this.user = user;
    this.password = password;
  }

  async connect(): Promise<void> {
    try {
      this.driver = neo4j.driver(
        this.uri,
        neo4j.auth.basic(this.user, this.password),
        { maxConnectionPoolSize: 50 }
      );
      
      // Vérification connexion
      await this.driver.verifyConnectivity();
      console.log('[GraphRAG] Connecté à Neo4j avec succès');
    } catch (error) {
      console.error('[GraphRAG] Échec connexion Neo4j', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.driver) {
      await this.driver.close();
      this.driver = null;
    }
  }

  /**
   * Requête principale pour extraire le contexte graphe lié à une question
   */
  async queryRelations(tenantId: string, question: string): Promise<string> {
    if (!this.driver) {
      return '';
    }

    const session = this.driver.session({ database: 'neo4j' });

    try {
      // 1. Extraction des entités clés de la question (via NLP simple ou LLM)
      const entities = await this.extractEntities(question);

      if (entities.length === 0) {
        return '';
      }

      // 2. Requête Cypher pour trouver les relations entre entités
      const cypherQuery = `
        MATCH (e:Entity {tenantId: $tenantId})
        WHERE e.name IN $entities
        MATCH (e)-[r:*1..2]-(related)
        RETURN e.name as source, type(r) as relation, related.name as target, properties(r) as props
        LIMIT 20
      `;

      const result = await session.run(cypherQuery, {
        tenantId,
        entities
      });

      // 3. Formatage du contexte graphe
      const relations: GraphRelation[] = result.records.map(record => ({
        source: record.get('source'),
        relationship: record.get('relation'),
        target: record.get('target'),
        properties: record.get('props')
      }));

      return this.formatGraphContext(relations, question);
    } catch (error) {
      console.error('[GraphRAG] Erreur requête Neo4j', error);
      return '';
    } finally {
      await session.close();
    }
  }

  /**
   * Extraction simplifiée d'entités (à remplacer par un vrai NER)
   */
  private async extractEntities(question: string): Promise<string[]> {
    // Heuristique simple : mots-clés en majuscule ou entre guillemets
    const quoted = question.match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, '')) || [];
    const capitalized = question.match(/\b[A-Z][a-z]+\b/g) || [];
    
    // Filtrage des mots communs
    const commonWords = ['Le', 'La', 'Les', 'Un', 'Une', 'Je', 'Vous', 'Nous'];
    const entities = [...quoted, ...capitalized].filter(e => !commonWords.includes(e));
    
    return Array.from(new Set(entities));
  }

  /**
   * Formatage du contexte graphe pour injection dans le prompt LLM
   */
  private formatGraphContext(relations: GraphRelation[], question: string): string {
    if (relations.length === 0) {
      return '';
    }

    let context = "Relations détectées dans la base de connaissances :\n";
    
    relations.forEach(rel => {
      context += `- [${rel.source}] --(${rel.relationship})--> [${rel.target}]`;
      if (rel.properties && Object.keys(rel.properties).length > 0) {
        const propsStr = Object.entries(rel.properties)
          .map(([k, v]) => `${k}=${v}`)
          .join(', ');
        context += ` {${propsStr}}`;
      }
      context += '\n';
    });

    context += `\nUtilisez ces relations pour déduire la réponse à : "${question}"`;
    
    return context;
  }

  /**
   * Indexation d'un document dans le graphe (à appeler lors de l'ingestion RAG)
   */
  async indexDocument(tenantId: string, docId: string, content: string, entities: string[]): Promise<void> {
    if (!this.driver) {
      throw new Error('Non connecté à Neo4j');
    }

    const session = this.driver.session({ database: 'neo4j' });

    try {
      // Création du noeud Document
      await session.run(`
        MERGE (d:Document {id: $docId, tenantId: $tenantId})
        SET d.content = $content, d.updatedAt = datetime()
      `, { docId, tenantId, content });

      // Création/ liaison des entités
      for (const entityName of entities) {
        await session.run(`
          MATCH (d:Document {id: $docId, tenantId: $tenantId})
          MERGE (e:Entity {name: $entityName, tenantId: $tenantId})
          MERGE (d)-[:MENTIONS]->(e)
        `, { docId, tenantId, entityName });
      }

      console.log(`[GraphRAG] Document ${docId} indexé avec ${entities.length} entités`);
    } catch (error) {
      console.error('[GraphRAG] Erreur indexation document', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  /**
   * Création d'une relation explicite entre deux entités
   */
  async createRelation(tenantId: string, source: string, target: string, relationship: string, properties?: Record<string, any>): Promise<void> {
    if (!this.driver) {
      throw new Error('Non connecté à Neo4j');
    }

    const session = this.driver.session({ database: 'neo4j' });

    try {
      const cypher = `
        MATCH (s:Entity {name: $source, tenantId: $tenantId})
        MATCH (t:Entity {name: $target, tenantId: $tenantId})
        MERGE (s)-[r:${relationship}]->(t)
        SET r += $properties, r.createdAt = datetime()
      `;

      await session.run(cypher, {
        tenantId,
        source,
        target,
        properties: properties || {}
      });

      console.log(`[GraphRAG] Relation créée : ${source}-[${relationship}]->${target}`);
    } catch (error) {
      console.error('[GraphRAG] Erreur création relation', error);
      throw error;
    } finally {
      await session.close();
    }
  }
}

// Singleton export
export const graphRagConnector = new GraphRAGConnector(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  process.env.NEO4J_USER || 'neo4j',
  process.env.NEO4J_PASSWORD || 'password'
);
