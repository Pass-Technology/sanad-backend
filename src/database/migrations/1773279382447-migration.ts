import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773279382447 implements MigrationInterface {
    name = 'Migration1773279382447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_da8207850c9b5e214a5e7822cc6"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "statusId"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "status_id"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "status_id" uuid`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_c81d186988c9ce0665cba04bae4" FOREIGN KEY ("status_id") REFERENCES "lookup_profile_status"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_c81d186988c9ce0665cba04bae4"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "status_id"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "status_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "statusId" uuid`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_da8207850c9b5e214a5e7822cc6" FOREIGN KEY ("statusId") REFERENCES "lookup_profile_status"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
