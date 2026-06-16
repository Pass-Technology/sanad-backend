import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMultiLanguageDescriptionForProviderServiceTable1781171139561 implements MigrationInterface {
    name = 'AddMultiLanguageDescriptionForProviderServiceTable1781171139561';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_services" DROP COLUMN "description"`);
        await queryRunner.query(
            `ALTER TABLE "provider_services" ADD "description" jsonb DEFAULT '{"en":"Service description","ar":"وصف الخدمة"}'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_services" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "provider_services" ADD "description" text`);
    }
}
