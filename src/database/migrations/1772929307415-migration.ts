import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772929307415 implements MigrationInterface {
    name = 'Migration1772929307415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" DROP CONSTRAINT "FK_6381d467e80a5b4c2e7fb7984df"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_da8207850c9b5e214a5e7822cc6"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_14b384c3f2cba645a89c0c70f4a"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_2ac580d173f4738143cf874a3b3"`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" ADD CONSTRAINT "FK_6381d467e80a5b4c2e7fb7984df" FOREIGN KEY ("billingCycleId") REFERENCES "lookup_billing_cycle"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_da8207850c9b5e214a5e7822cc6" FOREIGN KEY ("statusId") REFERENCES "lookup_profile_status"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_2ac580d173f4738143cf874a3b3" FOREIGN KEY ("providerTypeId") REFERENCES "lookup_provider_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_14b384c3f2cba645a89c0c70f4a" FOREIGN KEY ("companyTypeId") REFERENCES "lookup_company_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_14b384c3f2cba645a89c0c70f4a"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_2ac580d173f4738143cf874a3b3"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_da8207850c9b5e214a5e7822cc6"`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" DROP CONSTRAINT "FK_6381d467e80a5b4c2e7fb7984df"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_2ac580d173f4738143cf874a3b3" FOREIGN KEY ("providerTypeId") REFERENCES "lookup_provider_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_14b384c3f2cba645a89c0c70f4a" FOREIGN KEY ("companyTypeId") REFERENCES "lookup_company_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_da8207850c9b5e214a5e7822cc6" FOREIGN KEY ("statusId") REFERENCES "lookup_profile_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" ADD CONSTRAINT "FK_6381d467e80a5b4c2e7fb7984df" FOREIGN KEY ("billingCycleId") REFERENCES "lookup_billing_cycle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
