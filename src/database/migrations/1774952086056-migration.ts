import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774952086056 implements MigrationInterface {
    name = 'Migration1774952086056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bank_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "bank_name" character varying NOT NULL, "account_holder_name" character varying NOT NULL, "account_number" character varying, "iban" character varying NOT NULL, "swift_code" character varying, "provider_payment_id" uuid, CONSTRAINT "PK_c872de764f2038224a013ff25ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" DROP COLUMN "account_holder_name"`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" DROP COLUMN "account_number"`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" DROP COLUMN "iban"`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" DROP COLUMN "swift_code"`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" DROP COLUMN "bank_name"`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" DROP COLUMN "bank_name"`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" DROP COLUMN "account_holder_name"`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" DROP COLUMN "account_number"`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" DROP COLUMN "iban"`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" DROP COLUMN "linked_bank_account_id"`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" ADD "bank_account_id" uuid`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" ADD "use_existing_bank_transfer_account" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" ADD "bank_account_id" uuid`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD CONSTRAINT "FK_5ce6661744b225360927a6bebf1" FOREIGN KEY ("provider_payment_id") REFERENCES "provider_payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" ADD CONSTRAINT "FK_5890b65ede2d0bfd0069d573b75" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" ADD CONSTRAINT "FK_46a1476e8cb4968ef9ab859fd2e" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_sanad" DROP CONSTRAINT "FK_46a1476e8cb4968ef9ab859fd2e"`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" DROP CONSTRAINT "FK_5890b65ede2d0bfd0069d573b75"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP CONSTRAINT "FK_5ce6661744b225360927a6bebf1"`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" DROP COLUMN "bank_account_id"`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" DROP COLUMN "use_existing_bank_transfer_account"`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" DROP COLUMN "bank_account_id"`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" ADD "linked_bank_account_id" character varying`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" ADD "iban" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" ADD "account_number" character varying`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" ADD "account_holder_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" ADD "bank_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" ADD "bank_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" ADD "swift_code" character varying`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" ADD "iban" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" ADD "account_number" character varying`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" ADD "account_holder_name" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "bank_accounts"`);
    }

}
