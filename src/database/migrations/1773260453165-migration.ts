import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773260453165 implements MigrationInterface {
    name = 'Migration1773260453165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "lookup_profile_status" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lookup_profile_status" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lookup_profile_status" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "lookup_provider_type" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lookup_provider_type" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lookup_provider_type" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "lookup_company_type" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lookup_company_type" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lookup_company_type" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "serving_areas" DROP CONSTRAINT "FK_ccdcd71ebbe5e41b46c24a2d3cf"`);
        await queryRunner.query(`ALTER TABLE "serving_areas" ALTER COLUMN "branchId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" DROP CONSTRAINT "FK_6381d467e80a5b4c2e7fb7984df"`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" DROP CONSTRAINT "PK_a04d0f97f625326f36596187451"`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" ADD CONSTRAINT "PK_a04d0f97f625326f36596187451" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" DROP COLUMN "billingCycleId"`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" ADD "billingCycleId" uuid`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_da8207850c9b5e214a5e7822cc6"`);
        await queryRunner.query(`ALTER TABLE "lookup_profile_status" DROP CONSTRAINT "PK_93a04430d03ab1c9707a1cb66d0"`);
        await queryRunner.query(`ALTER TABLE "lookup_profile_status" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "lookup_profile_status" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "lookup_profile_status" ADD CONSTRAINT "PK_93a04430d03ab1c9707a1cb66d0" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_2ac580d173f4738143cf874a3b3"`);
        await queryRunner.query(`ALTER TABLE "lookup_provider_type" DROP CONSTRAINT "PK_afea6317030e6a215289489e64b"`);
        await queryRunner.query(`ALTER TABLE "lookup_provider_type" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "lookup_provider_type" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "lookup_provider_type" ADD CONSTRAINT "PK_afea6317030e6a215289489e64b" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_14b384c3f2cba645a89c0c70f4a"`);
        await queryRunner.query(`ALTER TABLE "lookup_company_type" DROP CONSTRAINT "PK_61646b18fc1e1ef5f6bee30c01c"`);
        await queryRunner.query(`ALTER TABLE "lookup_company_type" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "lookup_company_type" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "lookup_company_type" ADD CONSTRAINT "PK_61646b18fc1e1ef5f6bee30c01c" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "providerTypeId"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "providerTypeId" uuid`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "companyTypeId"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "companyTypeId" uuid`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "statusId"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "statusId" uuid`);
        await queryRunner.query(`ALTER TABLE "serving_areas" ADD CONSTRAINT "FK_ccdcd71ebbe5e41b46c24a2d3cf" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
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
        await queryRunner.query(`ALTER TABLE "serving_areas" DROP CONSTRAINT "FK_ccdcd71ebbe5e41b46c24a2d3cf"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "statusId"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "statusId" character varying NOT NULL DEFAULT 'draft'`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "companyTypeId"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "companyTypeId" character varying`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "providerTypeId"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "providerTypeId" character varying`);
        await queryRunner.query(`ALTER TABLE "lookup_company_type" DROP CONSTRAINT "PK_61646b18fc1e1ef5f6bee30c01c"`);
        await queryRunner.query(`ALTER TABLE "lookup_company_type" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "lookup_company_type" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lookup_company_type" ADD CONSTRAINT "PK_61646b18fc1e1ef5f6bee30c01c" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_14b384c3f2cba645a89c0c70f4a" FOREIGN KEY ("companyTypeId") REFERENCES "lookup_company_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lookup_provider_type" DROP CONSTRAINT "PK_afea6317030e6a215289489e64b"`);
        await queryRunner.query(`ALTER TABLE "lookup_provider_type" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "lookup_provider_type" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lookup_provider_type" ADD CONSTRAINT "PK_afea6317030e6a215289489e64b" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_2ac580d173f4738143cf874a3b3" FOREIGN KEY ("providerTypeId") REFERENCES "lookup_provider_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lookup_profile_status" DROP CONSTRAINT "PK_93a04430d03ab1c9707a1cb66d0"`);
        await queryRunner.query(`ALTER TABLE "lookup_profile_status" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "lookup_profile_status" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lookup_profile_status" ADD CONSTRAINT "PK_93a04430d03ab1c9707a1cb66d0" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_da8207850c9b5e214a5e7822cc6" FOREIGN KEY ("statusId") REFERENCES "lookup_profile_status"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" DROP COLUMN "billingCycleId"`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" ADD "billingCycleId" character varying NOT NULL DEFAULT 'monthly'`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" DROP CONSTRAINT "PK_a04d0f97f625326f36596187451"`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" ADD CONSTRAINT "PK_a04d0f97f625326f36596187451" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" ADD CONSTRAINT "FK_6381d467e80a5b4c2e7fb7984df" FOREIGN KEY ("billingCycleId") REFERENCES "lookup_billing_cycle"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "serving_areas" ALTER COLUMN "branchId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "serving_areas" ADD CONSTRAINT "FK_ccdcd71ebbe5e41b46c24a2d3cf" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lookup_company_type" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "lookup_company_type" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "lookup_company_type" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "lookup_provider_type" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "lookup_provider_type" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "lookup_provider_type" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "lookup_profile_status" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "lookup_profile_status" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "lookup_profile_status" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" DROP COLUMN "createdAt"`);
    }

}
