import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772899116288 implements MigrationInterface {
    name = 'Migration1772899116288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" RENAME COLUMN "billingCycle" TO "billingCycleId"`);
        await queryRunner.query(`ALTER TYPE "public"."provider_subscriptions_billingcycle_enum" RENAME TO "provider_subscriptions_billingcycleid_enum"`);
        await queryRunner.query(`CREATE TABLE "lookup_profile_status" ("id" character varying NOT NULL, "label" character varying NOT NULL, CONSTRAINT "PK_93a04430d03ab1c9707a1cb66d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lookup_provider_type" ("id" character varying NOT NULL, "label" character varying NOT NULL, CONSTRAINT "PK_afea6317030e6a215289489e64b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lookup_company_type" ("id" character varying NOT NULL, "label" character varying NOT NULL, CONSTRAINT "PK_61646b18fc1e1ef5f6bee30c01c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lookup_billing_cycle" ("id" character varying NOT NULL, "label" character varying NOT NULL, CONSTRAINT "PK_a04d0f97f625326f36596187451" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "providerType"`);
        await queryRunner.query(`DROP TYPE "public"."provider_profiles_providertype_enum"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "companyType"`);
        await queryRunner.query(`DROP TYPE "public"."provider_profiles_companytype_enum"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."provider_profiles_status_enum"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "statusId" character varying NOT NULL DEFAULT 'draft'`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "providerTypeId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "companyTypeId" character varying`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" DROP COLUMN "billingCycleId"`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" ADD "billingCycleId" character varying NOT NULL DEFAULT 'monthly'`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_da8207850c9b5e214a5e7822cc6" FOREIGN KEY ("statusId") REFERENCES "lookup_profile_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_2ac580d173f4738143cf874a3b3" FOREIGN KEY ("providerTypeId") REFERENCES "lookup_provider_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_14b384c3f2cba645a89c0c70f4a" FOREIGN KEY ("companyTypeId") REFERENCES "lookup_company_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" ADD CONSTRAINT "FK_6381d467e80a5b4c2e7fb7984df" FOREIGN KEY ("billingCycleId") REFERENCES "lookup_billing_cycle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" DROP CONSTRAINT "FK_6381d467e80a5b4c2e7fb7984df"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_14b384c3f2cba645a89c0c70f4a"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_2ac580d173f4738143cf874a3b3"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_da8207850c9b5e214a5e7822cc6"`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" DROP COLUMN "billingCycleId"`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" ADD "billingCycleId" "public"."provider_subscriptions_billingcycleid_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "companyTypeId"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "providerTypeId"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "statusId"`);
        await queryRunner.query(`CREATE TYPE "public"."provider_profiles_status_enum" AS ENUM('draft', 'pending_review', 'approved', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "status" "public"."provider_profiles_status_enum" NOT NULL DEFAULT 'draft'`);
        await queryRunner.query(`CREATE TYPE "public"."provider_profiles_companytype_enum" AS ENUM('private', 'government', 'semi-government')`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "companyType" "public"."provider_profiles_companytype_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."provider_profiles_providertype_enum" AS ENUM('individual', 'company')`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "providerType" "public"."provider_profiles_providertype_enum"`);
        await queryRunner.query(`DROP TABLE "lookup_billing_cycle"`);
        await queryRunner.query(`DROP TABLE "lookup_company_type"`);
        await queryRunner.query(`DROP TABLE "lookup_provider_type"`);
        await queryRunner.query(`DROP TABLE "lookup_profile_status"`);
        await queryRunner.query(`ALTER TYPE "public"."provider_subscriptions_billingcycleid_enum" RENAME TO "provider_subscriptions_billingcycle_enum"`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" RENAME COLUMN "billingCycleId" TO "billingCycle"`);
    }

}
