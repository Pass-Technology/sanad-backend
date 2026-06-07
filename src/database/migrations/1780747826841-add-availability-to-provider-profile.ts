import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvailabilityToProviderProfile1780747826841 implements MigrationInterface {
    name = 'AddAvailabilityToProviderProfile1780747826841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "availability" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "availability"`);
    }

}
