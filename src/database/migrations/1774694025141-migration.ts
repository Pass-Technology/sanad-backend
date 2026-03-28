import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774694025141 implements MigrationInterface {
    name = 'Migration1774694025141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "billing_cycles" DROP CONSTRAINT "FK_08ca22886a47a4a854087a091d0"`);
        await queryRunner.query(`CREATE TABLE "billing_cycles_provider_types_lookup_provider_type" ("billing_cycles_id" uuid NOT NULL, "lookup_provider_type_id" uuid NOT NULL, CONSTRAINT "PK_6ed7f074878fbce8713d74028d9" PRIMARY KEY ("billing_cycles_id", "lookup_provider_type_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_854e797c3f9a242a94f317ef20" ON "billing_cycles_provider_types_lookup_provider_type" ("billing_cycles_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_0d9c8b38edf398c240b25562a7" ON "billing_cycles_provider_types_lookup_provider_type" ("lookup_provider_type_id") `);
        await queryRunner.query(`ALTER TABLE "billing_cycles" DROP COLUMN "provider_type_id"`);
        await queryRunner.query(`ALTER TABLE "plans" ADD "provider_type_id" uuid`);
        await queryRunner.query(`ALTER TABLE "plans" ADD CONSTRAINT "FK_af46370eb77b38658e2c40a70e3" FOREIGN KEY ("provider_type_id") REFERENCES "lookup_provider_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "billing_cycles_provider_types_lookup_provider_type" ADD CONSTRAINT "FK_854e797c3f9a242a94f317ef206" FOREIGN KEY ("billing_cycles_id") REFERENCES "billing_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "billing_cycles_provider_types_lookup_provider_type" ADD CONSTRAINT "FK_0d9c8b38edf398c240b25562a7f" FOREIGN KEY ("lookup_provider_type_id") REFERENCES "lookup_provider_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "billing_cycles_provider_types_lookup_provider_type" DROP CONSTRAINT "FK_0d9c8b38edf398c240b25562a7f"`);
        await queryRunner.query(`ALTER TABLE "billing_cycles_provider_types_lookup_provider_type" DROP CONSTRAINT "FK_854e797c3f9a242a94f317ef206"`);
        await queryRunner.query(`ALTER TABLE "plans" DROP CONSTRAINT "FK_af46370eb77b38658e2c40a70e3"`);
        await queryRunner.query(`ALTER TABLE "plans" DROP COLUMN "provider_type_id"`);
        await queryRunner.query(`ALTER TABLE "billing_cycles" ADD "provider_type_id" uuid`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0d9c8b38edf398c240b25562a7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_854e797c3f9a242a94f317ef20"`);
        await queryRunner.query(`DROP TABLE "billing_cycles_provider_types_lookup_provider_type"`);
        await queryRunner.query(`ALTER TABLE "billing_cycles" ADD CONSTRAINT "FK_08ca22886a47a4a854087a091d0" FOREIGN KEY ("provider_type_id") REFERENCES "lookup_provider_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
