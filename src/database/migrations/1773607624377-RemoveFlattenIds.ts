import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveFlattenIds1773607624377 implements MigrationInterface {
    name = 'RemoveFlattenIds1773607624377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_features" DROP CONSTRAINT "FK_b51952483b18fa15334d714a838"`);
        await queryRunner.query(`ALTER TABLE "plan_features" DROP CONSTRAINT "FK_27e866bdf4c6f2cf5854b7d0e57"`);
        await queryRunner.query(`ALTER TABLE "plan_features" ALTER COLUMN "plan_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plan_features" ALTER COLUMN "feature_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plan_prices" DROP CONSTRAINT "FK_486db649897ac5901b8e93e5b7d"`);
        await queryRunner.query(`ALTER TABLE "plan_prices" DROP CONSTRAINT "FK_f26207aa0f58d642660e3db1dd1"`);
        await queryRunner.query(`ALTER TABLE "plan_prices" ALTER COLUMN "plan_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plan_prices" ALTER COLUMN "billing_cycle_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_32070c53993605bd3699f9ec9a6"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "plan_price_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "plan_features" ADD CONSTRAINT "FK_b51952483b18fa15334d714a838" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_features" ADD CONSTRAINT "FK_27e866bdf4c6f2cf5854b7d0e57" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_prices" ADD CONSTRAINT "FK_486db649897ac5901b8e93e5b7d" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_prices" ADD CONSTRAINT "FK_f26207aa0f58d642660e3db1dd1" FOREIGN KEY ("billing_cycle_id") REFERENCES "billing_cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_32070c53993605bd3699f9ec9a6" FOREIGN KEY ("plan_price_id") REFERENCES "plan_prices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_d0a95ef8a28188364c546eb65c1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_d0a95ef8a28188364c546eb65c1"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_32070c53993605bd3699f9ec9a6"`);
        await queryRunner.query(`ALTER TABLE "plan_prices" DROP CONSTRAINT "FK_f26207aa0f58d642660e3db1dd1"`);
        await queryRunner.query(`ALTER TABLE "plan_prices" DROP CONSTRAINT "FK_486db649897ac5901b8e93e5b7d"`);
        await queryRunner.query(`ALTER TABLE "plan_features" DROP CONSTRAINT "FK_27e866bdf4c6f2cf5854b7d0e57"`);
        await queryRunner.query(`ALTER TABLE "plan_features" DROP CONSTRAINT "FK_b51952483b18fa15334d714a838"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "plan_price_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_32070c53993605bd3699f9ec9a6" FOREIGN KEY ("plan_price_id") REFERENCES "plan_prices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_prices" ALTER COLUMN "billing_cycle_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plan_prices" ALTER COLUMN "plan_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plan_prices" ADD CONSTRAINT "FK_f26207aa0f58d642660e3db1dd1" FOREIGN KEY ("billing_cycle_id") REFERENCES "billing_cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_prices" ADD CONSTRAINT "FK_486db649897ac5901b8e93e5b7d" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_features" ALTER COLUMN "feature_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plan_features" ALTER COLUMN "plan_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plan_features" ADD CONSTRAINT "FK_27e866bdf4c6f2cf5854b7d0e57" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_features" ADD CONSTRAINT "FK_b51952483b18fa15334d714a838" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
