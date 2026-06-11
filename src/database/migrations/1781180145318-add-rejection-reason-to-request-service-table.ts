import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRejectionReasonToRequestServiceTable1781180145318 implements MigrationInterface {
    name = 'AddRejectionReasonToRequestServiceTable1781180145318';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_services" ADD "rejection_reason" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_services" DROP COLUMN "rejection_reason"`);
    }
}
