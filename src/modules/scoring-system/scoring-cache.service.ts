import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ScoringCacheService {
    constructor(
        @Inject(CACHE_MANAGER)
        private cache: Cache,
    ) { }

    private readonly PREFIX = 'scoring_profile:';

    async get<T>(userId: string): Promise<T | null> {
        return await this.cache.get<T>(`${this.PREFIX}${userId}`) ?? null;
    }

    async set<T>(userId: string, value: T): Promise<void> {
        // Cache for 24 hours
        await this.cache.set(`${this.PREFIX}${userId}`, value, 86400);
    }

    async invalidate(userId: string): Promise<void> {
        await this.cache.del(`${this.PREFIX}${userId}`);
    }
}
