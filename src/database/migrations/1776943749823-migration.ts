import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1776943749823 implements MigrationInterface {
    name = 'Migration1776943749823'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "provider_service_pricing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "description" text, "price" numeric(10,2) NOT NULL DEFAULT '0', "provider_service_id" uuid, CONSTRAINT "PK_17e617f1d2c638a695ebf288b6b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "provider_services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "description" text, "profile_id" uuid, "service_id" uuid, CONSTRAINT "PK_c907262c804f6e6a2888ed5e630" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "provider_service_pricing" ADD CONSTRAINT "FK_9c16befca42d8199eaea0107d10" FOREIGN KEY ("provider_service_id") REFERENCES "provider_services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_services" ADD CONSTRAINT "FK_541157e1c5dbdf2a961170d799b" FOREIGN KEY ("profile_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_services" ADD CONSTRAINT "FK_4155bec585f9bf02e99ba19a34c" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_services" DROP CONSTRAINT "FK_4155bec585f9bf02e99ba19a34c"`);
        await queryRunner.query(`ALTER TABLE "provider_services" DROP CONSTRAINT "FK_541157e1c5dbdf2a961170d799b"`);
        await queryRunner.query(`ALTER TABLE "provider_service_pricing" DROP CONSTRAINT "FK_9c16befca42d8199eaea0107d10"`);
        await queryRunner.query(`DROP TABLE "provider_services"`);
        await queryRunner.query(`DROP TABLE "provider_service_pricing"`);
    }

}
