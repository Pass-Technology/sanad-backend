import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TargetAudienceController } from "./target-audience.controller";
import { TargetAudienceService } from "./target-audience.service";
import { TargetAudienceProfile } from "./entities/target-audience.entity";
import { ProfileModule } from "../provider-profile/profile.module";
import { UserModule } from "../user/user.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([TargetAudienceProfile]),
        forwardRef(() => ProfileModule),
        UserModule,
        AuthModule,
    ],
    controllers: [TargetAudienceController],
    providers: [TargetAudienceService],
    exports: [TargetAudienceService],
})
export class TargetAudienceModule { }