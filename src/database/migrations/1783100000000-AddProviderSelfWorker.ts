import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProviderSelfWorker1783100000000 implements MigrationInterface {
    name = 'AddProviderSelfWorker1783100000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "worker_profiles" ADD "is_self" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "worker_profiles" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_worker_self_per_provider"
            ON "worker_profiles" ("employer_provider_id")
            WHERE "is_self" = true
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."UQ_worker_self_per_provider"`);
        await queryRunner.query(`ALTER TABLE "worker_profiles" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "worker_profiles" DROP COLUMN "is_self"`);
    }
}
