import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773374755910 implements MigrationInterface {
    name = 'Migration1773374755910'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otps" ADD "is_verified" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "is_verified"`);
    }

}
