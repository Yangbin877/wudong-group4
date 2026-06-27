import { Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import Redis from 'ioredis';

const store = new Map<string, { value: any; expire: number }>();

@Provide()
@Scope(ScopeEnum.Singleton)
export class CacheUtil {
  private redis: Redis | null = null;
  private redisAvailable = false;

  async init() {
    const host = process.env.REDIS_HOST || '127.0.0.1';
    const port = Number(process.env.REDIS_PORT) || 6379;
    try {
      this.redis = new Redis({
        host, port,
        connectTimeout: 2000,
        maxRetriesPerRequest: 0,
        retryStrategy: () => null, // 不重试
        lazyConnect: true,
      });
      this.redis.on('error', () => {}); // 静默错误
      await this.redis.connect();
      await this.redis.ping();
      this.redisAvailable = true;
      console.log('[Cache] Redis connected successfully at %s:%d', host, port);
    } catch (e) {
      this.redis = null;
      this.redisAvailable = false;
      console.warn('[Cache] Redis unavailable (%s:%d), using in-memory fallback', host, port);
    }
  }

  async get(key: string): Promise<any> {
    if (this.redisAvailable && this.redis) {
      try {
        const data = await this.redis.get(key);
        return data ? JSON.parse(data) : null;
      } catch { /* fall through */ }
    }
    const entry = store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expire) { store.delete(key); return null; }
    return entry.value;
  }

  async set(key: string, value: any, ttlSeconds = 300): Promise<void> {
    if (this.redisAvailable && this.redis) {
      try {
        await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return;
      } catch { /* fall through */ }
    }
    store.set(key, { value, expire: Date.now() + ttlSeconds * 1000 });
  }

  async del(key: string): Promise<void> {
    if (this.redisAvailable && this.redis) {
      try { await this.redis.del(key); return; } catch { /* fall through */ }
    }
    store.delete(key);
  }

  async delPattern(pattern: string): Promise<void> {
    if (this.redisAvailable && this.redis) {
      try {
        const keys = await this.redis.keys(pattern);
        if (keys.length) await this.redis.del(...keys);
        return;
      } catch { /* fall through */ }
    }
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    for (const k of store.keys()) { if (regex.test(k)) store.delete(k); }
  }
}
