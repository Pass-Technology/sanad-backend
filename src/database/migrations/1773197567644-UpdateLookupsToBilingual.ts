import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLookupsToBilingual1773197567644 implements MigrationInterface {
    name = 'UpdateLookupsToBilingual1773197567644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Safe renaming and adding
        const tables = ["lookup_billing_cycle", "lookup_profile_status", "lookup_provider_type", "lookup_company_type"];
        
        for (const table of tables) {
            const hasLabel = await queryRunner.hasColumn(table, "label");
            const hasLabelEn = await queryRunner.hasColumn(table, "labelEn");
            
            if (hasLabel && !hasLabelEn) {
                await queryRunner.query(`ALTER TABLE "${table}" RENAME COLUMN "label" TO "labelEn"`);
            } else if (hasLabel && hasLabelEn) {
                await queryRunner.query(`ALTER TABLE "${table}" DROP COLUMN "label"`);
            }
            
            const hasLabelAr = await queryRunner.hasColumn(table, "labelAr");
            if (!hasLabelAr) {
                await queryRunner.query(`ALTER TABLE "${table}" ADD "labelAr" character varying`);
            }
        }

        // Special case for billing cycle badge
        const bcTable = "lookup_billing_cycle";
        const hasBadge = await queryRunner.hasColumn(bcTable, "badge");
        const hasBadgeEn = await queryRunner.hasColumn(bcTable, "badgeEn");
        if (hasBadge && !hasBadgeEn) {
            await queryRunner.query(`ALTER TABLE "${bcTable}" RENAME COLUMN "badge" TO "badgeEn"`);
        } else if (hasBadge && hasBadgeEn) {
            await queryRunner.query(`ALTER TABLE "${bcTable}" DROP COLUMN "badge"`);
        }
        
        const hasBadgeAr = await queryRunner.hasColumn(bcTable, "badgeAr");
        if (!hasBadgeAr) {
            await queryRunner.query(`ALTER TABLE "${bcTable}" ADD "badgeAr" character varying`);
        }

        // Ensure NOT NULL after data is seeded or just make them nullable for now to avoid issues
        // I'll leave them nullable for now and we can enforce later if needed, 
        // but the seeds will fill them anyway.
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lookup_company_type" DROP COLUMN "labelAr"`);
        await queryRunner.query(`ALTER TABLE "lookup_company_type" DROP COLUMN "labelEn"`);
        await queryRunner.query(`ALTER TABLE "lookup_provider_type" DROP COLUMN "labelAr"`);
        await queryRunner.query(`ALTER TABLE "lookup_provider_type" DROP COLUMN "labelEn"`);
        await queryRunner.query(`ALTER TABLE "lookup_profile_status" DROP COLUMN "labelAr"`);
        await queryRunner.query(`ALTER TABLE "lookup_profile_status" DROP COLUMN "labelEn"`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" DROP COLUMN "badgeAr"`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" DROP COLUMN "badgeEn"`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" DROP COLUMN "labelAr"`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" DROP COLUMN "labelEn"`);
        await queryRunner.query(`ALTER TABLE "lookup_company_type" ADD "label" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lookup_provider_type" ADD "label" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lookup_profile_status" ADD "label" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" ADD "label" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" ADD "badge" character varying`);
    }

}
