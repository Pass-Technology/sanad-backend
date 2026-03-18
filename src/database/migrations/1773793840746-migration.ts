import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773793840746 implements MigrationInterface {
    name = 'Migration1773793840746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "provider_profile_services" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "services" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "categories" CASCADE`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "name_ar" character varying NOT NULL, "icon" character varying, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "name_ar" character varying NOT NULL, "depth" integer NOT NULL DEFAULT '0', "sort_order" integer NOT NULL DEFAULT '0', "is_leaf" boolean NOT NULL DEFAULT true, "is_active" boolean NOT NULL DEFAULT true, "categoryId" uuid, "parentId" uuid, CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "provider_profile_services" ("profile_id" uuid NOT NULL, "service_id" uuid NOT NULL, CONSTRAINT "PK_d2c67122a49909d5b0cf407b665" PRIMARY KEY ("profile_id", "service_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_06e8ce7266e33ec7eb14f34f47" ON "provider_profile_services" ("profile_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_0cd76cf57becb9af7bd3164873" ON "provider_profile_services" ("service_id") `);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN IF EXISTS "selected_service_ids"`);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_034b52310c2d211bc979c3cc4e8" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_d860550b16be1d54b1d9877b89c" FOREIGN KEY ("parentId") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_profile_services" ADD CONSTRAINT "FK_06e8ce7266e33ec7eb14f34f47e" FOREIGN KEY ("profile_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "provider_profile_services" ADD CONSTRAINT "FK_0cd76cf57becb9af7bd3164873a" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_profile_services" DROP CONSTRAINT "FK_0cd76cf57becb9af7bd3164873a"`);
        await queryRunner.query(`ALTER TABLE "provider_profile_services" DROP CONSTRAINT "FK_06e8ce7266e33ec7eb14f34f47e"`);
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_d860550b16be1d54b1d9877b89c"`);
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_034b52310c2d211bc979c3cc4e8"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "selected_service_ids" text`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0cd76cf57becb9af7bd3164873"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_06e8ce7266e33ec7eb14f34f47"`);
        await queryRunner.query(`DROP TABLE "provider_profile_services"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
