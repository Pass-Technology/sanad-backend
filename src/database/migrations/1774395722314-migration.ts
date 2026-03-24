import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774395722314 implements MigrationInterface {
    name = 'Migration1774395722314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "serving_areas" DROP COLUMN "branch_id"`);
        await queryRunner.query(`ALTER TABLE "serving_areas" ALTER COLUMN "radius_km" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "serving_areas" ALTER COLUMN "radius_km" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "serving_areas" ADD "branch_id" character varying NOT NULL`);
    }

}
