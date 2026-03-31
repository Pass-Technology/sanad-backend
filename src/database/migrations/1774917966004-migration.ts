import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774917966004 implements MigrationInterface {
    name = 'Migration1774917966004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" ALTER COLUMN "bank_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" ALTER COLUMN "account_holder_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" ALTER COLUMN "iban" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" ALTER COLUMN "bank_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" ALTER COLUMN "account_holder_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" ALTER COLUMN "iban" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_pos" ALTER COLUMN "provider_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_cheque" ALTER COLUMN "bank_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_cheque" ALTER COLUMN "payee_name" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_cheque" ALTER COLUMN "payee_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_cheque" ALTER COLUMN "bank_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_pos" ALTER COLUMN "provider_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" ALTER COLUMN "iban" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" ALTER COLUMN "account_holder_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" ALTER COLUMN "bank_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" ALTER COLUMN "iban" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" ALTER COLUMN "account_holder_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" ALTER COLUMN "bank_name" DROP NOT NULL`);
    }

}
