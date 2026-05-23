import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1779294526983 implements MigrationInterface {
    name = 'Migration1779294526983'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lookup_units" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "label_en" character varying NOT NULL, "label_ar" character varying NOT NULL, "static_code" character varying NOT NULL, CONSTRAINT "PK_b4ef024ec36e40f836a54863d63" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lookup_currencies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "label_en" character varying NOT NULL, "label_ar" character varying NOT NULL, "static_code" character varying NOT NULL, "symbol" character varying, "emoji" character varying, CONSTRAINT "PK_f3d0c2467c5ff234a4ff76007a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "provider_service_pricing" ADD "unit_id" uuid`);
        await queryRunner.query(`ALTER TABLE "provider_service_pricing" ADD "currency_id" uuid`);
        await queryRunner.query(`ALTER TABLE "provider_service_pricing" ADD CONSTRAINT "FK_cadeafa1e4d4a8e7263d7a0f7d0" FOREIGN KEY ("unit_id") REFERENCES "lookup_units"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_service_pricing" ADD CONSTRAINT "FK_c18c6384104a029f1b34121e0e2" FOREIGN KEY ("currency_id") REFERENCES "lookup_currencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_service_pricing" DROP CONSTRAINT "FK_c18c6384104a029f1b34121e0e2"`);
        await queryRunner.query(`ALTER TABLE "provider_service_pricing" DROP CONSTRAINT "FK_cadeafa1e4d4a8e7263d7a0f7d0"`);
        await queryRunner.query(`ALTER TABLE "provider_service_pricing" DROP COLUMN "currency_id"`);
        await queryRunner.query(`ALTER TABLE "provider_service_pricing" DROP COLUMN "unit_id"`);
        await queryRunner.query(`DROP TABLE "lookup_currencies"`);
        await queryRunner.query(`DROP TABLE "lookup_units"`);
    }

}
