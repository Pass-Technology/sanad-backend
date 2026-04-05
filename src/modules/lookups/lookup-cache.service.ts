import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class LookupCacheService {
    constructor(
        @Inject(CACHE_MANAGER)
        private cache: Cache,
    ) { }

    async get<T>(key: string): Promise<T | null> {
        return await this.cache.get<T>(key) ?? null;
    }

    async set<T>(key: string, value: T): Promise<void> {
        await this.cache.set(key, value, 86400);
    }

    async invalidate(key: string): Promise<void> {
        await this.cache.del(key);
    }
}