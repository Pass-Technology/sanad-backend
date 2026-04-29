import { Module, forwardRef } from '@nestjs/common';
import { ScoringSystemController } from './scoring-system.controller';
import { ScoringSystemService } from './scoring-system.service';
import { ProfileModule } from '../profile/profile.module';
import { SharedCacheModule } from '../../shared/cache/cache.module';
import { UserModule } from '../user/user.module';
import { TargetAudienceModule } from '../target-audience-profile/target-audience.module';

@Module({
    imports: [
        forwardRef(() => ProfileModule),
        SharedCacheModule,
        UserModule,
        TargetAudienceModule,
    ],
    controllers: [ScoringSystemController],
    providers: [ScoringSystemService],
    exports: [ScoringSystemService],
})
export class ScoringSystemModule { }
