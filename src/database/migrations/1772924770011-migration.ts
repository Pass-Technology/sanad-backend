import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772924770011 implements MigrationInterface {
    name = 'Migration1772924770011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "serving_areas" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "branches" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "provider_compliance" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "provider_payments" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "provider_user_info" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_user_info" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "provider_payments" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "provider_compliance" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "branches" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "serving_areas" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deletedAt"`);
    }

}
