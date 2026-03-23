/**
 * Système d'Audit Logs pour WhatsMaster Suite
 * Journalisation de toutes les actions sensibles
 */

import { Types, Document } from 'mongoose';

export enum AuditAction {
  // Authentification
  LOGIN = 'auth.login',
  LOGOUT = 'auth.logout',
  PASSWORD_CHANGE = 'auth.password_change',
  PASSWORD_RESET = 'auth.password_reset',
  TWO_FACTOR_ENABLE = 'auth.2fa_enable',
  TWO_FACTOR_DISABLE = 'auth.2fa_disable',
  
  // Utilisateurs
  USER_CREATE = 'user.create',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete',
  USER_ROLE_CHANGE = 'user.role_change',
  
  // Contacts
  CONTACT_CREATE = 'contact.create',
  CONTACT_UPDATE = 'contact.update',
  CONTACT_DELETE = 'contact.delete',
  CONTACT_IMPORT = 'contact.import',
  CONTACT_EXPORT = 'contact.export',
  
  // Conversations
  CONVERSATION_ASSIGN = 'conversation.assign',
  CONVERSATION_UNASSIGN = 'conversation.unassign',
  CONVERSATION_STATUS_CHANGE = 'conversation.status_change',
  MESSAGE_SEND = 'message.send',
  MESSAGE_DELETE = 'message.delete',
  
  // Campagnes
  CAMPAIGN_CREATE = 'campaign.create',
  CAMPAIGN_UPDATE = 'campaign.update',
  CAMPAIGN_DELETE = 'campaign.delete',
  CAMPAIGN_SEND = 'campaign.send',
  CAMPAIGN_SCHEDULE = 'campaign.schedule',
  CAMPAIGN_CANCEL = 'campaign.cancel',
  
  // Paramètres
  SETTINGS_UPDATE = 'settings.update',
  INTEGRATION_ADD = 'integration.add',
  INTEGRATION_REMOVE = 'integration.remove',
  WEBHOOK_CONFIGURE = 'webhook.configure',
  
  // Paiements
  SUBSCRIPTION_CREATE = 'subscription.create',
  SUBSCRIPTION_CANCEL = 'subscription.cancel',
  PAYMENT_SUCCESS = 'payment.success',
  PAYMENT_FAILED = 'payment.failed',
  
  // Marketplace
  MODULE_PURCHASE = 'module.purchase',
  MODULE_INSTALL = 'module.install',
  MODULE_UNINSTALL = 'module.uninstall',
  
  // Sécurité
  PERMISSION_DENIED = 'security.permission_denied',
  RATE_LIMIT_EXCEEDED = 'security.rate_limit',
  SUSPICIOUS_ACTIVITY = 'security.suspicious',
  
  // Données
  DATA_EXPORT = 'data.export',
  DATA_IMPORT = 'data.import',
  DATA_DELETE = 'data.delete',
}

export interface AuditLog extends Document {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure' | 'warning';
  timestamp: Date;
}

/**
 * Crée un log d'audit
 */
export async function createAuditLog(params: {
  tenantId: string;
  userId: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure' | 'warning';
}): Promise<AuditLog> {
  const { AuditLogModel } = await import('../models/AuditLog');
  
  const auditLog = await AuditLogModel.create({
    ...params,
    timestamp: new Date(),
  });
  
  return auditLog;
}

/**
 * Middleware pour logger automatiquement les actions
 */
export function auditLogger(action: AuditAction, resource: string) {
  return async (req: any, res: any, next: any) => {
    // Logger l'action après la réponse
    const originalSend = res.send;
    
    res.send = function(data: any) {
      try {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        
        createAuditLog({
          tenantId: req.user?.tenantId || req.body?.tenantId,
          userId: req.user?._id || req.user?.id,
          action,
          resource,
          resourceId: req.params?.id || req.body?.id,
          description: `${action} on ${resource}`,
          metadata: {
            method: req.method,
            path: req.path,
            query: req.query,
            body: sanitizeBody(req.body),
          },
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.get('user-agent'),
          status: res.statusCode >= 400 ? 'failure' : 'success',
        }).catch(err => console.error('Failed to create audit log:', err));
      } catch (error) {
        console.error('Audit logger error:', error);
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  };
}

/**
 * Nettoie les données sensibles du body avant logging
 */
function sanitizeBody(body: any): any {
  if (!body) return {};
  
  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'apiKey',
    'api_key',
    'authorization',
    'creditCard',
    'cardNumber',
    'cvv',
  ];
  
  const sanitized = { ...body };
  
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  return sanitized;
}

/**
 * Récupère les logs d'audit pour un tenant
 */
export async function getAuditLogs(params: {
  tenantId: string;
  userId?: string;
  action?: AuditAction;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  skip?: number;
}): Promise<AuditLog[]> {
  const { AuditLogModel } = await import('../models/AuditLog');
  
  const query: any = { tenantId: params.tenantId };
  
  if (params.userId) query.userId = params.userId;
  if (params.action) query.action = params.action;
  if (params.startDate || params.endDate) {
    query.timestamp = {};
    if (params.startDate) query.timestamp.$gte = params.startDate;
    if (params.endDate) query.timestamp.$lte = params.endDate;
  }
  
  return AuditLogModel.find(query)
    .sort({ timestamp: -1 })
    .limit(params.limit || 100)
    .skip(params.skip || 0)
    .populate('userId', 'name email')
    .exec();
}

/**
 * Exporte les logs d'audit (pour conformité)
 */
export async function exportAuditLogs(params: {
  tenantId: string;
  startDate: Date;
  endDate: Date;
  format: 'json' | 'csv';
}): Promise<string> {
  const logs = await getAuditLogs({
    tenantId: params.tenantId,
    startDate: params.startDate,
    endDate: params.endDate,
    limit: 10000,
  });
  
  if (params.format === 'json') {
    return JSON.stringify(logs, null, 2);
  }
  
  // Format CSV
  const headers = ['Timestamp', 'User', 'Action', 'Resource', 'Description', 'Status', 'IP'];
  const rows = logs.map(log => [
    log.timestamp.toISOString(),
    (log.userId as any)?.email || 'Unknown',
    log.action,
    log.resource,
    log.description,
    log.status,
    log.ipAddress || '',
  ]);
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

/**
 * Politique de rétention des logs (en jours)
 */
export const RETENTION_POLICY = {
  default: 90,        // 90 jours par défaut
  compliance: 365,    // 1 an pour les logs de paiement/sécurité
  debug: 7,           // 7 jours pour les logs de débogage
};

/**
 * Nettoie les anciens logs selon la politique de rétention
 * À exécuter quotidiennement via un job cron
 */
export async function cleanupOldLogs(): Promise<number> {
  const { AuditLogModel } = await import('../models/AuditLog');
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - RETENTION_POLICY.default);
  
  const result = await AuditLogModel.deleteMany({
    timestamp: { $lt: cutoffDate },
    action: { $nin: [AuditAction.PAYMENT_SUCCESS, AuditAction.PAYMENT_FAILED] },
  });
  
  return result.deletedCount || 0;
}

export default {
  AuditAction,
  createAuditLog,
  auditLogger,
  getAuditLogs,
  exportAuditLogs,
  cleanupOldLogs,
  RETENTION_POLICY,
};
