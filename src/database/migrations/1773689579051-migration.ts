import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773689579051 implements MigrationInterface {
    name = 'Migration1773689579051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "features" ADD "display_order" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "features" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "plans" ADD "display_order" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "plans" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "billing_cycles" ADD "static_code" character varying`);
        await queryRunner.query(`ALTER TABLE "billing_cycles" ADD "display_order" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "billing_cycles" ADD "is_active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "billing_cycles" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "billing_cycles" DROP COLUMN "display_order"`);
        await queryRunner.query(`ALTER TABLE "billing_cycles" DROP COLUMN "static_code"`);
        await queryRunner.query(`ALTER TABLE "plans" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "plans" DROP COLUMN "display_order"`);
        await queryRunner.query(`ALTER TABLE "features" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "features" DROP COLUMN "display_order"`);
    }

}
