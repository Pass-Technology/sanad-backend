import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1778763119129 implements MigrationInterface {
    name = 'Migration1778763119129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_af08fad7c04bb85403970afdc1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_310667f935698fcd8cb319113a"`);
        await queryRunner.query(`CREATE TABLE "notification_preferences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "channels" jsonb NOT NULL DEFAULT '{"push":true,"inApp":true,"email":true,"whatsapp":false,"sms":false}', "categories" jsonb NOT NULL DEFAULT '{"jobs":true,"finance":true,"compliance":true,"performance":true,"system":true}', "reminder_timing" jsonb NOT NULL DEFAULT '{"docExpiryDays":15,"dailySummaryTime":"20:00","weeklySummaryDay":"Sunday"}', "quiet_hours" jsonb NOT NULL DEFAULT '{"isEnabled":false,"startTime":"22:00","endTime":"07:00"}', "user_id" uuid NOT NULL, CONSTRAINT "REL_64c90edc7310c6be7c10c96f67" UNIQUE ("user_id"), CONSTRAINT "PK_e94e2b543f2f218ee68e4f4fad2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "read_at"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."notifications_type_enum" RENAME TO "notifications_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('NEW_JOB_REQUEST', 'PAYOUT_PROCESSED', 'DOCUMENT_EXPIRY', 'JOB_STATUS_UPDATED', 'SYSTEM_MAINTENANCE', 'NEW_OFFER', 'PAYMENT_COMPLETED', 'ISSUE_RESOLVED', 'SERVICE_REMINDER', 'CUSTOMER_MESSAGE')`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "public"."notifications_type_enum" USING "type"::"text"::"public"."notifications_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_preferences" ADD CONSTRAINT "FK_64c90edc7310c6be7c10c96f675" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_preferences" DROP CONSTRAINT "FK_64c90edc7310c6be7c10c96f675"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum_old" AS ENUM('job_request', 'payout', 'document_expiry', 'job_status', 'system', 'subscription', 'profile', 'general')`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "public"."notifications_type_enum_old" USING "type"::"text"::"public"."notifications_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "type" SET DEFAULT 'general'`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notifications_type_enum_old" RENAME TO "notifications_type_enum"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "title" character varying(150) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "read_at" TIMESTAMP`);
        await queryRunner.query(`DROP TABLE "notification_preferences"`);
        await queryRunner.query(`CREATE INDEX "IDX_310667f935698fcd8cb319113a" ON "notifications" ("created_at", "user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_af08fad7c04bb85403970afdc1" ON "notifications" ("is_read", "user_id") `);
    }

}
