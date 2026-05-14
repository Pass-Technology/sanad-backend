import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1778761610457 implements MigrationInterface {
    name = 'Migration1778761610457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."provider_documents_status_enum" AS ENUM('APPROVED', 'UNDER_REVIEW', 'EXPIRED', 'MISSING')`);
        await queryRunner.query(`CREATE TYPE "public"."provider_documents_required_for_enum" AS ENUM('Provider Profile', 'Service Activation', 'Compliance', 'Finance')`);
        await queryRunner.query(`CREATE TABLE "provider_documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" character varying NOT NULL, "file_url" character varying, "expiry_date" TIMESTAMP, "status" "public"."provider_documents_status_enum" NOT NULL DEFAULT 'MISSING', "required_for" "public"."provider_documents_required_for_enum" NOT NULL DEFAULT 'Compliance', "provider_id" uuid NOT NULL, CONSTRAINT "PK_bc3bb226a18aa1bbae0baa7df15" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "provider_services" ADD "is_emergency_enabled" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "is_emergency_mode_active" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "provider_documents" ADD CONSTRAINT "FK_e585bd5e4e94f4e0a555015b572" FOREIGN KEY ("provider_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_documents" DROP CONSTRAINT "FK_e585bd5e4e94f4e0a555015b572"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "is_emergency_mode_active"`);
        await queryRunner.query(`ALTER TABLE "provider_services" DROP COLUMN "is_emergency_enabled"`);
        await queryRunner.query(`DROP TABLE "provider_documents"`);
        await queryRunner.query(`DROP TYPE "public"."provider_documents_required_for_enum"`);
        await queryRunner.query(`DROP TYPE "public"."provider_documents_status_enum"`);
    }

}
