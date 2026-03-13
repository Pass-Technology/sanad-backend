import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773370521044 implements MigrationInterface {
    name = 'Migration1773370521044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otps" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "otps" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "otps" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "otps" ADD CONSTRAINT "FK_3938bb24b38ad395af30230bded" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otps" DROP CONSTRAINT "FK_3938bb24b38ad395af30230bded"`);
        await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "updated_at"`);
    }

}
