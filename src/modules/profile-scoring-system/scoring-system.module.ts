import { Module, forwardRef } from '@nestjs/common';
import { ScoringSystemController } from './scoring-system.controller';
import { ScoringSystemService } from './scoring-system.service';
import { ProfileModule } from '../profile/profile.module';
import { SharedCacheModule } from '../../shared/cache/cache.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        forwardRef(() => ProfileModule),
        SharedCacheModule,
        UserModule,
    ],
    controllers: [ScoringSystemController],
    providers: [ScoringSystemService],
    exports: [ScoringSystemService],
})
export class ScoringSystemModule { }
