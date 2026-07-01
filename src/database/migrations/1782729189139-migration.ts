import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1782729189139 implements MigrationInterface {
    name = 'Migration1782729189139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" ADD "uploaded_by_user_id" uuid`);
        await queryRunner.query(`ALTER TYPE "public"."assets_owner_type_enum" RENAME TO "assets_owner_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."assets_owner_type_enum" AS ENUM('PROVIDER_PROFILE', 'CLIENT_PROFILE', 'BRANCH', 'PROVIDER_SERVICE', 'PROVIDER_DOCUMENT', 'BLOG', 'REVIEW', 'JOB')`);
        await queryRunner.query(`ALTER TABLE "assets" ALTER COLUMN "owner_type" TYPE "public"."assets_owner_type_enum" USING "owner_type"::"text"::"public"."assets_owner_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."assets_owner_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."assets_owner_type_enum_old" AS ENUM('USER', 'PROFILE', 'SERVICE')`);
        await queryRunner.query(`ALTER TABLE "assets" ALTER COLUMN "owner_type" TYPE "public"."assets_owner_type_enum_old" USING "owner_type"::"text"::"public"."assets_owner_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."assets_owner_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."assets_owner_type_enum_old" RENAME TO "assets_owner_type_enum"`);
        await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "uploaded_by_user_id"`);
    }

}
