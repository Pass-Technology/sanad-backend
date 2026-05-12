import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1778593718838 implements MigrationInterface {
    name = 'Migration1778593718838'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otps" ADD "identifier" character varying NOT NULL DEFAULT 'email@example.com'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "identifier"`);
    }

}
