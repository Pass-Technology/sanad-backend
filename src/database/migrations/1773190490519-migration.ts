import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773190490519 implements MigrationInterface {
    name = 'Migration1773190490519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_plan_features" ADD CONSTRAINT "UQ_c55d06f1e5b94491a3c0d1115fb" UNIQUE ("planId", "featureText")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_plan_features" DROP CONSTRAINT "UQ_c55d06f1e5b94491a3c0d1115fb"`);
    }

}
