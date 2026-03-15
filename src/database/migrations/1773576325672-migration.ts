import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773576325672 implements MigrationInterface {
    name = 'Migration1773576325672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" DROP CONSTRAINT "FK_bb7ac5533ea8aefbfdd4a4d28b6"`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" DROP CONSTRAINT "FK_c8b3abdcbe1366928f333a39ca9"`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" DROP COLUMN "selected_plan_id"`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" DROP COLUMN "billing_cycle_id"`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" ADD "selected_plan_id_id" uuid`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" ADD "billing_cycle_id_id" uuid`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" ADD CONSTRAINT "FK_cacfd0404917a281d47202b6af0" FOREIGN KEY ("selected_plan_id_id") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" ADD CONSTRAINT "FK_d38e9952cf273a5f07bfac9575f" FOREIGN KEY ("billing_cycle_id_id") REFERENCES "lookup_billing_cycle"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" DROP CONSTRAINT "FK_d38e9952cf273a5f07bfac9575f"`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" DROP CONSTRAINT "FK_cacfd0404917a281d47202b6af0"`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" DROP COLUMN "billing_cycle_id_id"`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" DROP COLUMN "selected_plan_id_id"`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" ADD "billing_cycle_id" uuid`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" ADD "selected_plan_id" uuid`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" ADD CONSTRAINT "FK_c8b3abdcbe1366928f333a39ca9" FOREIGN KEY ("selected_plan_id") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" ADD CONSTRAINT "FK_bb7ac5533ea8aefbfdd4a4d28b6" FOREIGN KEY ("billing_cycle_id") REFERENCES "lookup_billing_cycle"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
