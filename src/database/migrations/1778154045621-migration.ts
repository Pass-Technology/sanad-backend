import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1778154045621 implements MigrationInterface {
    name = 'Migration1778154045621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "client_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "REL_542bfcd136b7ef76af7e4edf1d" UNIQUE ("user_id"), CONSTRAINT "PK_fc4acd4b04f4a0537e7213f8ddd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_type_enum" AS ENUM('client', 'provider')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "type" "public"."users_type_enum" NOT NULL DEFAULT 'provider'`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_5d1880ed16ff13ea6fd9bca019d"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "UQ_5d1880ed16ff13ea6fd9bca019d" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "client_profiles" ADD CONSTRAINT "FK_542bfcd136b7ef76af7e4edf1d7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_5d1880ed16ff13ea6fd9bca019d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_5d1880ed16ff13ea6fd9bca019d"`);
        await queryRunner.query(`ALTER TABLE "client_profiles" DROP CONSTRAINT "FK_542bfcd136b7ef76af7e4edf1d7"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "UQ_5d1880ed16ff13ea6fd9bca019d"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_5d1880ed16ff13ea6fd9bca019d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."users_type_enum"`);
        await queryRunner.query(`DROP TABLE "client_profiles"`);
    }

}
