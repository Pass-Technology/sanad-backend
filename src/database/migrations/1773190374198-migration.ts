import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773190374198 implements MigrationInterface {
    name = 'Migration1773190374198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" ALTER COLUMN "months" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "subscription_plan_features" DROP CONSTRAINT "FK_eebde20dc0ea854cd3632ece39e"`);
        await queryRunner.query(`ALTER TABLE "subscription_plan_features" DROP COLUMN "planId"`);
        await queryRunner.query(`ALTER TABLE "subscription_plan_features" ADD "planId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription_plans" DROP CONSTRAINT "PK_9ab8fe6918451ab3d0a4fb6bb0c"`);
        await queryRunner.query(`ALTER TABLE "subscription_plans" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "subscription_plans" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription_plans" ADD CONSTRAINT "PK_9ab8fe6918451ab3d0a4fb6bb0c" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "subscription_plan_features" ADD CONSTRAINT "FK_eebde20dc0ea854cd3632ece39e" FOREIGN KEY ("planId") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_plan_features" DROP CONSTRAINT "FK_eebde20dc0ea854cd3632ece39e"`);
        await queryRunner.query(`ALTER TABLE "subscription_plans" DROP CONSTRAINT "PK_9ab8fe6918451ab3d0a4fb6bb0c"`);
        await queryRunner.query(`ALTER TABLE "subscription_plans" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "subscription_plans" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "subscription_plans" ADD CONSTRAINT "PK_9ab8fe6918451ab3d0a4fb6bb0c" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "subscription_plan_features" DROP COLUMN "planId"`);
        await queryRunner.query(`ALTER TABLE "subscription_plan_features" ADD "planId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription_plan_features" ADD CONSTRAINT "FK_eebde20dc0ea854cd3632ece39e" FOREIGN KEY ("planId") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" ALTER COLUMN "months" SET DEFAULT '1'`);
    }

}
