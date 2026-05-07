import { Module, forwardRef } from '@nestjs/common';
import { ScoringSystemController } from './scoring-system.controller';
import { ScoringSystemService } from './scoring-system.service';
import { ProfileModule } from '../provider-profile/profile.module';
import { SharedCacheModule } from '../../shared/cache/cache.module';
import { UserModule } from '../user/user.module';
import { TargetAudienceModule } from '../target-audience-profile/target-audience.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        forwardRef(() => ProfileModule),
        SharedCacheModule,
        UserModule,
        AuthModule,
        TargetAudienceModule,
    ],
    controllers: [ScoringSystemController],
    providers: [ScoringSystemService],
    exports: [ScoringSystemService],
})
export class ScoringSystemModule { }
