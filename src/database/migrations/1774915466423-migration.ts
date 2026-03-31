import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774915466423 implements MigrationInterface {
    name = 'Migration1774915466423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment_cash" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_enabled" boolean NOT NULL DEFAULT false, "notes" text, "provider_payment_id" uuid, CONSTRAINT "PK_a4bb63b718d7dd53581f2e9d827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment_bank_transfer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_enabled" boolean NOT NULL DEFAULT false, "bank_name" character varying, "account_holder_name" character varying, "account_number" character varying, "iban" character varying, "provider_payment_id" uuid, CONSTRAINT "PK_17470e1ba9584b8be008a594c61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment_link" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_enabled" boolean NOT NULL DEFAULT false, "provider_name" character varying NOT NULL, "account_email_or_merchant_id" character varying NOT NULL, "api_key" character varying, "callback_url" character varying, "provider_payment_id" uuid, CONSTRAINT "PK_0f9650efa36bead30593038140c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment_sanad" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_enabled" boolean NOT NULL DEFAULT false, "settlement_preference" character varying NOT NULL, "bank_name" character varying, "account_holder_name" character varying, "account_number" character varying, "iban" character varying, "provider_payment_id" uuid, CONSTRAINT "PK_c3984694779fc5bc3425566d32d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment_pos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_available" boolean NOT NULL DEFAULT false, "provider_name" character varying, "device_id" character varying, "supported_cards" text, "provider_payment_id" uuid, CONSTRAINT "PK_26e42385c13bc53355b5daa588f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment_cheque" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_enabled" boolean NOT NULL DEFAULT false, "bank_name" character varying, "payee_name" character varying, "provider_payment_id" uuid, CONSTRAINT "PK_16326d4cb6334521f672822213f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "provider_payments" DROP COLUMN "bank_name"`);
        await queryRunner.query(`ALTER TABLE "provider_payments" DROP COLUMN "account_holder_name"`);
        await queryRunner.query(`ALTER TABLE "provider_payments" DROP COLUMN "account_number"`);
        await queryRunner.query(`ALTER TABLE "provider_payments" DROP COLUMN "iban"`);
        await queryRunner.query(`ALTER TABLE "provider_payments" DROP COLUMN "payment_method_ids"`);
        await queryRunner.query(`ALTER TABLE "payment_cash" ADD CONSTRAINT "FK_f3520c780d99ae230bb19d8d8e6" FOREIGN KEY ("provider_payment_id") REFERENCES "provider_payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" ADD CONSTRAINT "FK_9a81b161fff39e21037c5dcbe42" FOREIGN KEY ("provider_payment_id") REFERENCES "provider_payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_link" ADD CONSTRAINT "FK_11e81bc5323e60eceb9dfe5d748" FOREIGN KEY ("provider_payment_id") REFERENCES "provider_payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" ADD CONSTRAINT "FK_ccaa5bc63316cdeca929e97d2b1" FOREIGN KEY ("provider_payment_id") REFERENCES "provider_payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_pos" ADD CONSTRAINT "FK_b34b2b5c8eb1efba763237fb0d6" FOREIGN KEY ("provider_payment_id") REFERENCES "provider_payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_cheque" ADD CONSTRAINT "FK_f928f2bf445c88b7f4703d5fc22" FOREIGN KEY ("provider_payment_id") REFERENCES "provider_payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_cheque" DROP CONSTRAINT "FK_f928f2bf445c88b7f4703d5fc22"`);
        await queryRunner.query(`ALTER TABLE "payment_pos" DROP CONSTRAINT "FK_b34b2b5c8eb1efba763237fb0d6"`);
        await queryRunner.query(`ALTER TABLE "payment_sanad" DROP CONSTRAINT "FK_ccaa5bc63316cdeca929e97d2b1"`);
        await queryRunner.query(`ALTER TABLE "payment_link" DROP CONSTRAINT "FK_11e81bc5323e60eceb9dfe5d748"`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" DROP CONSTRAINT "FK_9a81b161fff39e21037c5dcbe42"`);
        await queryRunner.query(`ALTER TABLE "payment_cash" DROP CONSTRAINT "FK_f3520c780d99ae230bb19d8d8e6"`);
        await queryRunner.query(`ALTER TABLE "provider_payments" ADD "payment_method_ids" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "provider_payments" ADD "iban" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "provider_payments" ADD "account_number" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "provider_payments" ADD "account_holder_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "provider_payments" ADD "bank_name" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "payment_cheque"`);
        await queryRunner.query(`DROP TABLE "payment_pos"`);
        await queryRunner.query(`DROP TABLE "payment_sanad"`);
        await queryRunner.query(`DROP TABLE "payment_link"`);
        await queryRunner.query(`DROP TABLE "payment_bank_transfer"`);
        await queryRunner.query(`DROP TABLE "payment_cash"`);
    }

}
