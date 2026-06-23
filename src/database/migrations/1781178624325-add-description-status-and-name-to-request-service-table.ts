import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescriptionStatusAndNameToRequestServiceTable1781178624325 implements MigrationInterface {
    name = 'AddDescriptionStatusAndNameToRequestServiceTable1781178624325';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_services" ADD "description" text NOT NULL DEFAULT ''`);
        await queryRunner.query(
            `ALTER TABLE "request_services" ADD "status" "public"."status" NOT NULL DEFAULT 'PENDING'`,
        );
        await queryRunner.query(`ALTER TABLE "request_services" DROP COLUMN "name"`);
        await queryRunner.query(
            `ALTER TABLE "request_services" ADD "name" jsonb NOT NULL DEFAULT '{"en":"Service name","ar":"اسم الخدمة"}'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_services" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "request_services" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "request_services" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "request_services" DROP COLUMN "description"`);
    }
}
