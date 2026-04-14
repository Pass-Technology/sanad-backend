import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class SharedCacheService {
    constructor(
        @Inject(CACHE_MANAGER)
        private cache: Cache,
    ) { }

    async get<T>(prefix: string, key: string): Promise<T | null> {
        return await this.cache.get<T>(`${prefix}${key}`) ?? null;
    }

    async set<T>(prefix: string, key: string, value: T, ttl: number = 86400): Promise<void> {
        await this.cache.set(`${prefix}${key}`, value, ttl);
    }

    async delete(prefix: string, key: string): Promise<void> {
        await this.cache.del(`${prefix}${key}`);
    }

    async clear(): Promise<void> {
        await this.cache.clear();
    }
}
