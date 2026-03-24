import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774376637240 implements MigrationInterface {
    name = 'Migration1774376637240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_14b384c3f2cba645a89c0c70f4a"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_c91b4eddecde820d748b3af5e85"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_c81d186988c9ce0665cba04bae4"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "current_step"`);
        await queryRunner.query(`ALTER TABLE "plan_features" ALTER COLUMN "name_en" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_c81d186988c9ce0665cba04bae4" FOREIGN KEY ("status_id") REFERENCES "lookup_profile_status"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_c91b4eddecde820d748b3af5e85" FOREIGN KEY ("provider_type_id") REFERENCES "lookup_provider_type"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_14b384c3f2cba645a89c0c70f4a" FOREIGN KEY ("companyTypeId") REFERENCES "lookup_company_type"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_14b384c3f2cba645a89c0c70f4a"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_c91b4eddecde820d748b3af5e85"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_c81d186988c9ce0665cba04bae4"`);
        await queryRunner.query(`ALTER TABLE "plan_features" ALTER COLUMN "name_en" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "current_step" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_c81d186988c9ce0665cba04bae4" FOREIGN KEY ("status_id") REFERENCES "lookup_profile_status"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_c91b4eddecde820d748b3af5e85" FOREIGN KEY ("provider_type_id") REFERENCES "lookup_provider_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_14b384c3f2cba645a89c0c70f4a" FOREIGN KEY ("companyTypeId") REFERENCES "lookup_company_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
