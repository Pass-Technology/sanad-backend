import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774994736572 implements MigrationInterface {
    name = 'Migration1774994736572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_cash" DROP CONSTRAINT "FK_f3520c780d99ae230bb19d8d8e6"`);
        await queryRunner.query(`ALTER TABLE "payment_cash" ADD CONSTRAINT "UQ_f3520c780d99ae230bb19d8d8e6" UNIQUE ("provider_payment_id")`);
        await queryRunner.query(`ALTER TABLE "payment_cheque" DROP CONSTRAINT "FK_f928f2bf445c88b7f4703d5fc22"`);
        await queryRunner.query(`ALTER TABLE "payment_cheque" ADD CONSTRAINT "UQ_f928f2bf445c88b7f4703d5fc22" UNIQUE ("provider_payment_id")`);
        await queryRunner.query(`ALTER TABLE "payment_cash" ADD CONSTRAINT "FK_f3520c780d99ae230bb19d8d8e6" FOREIGN KEY ("provider_payment_id") REFERENCES "provider_payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_cheque" ADD CONSTRAINT "FK_f928f2bf445c88b7f4703d5fc22" FOREIGN KEY ("provider_payment_id") REFERENCES "provider_payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_cheque" DROP CONSTRAINT "FK_f928f2bf445c88b7f4703d5fc22"`);
        await queryRunner.query(`ALTER TABLE "payment_cash" DROP CONSTRAINT "FK_f3520c780d99ae230bb19d8d8e6"`);
        await queryRunner.query(`ALTER TABLE "payment_cheque" DROP CONSTRAINT "UQ_f928f2bf445c88b7f4703d5fc22"`);
        await queryRunner.query(`ALTER TABLE "payment_cheque" ADD CONSTRAINT "FK_f928f2bf445c88b7f4703d5fc22" FOREIGN KEY ("provider_payment_id") REFERENCES "provider_payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_cash" DROP CONSTRAINT "UQ_f3520c780d99ae230bb19d8d8e6"`);
        await queryRunner.query(`ALTER TABLE "payment_cash" ADD CONSTRAINT "FK_f3520c780d99ae230bb19d8d8e6" FOREIGN KEY ("provider_payment_id") REFERENCES "provider_payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
