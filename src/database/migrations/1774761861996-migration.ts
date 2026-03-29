import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774761861996 implements MigrationInterface {
    name = 'Migration1774761861996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lookup_languages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "label_en" character varying NOT NULL, "label_ar" character varying NOT NULL, "static_code" character varying NOT NULL, "flag" character varying NOT NULL, CONSTRAINT "PK_9901f0ce928695da7cef3ec0e9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "provider_profile_languages" ("profile_id" uuid NOT NULL, "language_id" uuid NOT NULL, CONSTRAINT "PK_9af45583b764f0e6206cd7ee3ae" PRIMARY KEY ("profile_id", "language_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b00b0e7426df29a94e6d9fe3f0" ON "provider_profile_languages" ("profile_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a3728d3ee9a0c9dd437b6b26e7" ON "provider_profile_languages" ("language_id") `);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "languages_spoken"`);
        await queryRunner.query(`ALTER TABLE "provider_profile_languages" ADD CONSTRAINT "FK_b00b0e7426df29a94e6d9fe3f0d" FOREIGN KEY ("profile_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "provider_profile_languages" ADD CONSTRAINT "FK_a3728d3ee9a0c9dd437b6b26e70" FOREIGN KEY ("language_id") REFERENCES "lookup_languages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_profile_languages" DROP CONSTRAINT "FK_a3728d3ee9a0c9dd437b6b26e70"`);
        await queryRunner.query(`ALTER TABLE "provider_profile_languages" DROP CONSTRAINT "FK_b00b0e7426df29a94e6d9fe3f0d"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "languages_spoken" text`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a3728d3ee9a0c9dd437b6b26e7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b00b0e7426df29a94e6d9fe3f0"`);
        await queryRunner.query(`DROP TABLE "provider_profile_languages"`);
        await queryRunner.query(`DROP TABLE "lookup_languages"`);
    }

}
