import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1777901079929 implements MigrationInterface {
    name = 'Migration1777901079929'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lookup_nationalities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "label_en" character varying NOT NULL, "label_ar" character varying NOT NULL, "static_code" character varying NOT NULL, "flag" character varying, CONSTRAINT "PK_d519bfbf7f31b014ad621f01c7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lookup_cities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "label_en" character varying NOT NULL, "label_ar" character varying NOT NULL, "static_code" character varying NOT NULL, CONSTRAINT "PK_1539d827c8477712ce51f117495" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "lookup_cities"`);
        await queryRunner.query(`DROP TABLE "lookup_nationalities"`);
    }

}
