import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TargetAudienceController } from "./target-audience.controller";
import { TargetAudienceService } from "./target-audience.service";
import { TargetAudienceProfile } from "./entities/target-audience.entity";
import { ProfileModule } from "../profile/profile.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([TargetAudienceProfile]),
        ProfileModule,
    ],
    controllers: [TargetAudienceController],
    providers: [TargetAudienceService],
    exports: [TargetAudienceService],
})
export class TargetAudienceModule { }