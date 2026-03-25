import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774413495887 implements MigrationInterface {
    name = 'Migration1774413495887'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."otps_purpose_enum" AS ENUM('login', 'register', 'forgot_password', 'change_password', 'change_email', 'change_mobile', 'verify_email', 'verify_mobile')`);
        await queryRunner.query(`ALTER TABLE "otps" ADD "purpose" "public"."otps_purpose_enum" NOT NULL DEFAULT 'login'`);
        await queryRunner.query(`ALTER TABLE "plan_features" ALTER COLUMN "name_en" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_features" ALTER COLUMN "name_en" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "purpose"`);
        await queryRunner.query(`DROP TYPE "public"."otps_purpose_enum"`);
    }

}
