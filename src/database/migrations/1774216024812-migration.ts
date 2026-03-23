import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774216024812 implements MigrationInterface {
    name = 'Migration1774216024812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "billing_cycles" DROP COLUMN "discount_percentage"`);
        await queryRunner.query(`ALTER TABLE "billing_cycles" ADD "discount_percentage" numeric(5,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "billing_cycles" DROP COLUMN "discount_percentage"`);
        await queryRunner.query(`ALTER TABLE "billing_cycles" ADD "discount_percentage" integer NOT NULL`);
    }

}
