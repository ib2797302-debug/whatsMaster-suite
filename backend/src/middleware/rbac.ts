/**
 * Système RBAC (Role-Based Access Control) pour WhatsMaster Suite
 * Gestion fine des permissions par rôle et ressource
 */

export enum Permission {
  // Utilisateurs
  USERS_READ = 'users:read',
  USERS_CREATE = 'users:create',
  USERS_UPDATE = 'users:update',
  USERS_DELETE = 'users:delete',
  
  // Contacts
  CONTACTS_READ = 'contacts:read',
  CONTACTS_CREATE = 'contacts:create',
  CONTACTS_UPDATE = 'contacts:update',
  CONTACTS_DELETE = 'contacts:delete',
  CONTACTS_EXPORT = 'contacts:export',
  CONTACTS_IMPORT = 'contacts:import',
  
  // Conversations
  CONVERSATIONS_READ = 'conversations:read',
  CONVERSATIONS_WRITE = 'conversations:write',
  CONVERSATIONS_DELETE = 'conversations:delete',
  CONVERSATIONS_ASSIGN = 'conversations:assign',
  
  // Campagnes
  CAMPAIGNS_READ = 'campaigns:read',
  CAMPAIGNS_CREATE = 'campaigns:create',
  CAMPAIGNS_UPDATE = 'campaigns:update',
  CAMPAIGNS_DELETE = 'campaigns:delete',
  CAMPAIGNS_SEND = 'campaigns:send',
  CAMPAIGNS_SCHEDULE = 'campaigns:schedule',
  
  // Automatisation
  AUTOMATIONS_READ = 'automations:read',
  AUTOMATIONS_CREATE = 'automations:create',
  AUTOMATIONS_UPDATE = 'automations:update',
  AUTOMATIONS_DELETE = 'automations:delete',
  
  // Analytics
  ANALYTICS_READ = 'analytics:read',
  ANALYTICS_EXPORT = 'analytics:export',
  
  // Paramètres
  SETTINGS_READ = 'settings:read',
  SETTINGS_UPDATE = 'settings:update',
  
  // Paiements
  PAYMENTS_READ = 'payments:read',
  PAYMENTS_CREATE = 'payments:create',
  
  // Audit Logs
  AUDIT_LOGS_READ = 'audit-logs:read',
  
  // Marketplace
  MARKETPLACE_READ = 'marketplace:read',
  MARKETPLACE_PURCHASE = 'marketplace:purchase',
  MARKETPLACE_INSTALL = 'marketplace:install',
  
  // Administration
  ADMIN_ACCESS = 'admin:access',
  TENANT_MANAGE = 'tenant:manage',
  ROLE_MANAGE = 'role:manage',
}

export enum RoleType {
  SUPER_ADMIN = 'super_admin',      // Accès complet à tous les tenants
  ADMIN = 'admin',                  // Admin du tenant
  MANAGER = 'manager',              // Gestionnaire d'équipe
  AGENT = 'agent',                  // Agent de support
  VIEWER = 'viewer',                // Lecture seule
  CUSTOM = 'custom',                // Rôle personnalisé
}

export interface Role {
  id: string;
  name: string;
  description: string;
  type: RoleType;
  permissions: Permission[];
  isSystem?: boolean; // true si rôle système (non supprimable)
  createdAt: Date;
  updatedAt: Date;
}

// Rôles prédéfinis avec leurs permissions
export const DEFAULT_ROLES: Record<RoleType, Omit<Role, 'id' | 'createdAt' | 'updatedAt'>> = {
  [RoleType.SUPER_ADMIN]: {
    name: 'Super Administrateur',
    description: 'Accès complet à tous les tenants et fonctionnalités',
    type: RoleType.SUPER_ADMIN,
    permissions: Object.values(Permission),
    isSystem: true,
  },
  
  [RoleType.ADMIN]: {
    name: 'Administrateur',
    description: 'Gestion complète du tenant',
    type: RoleType.ADMIN,
    permissions: [
      Permission.USERS_READ, Permission.USERS_CREATE, Permission.USERS_UPDATE, Permission.USERS_DELETE,
      Permission.CONTACTS_READ, Permission.CONTACTS_CREATE, Permission.CONTACTS_UPDATE, Permission.CONTACTS_DELETE,
      Permission.CONTACTS_EXPORT, Permission.CONTACTS_IMPORT,
      Permission.CONVERSATIONS_READ, Permission.CONVERSATIONS_WRITE, Permission.CONVERSATIONS_DELETE,
      Permission.CONVERSATIONS_ASSIGN,
      Permission.CAMPAIGNS_READ, Permission.CAMPAIGNS_CREATE, Permission.CAMPAIGNS_UPDATE, Permission.CAMPAIGNS_DELETE,
      Permission.CAMPAIGNS_SEND, Permission.CAMPAIGNS_SCHEDULE,
      Permission.AUTOMATIONS_READ, Permission.AUTOMATIONS_CREATE, Permission.AUTOMATIONS_UPDATE, Permission.AUTOMATIONS_DELETE,
      Permission.ANALYTICS_READ, Permission.ANALYTICS_EXPORT,
      Permission.SETTINGS_READ, Permission.SETTINGS_UPDATE,
      Permission.PAYMENTS_READ,
      Permission.AUDIT_LOGS_READ,
      Permission.MARKETPLACE_READ, Permission.MARKETPLACE_PURCHASE, Permission.MARKETPLACE_INSTALL,
      Permission.ROLE_MANAGE,
    ],
    isSystem: true,
  },
  
  [RoleType.MANAGER]: {
    name: 'Manager',
    description: 'Gestion d\'équipe et des campagnes',
    type: RoleType.MANAGER,
    permissions: [
      Permission.USERS_READ,
      Permission.CONTACTS_READ, Permission.CONTACTS_CREATE, Permission.CONTACTS_UPDATE,
      Permission.CONVERSATIONS_READ, Permission.CONVERSATIONS_WRITE,
      Permission.CONVERSATIONS_ASSIGN,
      Permission.CAMPAIGNS_READ, Permission.CAMPAIGNS_CREATE, Permission.CAMPAIGNS_UPDATE,
      Permission.CAMPAIGNS_SEND, Permission.CAMPAIGNS_SCHEDULE,
      Permission.AUTOMATIONS_READ, Permission.AUTOMATIONS_CREATE, Permission.AUTOMATIONS_UPDATE,
      Permission.ANALYTICS_READ,
      Permission.SETTINGS_READ,
    ],
    isSystem: true,
  },
  
  [RoleType.AGENT]: {
    name: 'Agent',
    description: 'Gestion des conversations et contacts',
    type: RoleType.AGENT,
    permissions: [
      Permission.CONTACTS_READ, Permission.CONTACTS_CREATE, Permission.CONTACTS_UPDATE,
      Permission.CONVERSATIONS_READ, Permission.CONVERSATIONS_WRITE,
      Permission.CAMPAIGNS_READ,
      Permission.AUTOMATIONS_READ,
    ],
    isSystem: true,
  },
  
  [RoleType.VIEWER]: {
    name: 'Observateur',
    description: 'Lecture seule',
    type: RoleType.VIEWER,
    permissions: [
      Permission.CONTACTS_READ,
      Permission.CONVERSATIONS_READ,
      Permission.CAMPAIGNS_READ,
      Permission.AUTOMATIONS_READ,
      Permission.ANALYTICS_READ,
      Permission.SETTINGS_READ,
    ],
    isSystem: true,
  },
  
  [RoleType.CUSTOM]: {
    name: 'Rôle Personnalisé',
    description: 'Rôle avec permissions personnalisées',
    type: RoleType.CUSTOM,
    permissions: [],
    isSystem: false,
  },
};

/**
 * Vérifie si un rôle a une permission spécifique
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return role.permissions.includes(permission);
}

/**
 * Vérifie si un rôle a plusieurs permissions (AND logic)
 */
export function hasPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => role.permissions.includes(permission));
}

/**
 * Vérifie si un rôle a au moins une des permissions (OR logic)
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => role.permissions.includes(permission));
}

/**
 * Crée un rôle personnalisé
 */
export function createCustomRole(
  name: string,
  description: string,
  permissions: Permission[]
): Role {
  return {
    id: crypto.randomUUID(),
    name,
    description,
    type: RoleType.CUSTOM,
    permissions,
    isSystem: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Middleware pour vérifier les permissions
 * À utiliser dans les routes Express
 */
export function requirePermission(...permissions: Permission[]) {
  return (req: any, res: any, next: any) => {
    const user = req.user;
    
    if (!user || !user.role) {
      return res.status(401).json({
        success: false,
        error: 'Utilisateur non authentifié',
      });
    }
    
    const role = user.role as Role;
    
    // Super admin a toujours accès
    if (role.type === RoleType.SUPER_ADMIN) {
      return next();
    }
    
    // Vérifier les permissions
    if (!hasPermissions(role, permissions)) {
      return res.status(403).json({
        success: false,
        error: 'Permissions insuffisantes',
        required: permissions,
      });
    }
    
    next();
  };
}

/**
 * Middleware pour vérifier le type de rôle
 */
export function requireRole(...roles: RoleType[]) {
  return (req: any, res: any, next: any) => {
    const user = req.user;
    
    if (!user || !user.role) {
      return res.status(401).json({
        success: false,
        error: 'Utilisateur non authentifié',
      });
    }
    
    const role = user.role as Role;
    
    if (!roles.includes(role.type)) {
      return res.status(403).json({
        success: false,
        error: 'Rôle non autorisé',
        required: roles,
      });
    }
    
    next();
  };
}

export default {
  Permission,
  RoleType,
  DEFAULT_ROLES,
  hasPermission,
  hasPermissions,
  hasAnyPermission,
  createCustomRole,
  requirePermission,
  requireRole,
};
