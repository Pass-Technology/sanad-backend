import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPerformanceIndexes1778050000000 implements MigrationInterface {
    name = 'AddPerformanceIndexes1778050000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ===== Foreign Key Indexes =====
        // PostgreSQL auto-indexes PRIMARY KEYs but NOT foreign keys.
        // SnakeNamingStrategy converts camelCase to snake_case in DB.

        // provider_profiles.user_id — the most queried FK in the entire app
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_provider_profiles_user_id"
            ON "provider_profiles" ("user_id")
        `);

        // branches.provider_profile_id — loaded in every branch query
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_branches_providerProfid"
            ON "branches" ("providerProfileId")
        `);

        // serving_areas.branch_id — loaded whenever branches are fetched
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_serving_areas_branchId"
            ON "serving_areas" ("branchId")
        `);

        // provider_services.profile_id — loaded for service management
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_provider_services_profile_id"
            ON "provider_services" ("profile_id")
        `);

        // provider_service_pricing.provider_service_id — loaded with services
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_provider_service_pricing_provider_service_id"
            ON "provider_service_pricing" ("provider_service_id")
        `);

        // provider_payments.provider_profile_id — loaded for payment queries
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_provider_payments_provider_profile_id"
            ON "provider_payments" ("provider_profile_id")
        `);

        // target-audience-profiles.provider_profile_id — loaded for scoring
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_target_audience_provider_profile_id"
            ON "target-audience-profiles" ("provider_profile_id")
        `);

        // ===== Search / Lookup Indexes =====

        // provider_profiles.reference_number — used for lookups
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_provider_profiles_reference_number"
            ON "provider_profiles" ("reference_number")
        `);

        // provider_profile_languages junction table
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_provider_profile_languages_profile_id"
            ON "provider_profile_languages" ("profile_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_provider_profiles_user_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_branches_provider_profile_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_serving_areas_branch_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_provider_services_profile_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_provider_service_pricing_provider_service_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_provider_payments_provider_profile_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_target_audience_provider_profile_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_provider_profiles_reference_number"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_provider_profile_languages_profile_id"`);
    }
}
