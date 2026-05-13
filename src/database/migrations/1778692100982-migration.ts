import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1778692100982 implements MigrationInterface {
    name = 'Migration1778692100982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "rating" integer NOT NULL, "comment" text, "tags" jsonb, "photos" jsonb, "provider_reply" text, "replied_at" TIMESTAMP, "is_verified" boolean NOT NULL DEFAULT true, "job_id" uuid NOT NULL, "client_id" uuid NOT NULL, "provider_id" uuid NOT NULL, CONSTRAINT "REL_6b129b5f4433000c7f97399bfe" UNIQUE ("job_id"), CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_6b129b5f4433000c7f97399bfe9" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_d4e7e923e6bb78a8f0add754493" FOREIGN KEY ("client_id") REFERENCES "client_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_ba7ceb19946b8b23bf5939c930f" FOREIGN KEY ("provider_id") REFERENCES "provider_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_ba7ceb19946b8b23bf5939c930f"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_d4e7e923e6bb78a8f0add754493"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_6b129b5f4433000c7f97399bfe9"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
    }

}
