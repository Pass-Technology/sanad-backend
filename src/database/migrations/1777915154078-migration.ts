import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1777915154078 implements MigrationInterface {
    name = 'Migration1777915154078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_e6b60af96c822f54518efb5d38"`);
        await queryRunner.query(`CREATE TYPE "public"."legal_documents_type_enum" AS ENUM('privacyPolicy', 'termsOfService')`);
        await queryRunner.query(`ALTER TABLE "legal_documents" ADD "type" "public"."legal_documents_type_enum"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_7b3529d5a134f00d02af054d30" ON "legal_documents" ("language", "type") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_7b3529d5a134f00d02af054d30"`);
        await queryRunner.query(`ALTER TABLE "legal_documents" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."legal_documents_type_enum"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e6b60af96c822f54518efb5d38" ON "legal_documents" ("language") `);
    }

}
