import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1775637819688 implements MigrationInterface {
    name = 'Migration1775637819688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "request_services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name_ar" character varying, "name_en" character varying, "description" text, "user_id" uuid, CONSTRAINT "PK_23aec85ef9a815be27fa1086369" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "request_services" ADD CONSTRAINT "FK_8314341cd5e391016a7af059a0c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_services" DROP CONSTRAINT "FK_8314341cd5e391016a7af059a0c"`);
        await queryRunner.query(`DROP TABLE "request_services"`);
    }

}
