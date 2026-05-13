import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1778690689590 implements MigrationInterface {
    name = 'Migration1778690689590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_service_requests" ADD "estimated_duration_minutes" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_service_requests" DROP COLUMN "estimated_duration_minutes"`);
    }

}
