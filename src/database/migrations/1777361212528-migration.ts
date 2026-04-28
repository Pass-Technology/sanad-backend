import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1777361212528 implements MigrationInterface {
    name = 'Migration1777361212528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_services" ADD "is_active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_services" DROP COLUMN "is_active"`);
    }

}
