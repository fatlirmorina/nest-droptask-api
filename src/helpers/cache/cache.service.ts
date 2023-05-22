import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get(key: string) {
    const data = await this.cacheManager.get(key);
    return data;
  }

  async set(key: string, value: any, ttl?: number) {
    if (ttl) {
      await this.cacheManager.set(key, value, ttl);
    } else {
      await this.cacheManager.set(key, value);
    }
    return true;
  }

  async del(key: string) {
    await this.cacheManager.del(key);
    return true;
  }
}
