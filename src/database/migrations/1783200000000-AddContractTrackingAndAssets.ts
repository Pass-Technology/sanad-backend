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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "has_been_completed"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "has_been_started"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "worker_ending_date"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "client_ending_date"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "worker_starting_date"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "client_starting_date"`);
    }
}
