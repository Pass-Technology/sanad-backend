import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774296184112 implements MigrationInterface {
    name = 'Migration1774296184112'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "plan_features" DROP CONSTRAINT "FK_27e866bdf4c6f2cf5854b7d0e57"`);
        await queryRunner.query(`ALTER TABLE "plan_features" DROP COLUMN "feature_id"`);
        await queryRunner.query(`ALTER TABLE "plan_features" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "identifier"`);
        await queryRunner.query(`TRUNCATE TABLE plan_features CASCADE`);
        await queryRunner.query(`ALTER TABLE "plan_features" ADD "name_en" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plan_features" ADD "name_ar" character varying`);
        await queryRunner.query(`ALTER TABLE "plan_features" ADD "description_en" character varying`);
        await queryRunner.query(`ALTER TABLE "plan_features" ADD "description_ar" character varying`);
        await queryRunner.query(`ALTER TABLE "plan_features" ADD "value_en" character varying`);
        await queryRunner.query(`ALTER TABLE "plan_features" ADD "value_ar" character varying`);
        await queryRunner.query(`ALTER TABLE "plan_features" ADD "display_order" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "plan_features" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`TRUNCATE TABLE billing_cycles CASCADE`);
        await queryRunner.query(`ALTER TABLE "billing_cycles" ALTER COLUMN "static_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lookup_profile_status" ALTER COLUMN "static_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lookup_provider_type" ALTER COLUMN "static_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lookup_company_type" ALTER COLUMN "static_code" SET NOT NULL`);
        await queryRunner.query(`TRUNCATE TABLE lookup_billing_cycle CASCADE`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" ALTER COLUMN "static_code" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" ALTER COLUMN "static_code" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lookup_company_type" ALTER COLUMN "static_code" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lookup_provider_type" ALTER COLUMN "static_code" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lookup_profile_status" ALTER COLUMN "static_code" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "billing_cycles" ALTER COLUMN "static_code" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plan_features" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "plan_features" DROP COLUMN "display_order"`);
        await queryRunner.query(`ALTER TABLE "plan_features" DROP COLUMN "value_ar"`);
        await queryRunner.query(`ALTER TABLE "plan_features" DROP COLUMN "value_en"`);
        await queryRunner.query(`ALTER TABLE "plan_features" DROP COLUMN "description_ar"`);
        await queryRunner.query(`ALTER TABLE "plan_features" DROP COLUMN "description_en"`);
        await queryRunner.query(`ALTER TABLE "plan_features" DROP COLUMN "name_ar"`);
        await queryRunner.query(`ALTER TABLE "plan_features" DROP COLUMN "name_en"`);
        await queryRunner.query(`ALTER TABLE "otps" ADD "identifier" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plan_features" ADD "value" character varying`);
        await queryRunner.query(`ALTER TABLE "plan_features" ADD "feature_id" uuid`);
        await queryRunner.query(`ALTER TABLE "plan_features" ADD CONSTRAINT "FK_27e866bdf4c6f2cf5854b7d0e57" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
