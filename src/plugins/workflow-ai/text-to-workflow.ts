/**
 * Prototype 3: Moteur Text-to-Workflow (Génération par Prompt)
 * 
 * Stratégie :
 * 1. L'utilisateur décrit un workflow en langage naturel.
 * 2. Un LLM (fine-tuné ou few-shot) traduit la description en DSL JSON exécutable.
 * 3. Validation syntaxique et sémantique du workflow généré.
 * 4. Déploiement automatique avec mode "test/simulation".
 * 
 * Exemple : "Si un client VIP se plaint, envoyer un bon de 20€ et notifier le manager."
 */

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay' | 'end';
  name: string;
  config: Record<string, any>;
  next?: string | string[]; // ID du noeud suivant ou tableau pour les branches
}

export interface WorkflowDefinition {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  version: string;
  nodes: WorkflowNode[];
  createdAt: Date;
  status: 'draft' | 'active' | 'paused';
}

export interface GenerationResult {
  success: boolean;
  workflow?: WorkflowDefinition;
  errors?: string[];
  warnings?: string[];
  explanation?: string;
}

export class TextToWorkflowEngine {
  private readonly actionLibrary: Record<string, any> = {
    send_email: { label: 'Envoyer Email', params: ['to', 'subject', 'body'] },
    send_sms: { label: 'Envoyer SMS', params: ['phone', 'message'] },
    send_whatsapp: { label: 'Envoyer WhatsApp', params: ['phone', 'message'] },
    create_ticket: { label: 'Créer Ticket', params: ['title', 'priority', 'assignee'] },
    add_tag: { label: 'Ajouter Tag', params: ['tag'] },
    remove_tag: { label: 'Supprimer Tag', params: ['tag'] },
    wait: { label: 'Attendre', params: ['duration'] },
    notify_user: { label: 'Notifier Utilisateur', params: ['userId', 'message'] },
    update_field: { label: 'Mettre à jour Champ', params: ['field', 'value'] },
    http_request: { label: 'Requête HTTP', params: ['method', 'url', 'headers', 'body'] }
  };

  private readonly triggerLibrary: Record<string, any> = {
    message_received: { label: 'Message Reçu', params: ['channel', 'keywords'] },
    user_joined: { label: 'Utilisateur Joint', params: [] },
    tag_added: { label: 'Tag Ajouté', params: ['tag'] },
    form_submitted: { label: 'Formulaire Soumis', params: ['formId'] },
    schedule: { label: 'Planifié', params: ['cron'] }
  };

  /**
   * Génération d'un workflow à partir d'un prompt utilisateur
   */
  async generateFromPrompt(
    tenantId: string,
    prompt: string,
    userId: string
  ): Promise<GenerationResult> {
    try {
      // 1. Appel au LLM pour générer la structure JSON
      const llmResponse = await this.callLLMForGeneration(prompt);

      if (!llmResponse) {
        return {
          success: false,
          errors: ["Échec de génération par le LLM"]
        };
      }

      // 2. Parsing et validation du JSON
      let parsedWorkflow: Partial<WorkflowDefinition>;
      try {
        parsedWorkflow = JSON.parse(llmResponse);
      } catch (e) {
        return {
          success: false,
          errors: ["Le workflow généré n'est pas un JSON valide"],
          explanation: "Le modèle a renvoyé un format incorrect."
        };
      }

      // 3. Validation sémantique
      const validation = this.validateWorkflow(parsedWorkflow);
      
      if (!validation.valid) {
        return {
          success: false,
          errors: validation.errors,
          warnings: validation.warnings
        };
      }

      // 4. Construction du workflow complet
      const workflow: WorkflowDefinition = {
        id: `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tenantId,
        name: parsedWorkflow.name || 'Workflow généré',
        description: parsedWorkflow.description || `Généré depuis : "${prompt}"`,
        version: '1.0.0',
        nodes: parsedWorkflow.nodes || [],
        createdAt: new Date(),
        status: 'draft' // Toujours en brouillon avant validation humaine
      };

      return {
        success: true,
        workflow,
        warnings: validation.warnings,
        explanation: "Workflow généré avec succès. Veuillez le tester avant activation."
      };
    } catch (error) {
      console.error('[TextToWorkflow] Erreur génération', error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Erreur inconnue']
      };
    }
  }

  /**
   * Simulation d'appel LLM (à remplacer par vrai appel API)
   * Dans la prod, utiliser un LLM fine-tuné sur la syntaxe des workflows
   */
  private async callLLMForGeneration(prompt: string): Promise<string> {
    // Exemple de prompt système à envoyer au LLM :
    const systemPrompt = `
      Tu es un générateur de workflows pour WhatsMaster Suite.
      Traduis la demande utilisateur en JSON respectant strictement ce schéma :
      
      {
        "name": "Nom du workflow",
        "description": "Description courte",
        "nodes": [
          {
            "id": "unique_id",
            "type": "trigger|condition|action|delay|end",
            "name": "Nom lisible",
            "config": { ...params spécifiques ... },
            "next": "id_du_noeud_suivant" ou ["id_branche_1", "id_branche_2"]
          }
        ]
      }
      
      Actions disponibles : ${Object.keys(this.actionLibrary).join(', ')}
      Triggers disponibles : ${Object.keys(this.triggerLibrary).join(', ')}
      
      Réponds UNIQUEMENT avec le JSON, sans texte autour.
    `;

    // Simulation de réponse LLM pour l'exemple
    // En production : appel à OpenAI/Anthropic avec few-shot examples
    return this.simulateLLMResponse(prompt);
  }

  /**
   * Simulation de réponse LLM basée sur des patterns simples
   */
  private simulateLLMResponse(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();

    // Pattern: VIP + complaint -> discount + notify
    if (lowerPrompt.includes('vip') && (lowerPrompt.includes('plaint') || lowerPrompt.includes('fâché'))) {
      return JSON.stringify({
        name: "Gestion Plaintes VIP",
        description: "Automatisation pour les clients VIP mécontents",
        nodes: [
          {
            id: "start",
            type: "trigger",
            name: "Message Reçu",
            config: { channel: "whatsapp", keywords: ["problème", "mécontent", "erreur"] },
            next: "check_vip"
          },
          {
            id: "check_vip",
            type: "condition",
            name: "Est VIP ?",
            config: { field: "customer.tier", operator: "equals", value: "vip" },
            next: { "true": "send_voucher", "false": "end" }
          },
          {
            id: "send_voucher",
            type: "action",
            name: "Envoyer Bon 20€",
            config: { type: "send_whatsapp", message: "Voici un bon de 20€ pour nous excuser." },
            next: "notify_manager"
          },
          {
            id: "notify_manager",
            type: "action",
            name: "Notifier Manager",
            config: { type: "notify_user", userId: "manager_01", message: "Un VIP a reçu un bon suite à une plainte." },
            next: "end"
          },
          {
            id: "end",
            type: "end",
            name: "Fin",
            config: {}
          }
        ]
      });
    }

    // Pattern générique
    return JSON.stringify({
      name: "Workflow Généré",
      description: "Workflow auto-généré",
      nodes: [
        {
          id: "start",
          type: "trigger",
          name: "Déclencheur",
          config: {},
          next: "action_1"
        },
        {
          id: "action_1",
          type: "action",
          name: "Action Automatique",
          config: { type: "send_email", to: "user@example.com", subject: "Notification", body: "Bonjour" },
          next: "end"
        },
        {
          id: "end",
          type: "end",
          name: "Fin",
          config: {}
        }
      ]
    });
  }

  /**
   * Validation syntaxique et sémantique du workflow
   */
  private validateWorkflow(workflow: Partial<WorkflowDefinition>): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!workflow.nodes || workflow.nodes.length === 0) {
      errors.push("Le workflow doit contenir au moins un noeud");
      return { valid: false, errors, warnings };
    }

    const nodeIds = new Set<string>();
    let hasTrigger = false;
    let hasEnd = false;

    for (const node of workflow.nodes!) {
      // Vérification unicité IDs
      if (nodeIds.has(node.id)) {
        errors.push(`ID de noeud dupliqué : ${node.id}`);
      }
      nodeIds.add(node.id);

      // Vérification type
      if (!['trigger', 'condition', 'action', 'delay', 'end'].includes(node.type)) {
        errors.push(`Type invalide pour le noeud ${node.id}: ${node.type}`);
      }

      if (node.type === 'trigger') hasTrigger = true;
      if (node.type === 'end') hasEnd = true;

      // Vérification config requise
      if (node.type === 'action' && !node.config?.type) {
        errors.push(`Noeud action ${node.id} manque le type d'action`);
      }

      // Vérification correspondance avec librairie
      if (node.type === 'action' && node.config?.type && !this.actionLibrary[node.config.type]) {
        warnings.push(`Action inconnue : ${node.config.type}. Sera ignorée.`);
      }
    }

    if (!hasTrigger) {
      errors.push("Le workflow doit avoir un noeud de type 'trigger'");
    }

    if (!hasEnd) {
      warnings.push("Le workflow n'a pas de noeud 'end'. Ajoutez-en un pour une meilleure clarté.");
    }

    // Vérification connectivité (simplifiée)
    const reachable = this.checkConnectivity(workflow.nodes!);
    if (!reachable) {
      warnings.push("Certains noeuds semblent isolés et ne seront jamais atteints.");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Vérification basique de connectivité des noeuds
   */
  private checkConnectivity(nodes: WorkflowNode[]): boolean {
    // Implémentation simplifiée : vérifier que chaque noeud (sauf end) a un 'next'
    for (const node of nodes) {
      if (node.type !== 'end' && !node.next) {
        return false;
      }
    }
    return true;
  }

  /**
   * Exécution d'un workflow (moteur runtime simplifié)
   */
  async executeWorkflow(workflow: WorkflowDefinition, context: Record<string, any>): Promise<void> {
    console.log(`[Workflow] Exécution de ${workflow.name} avec contexte:`, context);
    
    let currentNodeId = workflow.nodes.find(n => n.type === 'trigger')?.id;
    
    while (currentNodeId) {
      const node = workflow.nodes.find(n => n.id === currentNodeId);
      if (!node) break;

      console.log(`[Workflow] Exécution noeud: ${node.name} (${node.type})`);

      // Exécution logique selon type
      if (node.type === 'action') {
        await this.executeAction(node, context);
      } else if (node.type === 'condition') {
        const result = await this.evaluateCondition(node, context);
        if (typeof node.next === 'object' && !Array.isArray(node.next)) {
          currentNodeId = node.next[result.toString()] as string;
          continue;
        }
      } else if (node.type === 'delay') {
        const ms = node.config.duration || 1000;
        await new Promise(resolve => setTimeout(resolve, ms));
      }

      // Navigation vers prochain noeud
      if (typeof node.next === 'string') {
        currentNodeId = node.next;
      } else if (Array.isArray(node.next)) {
        // Branchement parallèle (non implémenté dans cette version simple)
        console.warn('[Workflow] Branchement parallèle non supporté');
        currentNodeId = node.next[0];
      } else {
        currentNodeId = undefined;
      }
    }

    console.log(`[Workflow] Terminé: ${workflow.name}`);
  }

  private async executeAction(node: WorkflowNode, context: Record<string, any>): Promise<void> {
    // Simulation d'exécution d'action
    console.log(`[Action] ${node.config.type}:`, node.config);
    // Ici, appeler les vrais services (email, sms, webhook, etc.)
  }

  private async evaluateCondition(node: WorkflowNode, context: Record<string, any>): Promise<boolean> {
    const { field, operator, value } = node.config;
    const actualValue = this.getNestedValue(context, field);

    switch (operator) {
      case 'equals': return actualValue === value;
      case 'contains': return String(actualValue).includes(value);
      case 'greater': return Number(actualValue) > Number(value);
      default: return false;
    }
  }

  private getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }
}

// Singleton export
export const textToWorkflow = new TextToWorkflowEngine();
