import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1775487836912 implements MigrationInterface {
    name = 'Migration1775487836912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lookup_payment" RENAME COLUMN "category" TO "category_id"`);
        await queryRunner.query(`CREATE TABLE "lookup_payment_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "label_en" character varying NOT NULL, "label_ar" character varying NOT NULL, "static_code" character varying NOT NULL, CONSTRAINT "PK_eb0b1089f941d08ba503b0bfb4d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lookup_payment" DROP COLUMN "category_id"`);
        await queryRunner.query(`ALTER TABLE "lookup_payment" ADD "category_id" uuid`);
        await queryRunner.query(`ALTER TABLE "lookup_payment" ADD CONSTRAINT "FK_eb0b1089f941d08ba503b0bfb4d" FOREIGN KEY ("category_id") REFERENCES "lookup_payment_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lookup_payment" DROP CONSTRAINT "FK_eb0b1089f941d08ba503b0bfb4d"`);
        await queryRunner.query(`ALTER TABLE "lookup_payment" DROP COLUMN "category_id"`);
        await queryRunner.query(`ALTER TABLE "lookup_payment" ADD "category_id" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "lookup_payment_category"`);
        await queryRunner.query(`ALTER TABLE "lookup_payment" RENAME COLUMN "category_id" TO "category"`);
    }

}
