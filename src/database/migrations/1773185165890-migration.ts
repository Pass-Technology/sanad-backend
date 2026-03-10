import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773185165890 implements MigrationInterface {
    name = 'Migration1773185165890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subscription_plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "monthlyPrice" numeric NOT NULL, "bookingLimit" integer, "commissionPercent" numeric, "isMostPopular" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_9ab8fe6918451ab3d0a4fb6bb0c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscription_plan_features" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "planId" uuid NOT NULL, "featureText" character varying NOT NULL, "displayOrder" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_d9ee0b915953daf576ad8e57e26" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" ADD "months" integer`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" ADD "discountPercent" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" ADD "badge" character varying`);
        await queryRunner.query(`ALTER TABLE "subscription_plan_features" ADD CONSTRAINT "FK_eebde20dc0ea854cd3632ece39e" FOREIGN KEY ("planId") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_plan_features" DROP CONSTRAINT "FK_eebde20dc0ea854cd3632ece39e"`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" DROP COLUMN "badge"`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" DROP COLUMN "discountPercent"`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" DROP COLUMN "months"`);
        await queryRunner.query(`DROP TABLE "subscription_plan_features"`);
        await queryRunner.query(`DROP TABLE "subscription_plans"`);
    }

}
