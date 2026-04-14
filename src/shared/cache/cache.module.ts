import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { SharedCacheService } from './shared-cache.service';

@Global()
@Module({
    imports: [
        CacheModule.register({
            ttl: 86400,
        }),
    ],
    providers: [SharedCacheService],
    exports: [SharedCacheService, CacheModule],
})
export class SharedCacheModule { }
