import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1775479130770 implements MigrationInterface {
    name = 'Migration1775479130770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lookup_payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "label_en" character varying NOT NULL, "label_ar" character varying NOT NULL, "static_code" character varying NOT NULL, "category" character varying NOT NULL, CONSTRAINT "PK_e54e070017e31e683c01bde6e59" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "lookup_payment"`);
    }

}
