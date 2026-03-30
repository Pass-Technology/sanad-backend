import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774872610820 implements MigrationInterface {
    name = 'Migration1774872610820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "reference_number" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "reference_number"`);
    }

}
