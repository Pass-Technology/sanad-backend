import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStaticCodeToLookupTables1773687516340 implements MigrationInterface {
    name = 'AddStaticCodeToLookupTables1773687516340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lookup_profile_status" ADD "static_code" character varying`);
        await queryRunner.query(`ALTER TABLE "lookup_provider_type" ADD "static_code" character varying`);
        await queryRunner.query(`ALTER TABLE "lookup_company_type" ADD "static_code" character varying`);
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" ADD "static_code" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lookup_billing_cycle" DROP COLUMN "static_code"`);
        await queryRunner.query(`ALTER TABLE "lookup_company_type" DROP COLUMN "static_code"`);
        await queryRunner.query(`ALTER TABLE "lookup_provider_type" DROP COLUMN "static_code"`);
        await queryRunner.query(`ALTER TABLE "lookup_profile_status" DROP COLUMN "static_code"`);
    }

}
