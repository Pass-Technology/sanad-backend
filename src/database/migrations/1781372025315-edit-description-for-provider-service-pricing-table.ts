import { MigrationInterface, QueryRunner } from 'typeorm';

export class EditDescriptionForProviderServicePricingTable1781372025315 implements MigrationInterface {
    name = 'EditDescriptionForProviderServicePricingTable1781372025315';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "provider_service_pricing" 
            ALTER COLUMN "description" TYPE jsonb 
            USING jsonb_build_object(
                'en', COALESCE(description, 'price details description'), 
                'ar', 'وصف الفئة'
            );
        `);
        await queryRunner.query(`
            ALTER TABLE "provider_service_pricing" 
            ALTER COLUMN "description" SET DEFAULT '{"en":"price details description","ar":"وصف الفئة"}'::jsonb;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "provider_service_pricing" 
            ALTER COLUMN "description" DROP DEFAULT;
        `);
        await queryRunner.query(`
            ALTER TABLE "provider_service_pricing" 
            ALTER COLUMN "description" TYPE text 
            USING description->>'en';
        `);
    }
}
