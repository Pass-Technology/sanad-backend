import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1777811494791 implements MigrationInterface {
    name = 'Migration1777811494791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "legal_documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "language" character varying(5) NOT NULL, "content" jsonb NOT NULL, CONSTRAINT "PK_846b11262368906ded5d26ac271" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e6b60af96c822f54518efb5d38" ON "legal_documents" ("language") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_e6b60af96c822f54518efb5d38"`);
        await queryRunner.query(`DROP TABLE "legal_documents"`);
    }

}
