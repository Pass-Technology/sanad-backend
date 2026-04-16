import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1776046382516 implements MigrationInterface {
    name = 'Migration1776046382516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "is_available" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branches" DROP COLUMN "is_available"`);
    }

}
