import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { JobEntity } from '../marketplace/entities/job.entity';
import { ProfileModule } from '../provider-profile/profile.module';
import { ClientModule } from '../client/client.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ReviewEntity, JobEntity]),
        ProfileModule,
        ClientModule,
        AuthModule
    ],
    controllers: [ReviewController],
    providers: [ReviewService],
    exports: [ReviewService],
})
export class ReviewModule { }
