import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContractTrackingAndAssets1783200000000 implements MigrationInterface {
    name = 'AddContractTrackingAndAssets1783200000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" ADD "client_starting_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD "worker_starting_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD "client_ending_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD "worker_ending_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD "has_been_started" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD "has_been_completed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`
            CREATE TABLE "contract_assets" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "image_url" character varying NOT NULL,
                "caption" text,
                "contract_id" uuid NOT NULL,
                "uploaded_by_worker_id" uuid,
                CONSTRAINT "PK_contract_assets" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "contract_assets"
            ADD CONSTRAINT "FK_contract_assets_contract"
            FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "contract_assets"
            ADD CONSTRAINT "FK_contract_assets_worker"
            FOREIGN KEY ("uploaded_by_worker_id") REFERENCES "worker_profiles"("id") ON DELETE SET NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_assets" DROP CONSTRAINT "FK_contract_assets_worker"`);
        await queryRunner.query(`ALTER TABLE "contract_assets" DROP CONSTRAINT "FK_contract_assets_contract"`);
        await queryRunner.query(`DROP TABLE "contract_assets"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "has_been_completed"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "has_been_started"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "worker_ending_date"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "client_ending_date"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "worker_starting_date"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "client_starting_date"`);
    }
}
