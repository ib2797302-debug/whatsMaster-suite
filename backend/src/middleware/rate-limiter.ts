/**
 * Middleware de Rate Limiting par Tenant et IP
 * Protection contre les abus et attaques DDoS
 */

import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { RateLimitError } from '../utils/errors';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

interface RateLimitConfig {
  windowMs: number;      // Fenêtre de temps en ms
  maxRequests: number;   // Nombre max de requêtes
  message: string;
}

// Configurations par type d'opération
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Authentification - très restrictif
  auth: {
    windowMs: 15 * 60 * 1000,      // 15 minutes
    maxRequests: 10,                // 10 tentatives
    message: 'Trop de tentatives de connexion. Veuillez réessayer plus tard.'
  },
  
  // Envoi de messages - limitatif pour éviter le spam
  messaging: {
    windowMs: 60 * 1000,           // 1 minute
    maxRequests: 60,                // 60 messages/minute
    message: 'Limite d\'envoi de messages atteinte.'
  },
  
  // Campagnes - limitatif par batch
  campaigns: {
    windowMs: 60 * 60 * 1000,      // 1 heure
    maxRequests: 10,                // 10 campagnes/heure
    message: 'Limite de campagnes atteinte.'
  },
  
  // API générale - plus permissif
  api: {
    windowMs: 60 * 1000,           // 1 minute
    maxRequests: 100,               // 100 requêtes/minute
    message: 'Trop de requêtes. Veuillez ralentir.'
  },
  
  // Webhooks - très permissif (venant de Facebook)
  webhooks: {
    windowMs: 60 * 1000,           // 1 minute
    maxRequests: 1000,              // 1000 webhooks/minute
    message: 'Limite de webhooks atteinte.'
  }
};

// Quotas par plan d'abonnement (à personnaliser)
const TENANT_QUOTAS: Record<string, number> = {
  free: 1,
  starter: 2,
  professional: 5,
  enterprise: 10
};

/**
 * Middleware de rate limiting
 * @param type - Type de rate limiting (auth, messaging, campaigns, api, webhooks)
 */
export function rateLimiter(type: keyof typeof RATE_LIMITS = 'api') {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const config = RATE_LIMITS[type];
      
      // Identifier unique : tenantId + IP + type
      const tenantId = req.user?.tenantId || 'unknown';
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const key = `ratelimit:${type}:${tenantId}:${ip}`;
      
      // Récupérer le compteur actuel
      const current = await redis.incr(key);
      
      // Définir l'expiration si c'est la première requête
      if (current === 1) {
        await redis.pexpire(key, config.windowMs);
      }
      
      // Récupérer le temps restant avant reset
      const ttl = await redis.pttl(key);
      
      // Appliquer le multiplicateur de quota selon le plan du tenant
      const tenantPlan = req.user?.plan || 'free';
      const quotaMultiplier = TENANT_QUOTAS[tenantPlan] || 1;
      const effectiveMax = config.maxRequests * quotaMultiplier;
      
      // Headers de rate limiting (standard industry)
      res.set('X-RateLimit-Limit', effectiveMax.toString());
      res.set('X-RateLimit-Remaining', Math.max(0, effectiveMax - current).toString());
      res.set('X-RateLimit-Reset', Date.now() + ttl);
      
      // Vérifier si la limite est dépassée
      if (current > effectiveMax) {
        throw new RateLimitError(config.message, ttl);
      }
      
      next();
    } catch (error) {
      if (error instanceof RateLimitError) {
        res.set('Retry-After', Math.ceil(error.retryAfter / 1000).toString());
        res.status(429).json({
          success: false,
          error: error.message,
          retryAfter: Math.ceil(error.retryAfter / 1000)
        });
      } else {
        // En cas d'erreur Redis, laisser passer (fail-open) mais logger
        console.error('Rate limiter Redis error:', error);
        next();
      }
    }
  };
}

/**
 * Middleware spécifique pour l'authentification
 */
export const authRateLimiter = rateLimiter('auth');

/**
 * Middleware spécifique pour la messagerie
 */
export const messagingRateLimiter = rateLimiter('messaging');

/**
 * Middleware spécifique pour les campagnes
 */
export const campaignsRateLimiter = rateLimiter('campaigns');

/**
 * Middleware générique pour l'API
 */
export const apiRateLimiter = rateLimiter('api');

/**
 * Nettoyage manuel des clés de rate limiting (pour admin)
 */
export async function clearRateLimit(tenantId: string, type?: string): Promise<void> {
  const pattern = type 
    ? `ratelimit:${type}:${tenantId}:*`
    : `ratelimit:*:${tenantId}:*`;
  
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

export default rateLimiter;
