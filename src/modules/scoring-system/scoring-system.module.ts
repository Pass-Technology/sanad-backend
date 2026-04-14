import { Module, forwardRef } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ScoringSystemController } from './scoring-system.controller';
import { ScoringSystemService } from './scoring-system.service';
import { ScoringCacheService } from './scoring-cache.service';
import { ProfileModule } from '../profile/profile.module';

@Module({
    imports: [
        CacheModule.register(),
        forwardRef(() => ProfileModule),
    ],
    controllers: [ScoringSystemController],
    providers: [ScoringSystemService, ScoringCacheService],
    exports: [ScoringSystemService],
})
export class ScoringSystemModule { }
