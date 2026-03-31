import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774949050843 implements MigrationInterface {
    name = 'Migration1774949050843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_pos" RENAME COLUMN "is_available" TO "is_enabled"`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" ADD "swift_code" character varying`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" ADD "linked_bank_account_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_sanad" DROP COLUMN "linked_bank_account_id"`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" DROP COLUMN "swift_code"`);
        await queryRunner.query(`ALTER TABLE "payment_pos" RENAME COLUMN "is_enabled" TO "is_available"`);
    }

}
