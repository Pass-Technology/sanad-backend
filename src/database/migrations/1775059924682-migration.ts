import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1775059924682 implements MigrationInterface {
    name = 'Migration1775059924682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" DROP CONSTRAINT "FK_9a81b161fff39e21037c5dcbe42"`);
        await queryRunner.query(`ALTER TABLE "provider_payments" DROP CONSTRAINT "FK_e2eb5d82f6a2f941858c2fc348c"`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" ADD CONSTRAINT "FK_9a81b161fff39e21037c5dcbe42" FOREIGN KEY ("provider_payment_id") REFERENCES "provider_payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_payments" ADD CONSTRAINT "FK_e2eb5d82f6a2f941858c2fc348c" FOREIGN KEY ("provider_profile_id") REFERENCES "provider_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_payments" DROP CONSTRAINT "FK_e2eb5d82f6a2f941858c2fc348c"`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" DROP CONSTRAINT "FK_9a81b161fff39e21037c5dcbe42"`);
        await queryRunner.query(`ALTER TABLE "provider_payments" ADD CONSTRAINT "FK_e2eb5d82f6a2f941858c2fc348c" FOREIGN KEY ("provider_profile_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_bank_transfer" ADD CONSTRAINT "FK_9a81b161fff39e21037c5dcbe42" FOREIGN KEY ("provider_payment_id") REFERENCES "provider_payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
