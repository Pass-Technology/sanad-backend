import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePlansRelations1773607246993 implements MigrationInterface {
    name = 'UpdatePlansRelations1773607246993'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "features" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name_en" character varying NOT NULL, "name_ar" character varying, "description_en" character varying, "description_ar" character varying, CONSTRAINT "PK_5c1e336df2f4a7051e5bf08a941" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plan_features" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "plan_id" uuid NOT NULL, "feature_id" uuid NOT NULL, "value" character varying, CONSTRAINT "PK_eb2b32d1d93a8b2e96e122e3a77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name_en" character varying NOT NULL, "name_ar" character varying, "description_en" character varying NOT NULL, "description_ar" character varying, "tag_en" character varying, "tag_ar" character varying, CONSTRAINT "PK_3720521a81c7c24fe9b7202ba61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "billing_cycles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "label_en" character varying NOT NULL, "label_ar" character varying, "months" integer NOT NULL, "discount_percentage" integer NOT NULL, "badge_en" character varying, "badge_ar" character varying, CONSTRAINT "PK_e2b9ae007fe8816495a934414bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plan_prices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "plan_id" uuid NOT NULL, "billing_cycle_id" uuid NOT NULL, "price" numeric(10,2) NOT NULL, CONSTRAINT "PK_69b05dce9891d42a3d0fc77eec1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying NOT NULL, "plan_price_id" uuid NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP, "status" character varying NOT NULL DEFAULT 'active', CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "plan_features" ADD CONSTRAINT "FK_b51952483b18fa15334d714a838" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_features" ADD CONSTRAINT "FK_27e866bdf4c6f2cf5854b7d0e57" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_prices" ADD CONSTRAINT "FK_486db649897ac5901b8e93e5b7d" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_prices" ADD CONSTRAINT "FK_f26207aa0f58d642660e3db1dd1" FOREIGN KEY ("billing_cycle_id") REFERENCES "billing_cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_32070c53993605bd3699f9ec9a6" FOREIGN KEY ("plan_price_id") REFERENCES "plan_prices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_32070c53993605bd3699f9ec9a6"`);
        await queryRunner.query(`ALTER TABLE "plan_prices" DROP CONSTRAINT "FK_f26207aa0f58d642660e3db1dd1"`);
        await queryRunner.query(`ALTER TABLE "plan_prices" DROP CONSTRAINT "FK_486db649897ac5901b8e93e5b7d"`);
        await queryRunner.query(`ALTER TABLE "plan_features" DROP CONSTRAINT "FK_27e866bdf4c6f2cf5854b7d0e57"`);
        await queryRunner.query(`ALTER TABLE "plan_features" DROP CONSTRAINT "FK_b51952483b18fa15334d714a838"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
        await queryRunner.query(`DROP TABLE "plan_prices"`);
        await queryRunner.query(`DROP TABLE "billing_cycles"`);
        await queryRunner.query(`DROP TABLE "plans"`);
        await queryRunner.query(`DROP TABLE "plan_features"`);
        await queryRunner.query(`DROP TABLE "features"`);
    }

}
