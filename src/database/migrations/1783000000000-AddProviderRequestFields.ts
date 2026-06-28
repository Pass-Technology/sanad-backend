import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProviderRequestFields1783000000000 implements MigrationInterface {
    name = 'AddProviderRequestFields1783000000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jobs" ADD "category" character varying`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD "location" character varying`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD "service_address" text`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD "requested_scheduled_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD "client_address_id" uuid`);
        await queryRunner.query(`ALTER TABLE "offers" ADD "uses_requested_schedule" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "offers" ADD "proposed_scheduled_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "offers" ADD "assigned_worker_id" uuid`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD "scheduled_at" TIMESTAMP`);
        await queryRunner.query(`
            CREATE TABLE "provider_job_dismissals" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "provider_id" uuid NOT NULL,
                "job_id" uuid NOT NULL,
                CONSTRAINT "UQ_provider_job_dismissal" UNIQUE ("provider_id", "job_id"),
                CONSTRAINT "PK_provider_job_dismissals" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "jobs"
            ADD CONSTRAINT "FK_jobs_client_address"
            FOREIGN KEY ("client_address_id") REFERENCES "client_addresses"("id") ON DELETE SET NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "offers"
            ADD CONSTRAINT "FK_offers_assigned_worker"
            FOREIGN KEY ("assigned_worker_id") REFERENCES "worker_profiles"("id") ON DELETE SET NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "provider_job_dismissals"
            ADD CONSTRAINT "FK_dismissals_provider"
            FOREIGN KEY ("provider_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "provider_job_dismissals"
            ADD CONSTRAINT "FK_dismissals_job"
            FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_job_dismissals" DROP CONSTRAINT "FK_dismissals_job"`);
        await queryRunner.query(`ALTER TABLE "provider_job_dismissals" DROP CONSTRAINT "FK_dismissals_provider"`);
        await queryRunner.query(`ALTER TABLE "offers" DROP CONSTRAINT "FK_offers_assigned_worker"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_jobs_client_address"`);
        await queryRunner.query(`DROP TABLE "provider_job_dismissals"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "scheduled_at"`);
        await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "assigned_worker_id"`);
        await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "proposed_scheduled_at"`);
        await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "uses_requested_schedule"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "client_address_id"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "requested_scheduled_at"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "service_address"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP COLUMN "category"`);
    }
}
