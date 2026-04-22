import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1776866460097 implements MigrationInterface {
    name = 'Migration1776866460097'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."asset_types_name_enum" AS ENUM('IMAGE', 'PDF', 'DOCUMENT')`);
        await queryRunner.query(`CREATE TABLE "asset_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" "public"."asset_types_name_enum" NOT NULL, CONSTRAINT "UQ_637155978e16c108cd4fc721b78" UNIQUE ("name"), CONSTRAINT "PK_2cf0314bcc4351b7f2827d57edb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."assets_owner_type_enum" AS ENUM('USER', 'PROFILE', 'SERVICE')`);
        await queryRunner.query(`CREATE TABLE "assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "file_name" character varying NOT NULL, "original_name" character varying NOT NULL, "mime_type" character varying NOT NULL, "size" bigint NOT NULL, "path" character varying NOT NULL, "url" character varying, "provider" character varying NOT NULL DEFAULT 'local', "owner_id" character varying NOT NULL, "owner_type" "public"."assets_owner_type_enum" NOT NULL, "type_id" uuid NOT NULL, CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "assets" ADD CONSTRAINT "FK_7126d40b8466efb8375216d6d02" FOREIGN KEY ("type_id") REFERENCES "asset_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" DROP CONSTRAINT "FK_7126d40b8466efb8375216d6d02"`);
        await queryRunner.query(`DROP TABLE "assets"`);
        await queryRunner.query(`DROP TYPE "public"."assets_owner_type_enum"`);
        await queryRunner.query(`DROP TABLE "asset_types"`);
        await queryRunner.query(`DROP TYPE "public"."asset_types_name_enum"`);
    }

}
