import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773188998558 implements MigrationInterface {
    name = 'Migration1773188998558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "subscription_plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "monthlyPrice" numeric NOT NULL, "bookingLimit" integer, "commissionPercent" numeric, "isMostPopular" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_9ab8fe6918451ab3d0a4fb6bb0c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "subscription_plan_features" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "planId" uuid NOT NULL, "featureText" character varying NOT NULL, "displayOrder" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_d9ee0b915953daf576ad8e57e26" PRIMARY KEY ("id"))`);

        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" ADD COLUMN IF NOT EXISTS "months" integer NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" ADD COLUMN IF NOT EXISTS "discountPercent" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" ADD COLUMN IF NOT EXISTS "badge" character varying`);

        // Check if constraint exists before adding
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_eebde20dc0ea854cd3632ece39e') THEN
                    ALTER TABLE "subscription_plan_features" ADD CONSTRAINT "FK_eebde20dc0ea854cd3632ece39e" FOREIGN KEY ("planId") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
                END IF;
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_plan_features" DROP CONSTRAINT IF EXISTS "FK_eebde20dc0ea854cd3632ece39e"`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" DROP COLUMN IF EXISTS "badge"`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" DROP COLUMN IF EXISTS "discountPercent"`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" DROP COLUMN IF EXISTS "months"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "subscription_plan_features"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "subscription_plans"`);
    }

}
