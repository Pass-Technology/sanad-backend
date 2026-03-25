import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774415239763 implements MigrationInterface {
    name = 'Migration1774415239763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."otps_purpose_enum" RENAME TO "otps_purpose_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."otps_purpose_enum" AS ENUM('REGISTER', 'FORGOT_PASSWORD')`);
        await queryRunner.query(`ALTER TABLE "otps" ALTER COLUMN "purpose" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "otps" ALTER COLUMN "purpose" TYPE "public"."otps_purpose_enum" USING (
            CASE 
                WHEN "purpose"::text = 'login' THEN 'REGISTER'
                WHEN "purpose"::text = 'register' THEN 'REGISTER'
                WHEN "purpose"::text = 'forgot_password' THEN 'FORGOT_PASSWORD'
                WHEN "purpose"::text = 'REGISTER' THEN 'REGISTER'
                WHEN "purpose"::text = 'FORGOT_PASSWORD' THEN 'FORGOT_PASSWORD'
                ELSE 'REGISTER'
            END
        )::"public"."otps_purpose_enum"`);
        await queryRunner.query(`DROP TYPE "public"."otps_purpose_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."otps_purpose_enum_old" AS ENUM('login', 'register', 'forgot_password', 'change_password', 'change_email', 'change_mobile', 'verify_email', 'verify_mobile')`);
        await queryRunner.query(`ALTER TABLE "otps" ALTER COLUMN "purpose" TYPE "public"."otps_purpose_enum_old" USING "purpose"::"text"::"public"."otps_purpose_enum_old"`);
        await queryRunner.query(`ALTER TABLE "otps" ALTER COLUMN "purpose" SET DEFAULT 'login'`);
        await queryRunner.query(`DROP TYPE "public"."otps_purpose_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."otps_purpose_enum_old" RENAME TO "otps_purpose_enum"`);
    }

}
