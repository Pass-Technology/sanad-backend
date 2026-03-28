import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774692596403 implements MigrationInterface {
    name = 'Migration1774692596403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "billing_cycles" RENAME COLUMN "display_order" TO "provider_type_id"`);
        await queryRunner.query(`ALTER TABLE "plans" DROP COLUMN "display_order"`);
        await queryRunner.query(`ALTER TABLE "billing_cycles" DROP COLUMN "provider_type_id"`);
        await queryRunner.query(`ALTER TABLE "billing_cycles" ADD "provider_type_id" uuid`);
        await queryRunner.query(`ALTER TABLE "billing_cycles" ADD CONSTRAINT "FK_08ca22886a47a4a854087a091d0" FOREIGN KEY ("provider_type_id") REFERENCES "lookup_provider_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "billing_cycles" DROP CONSTRAINT "FK_08ca22886a47a4a854087a091d0"`);
        await queryRunner.query(`ALTER TABLE "billing_cycles" DROP COLUMN "provider_type_id"`);
        await queryRunner.query(`ALTER TABLE "billing_cycles" ADD "provider_type_id" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "plans" ADD "display_order" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "billing_cycles" RENAME COLUMN "provider_type_id" TO "display_order"`);
    }

}
