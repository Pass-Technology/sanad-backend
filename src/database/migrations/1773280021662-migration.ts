import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773280021662 implements MigrationInterface {
    name = 'Migration1773280021662'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branches" DROP COLUMN "provider_profile_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branches" ADD "provider_profile_id" character varying NOT NULL`);
    }

}
