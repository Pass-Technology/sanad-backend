import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvailabilityToProviderServiceTable1780838197306 implements MigrationInterface {
    name = 'AddAvailabilityToProviderServiceTable1780838197306'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_services" ADD "availability" jsonb`);
        await queryRunner.query(`ALTER TYPE "public"."provider_profile_changes_change_type_enum" RENAME TO "provider_profile_changes_change_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."provider_profile_changes_change_type_enum" AS ENUM('COMPANY_INFO', 'USER_INFO', 'COMPLIANCE', 'BRANCHES', 'SERVICES', 'PAYMENT', 'AVAILABILITY')`);
        await queryRunner.query(`ALTER TABLE "provider_profile_changes" ALTER COLUMN "change_type" TYPE "public"."provider_profile_changes_change_type_enum" USING "change_type"::"text"::"public"."provider_profile_changes_change_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."provider_profile_changes_change_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."provider_profile_changes_change_type_enum_old" AS ENUM('COMPANY_INFO', 'USER_INFO', 'COMPLIANCE', 'BRANCHES', 'SERVICES', 'PAYMENT')`);
        await queryRunner.query(`ALTER TABLE "provider_profile_changes" ALTER COLUMN "change_type" TYPE "public"."provider_profile_changes_change_type_enum_old" USING "change_type"::"text"::"public"."provider_profile_changes_change_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."provider_profile_changes_change_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."provider_profile_changes_change_type_enum_old" RENAME TO "provider_profile_changes_change_type_enum"`);
        await queryRunner.query(`ALTER TABLE "provider_services" DROP COLUMN "availability"`);
    }

}
