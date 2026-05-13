import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1778678565405 implements MigrationInterface {
    name = 'Migration1778678565405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offers" DROP CONSTRAINT "FK_b2447f8e62e65bcd0625c9c8102"`);
        await queryRunner.query(`ALTER TABLE "offers" DROP CONSTRAINT "FK_4e8903a1e1291f81ee5a92f0522"`);
        await queryRunner.query(`ALTER TABLE "offers" DROP CONSTRAINT "UQ_bbc73b179d9650d0783fe7009eb"`);
        await queryRunner.query(`CREATE TYPE "public"."jobs_status_enum" AS ENUM('ASSIGNED', 'PROVIDER_ON_THE_WAY', 'PROVIDER_ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "jobs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "status" "public"."jobs_status_enum" NOT NULL DEFAULT 'ASSIGNED', "final_price" numeric(10,2) NOT NULL, "started_at" TIMESTAMP, "completed_at" TIMESTAMP, "before_service_photos" jsonb, "after_service_photos" jsonb, "customer_signature" text, "provider_notes" jsonb, "service_request_id" uuid, "client_id" uuid NOT NULL, "provider_id" uuid NOT NULL, "accepted_offer_id" uuid, "assigned_worker_id" uuid, CONSTRAINT "REL_c113b7d5e19895123ebffb883d" UNIQUE ("service_request_id"), CONSTRAINT "REL_032c8d929b0d60944f52d444e0" UNIQUE ("accepted_offer_id"), CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."client_service_requests_status_enum" AS ENUM('OPEN', 'RECEIVING_OFFERS', 'MATCHED', 'CLOSED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TYPE "public"."client_service_requests_payment_method_enum" AS ENUM('CARD', 'APPLE_PAY', 'CASH', 'WALLET')`);
        await queryRunner.query(`CREATE TABLE "client_service_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "status" "public"."client_service_requests_status_enum" NOT NULL DEFAULT 'OPEN', "description" text, "scheduled_at" TIMESTAMP, "is_urgent" boolean NOT NULL DEFAULT false, "payment_method" "public"."client_service_requests_payment_method_enum", "budget_estimate" numeric(10,2), "details" jsonb, "expires_at" TIMESTAMP, "client_id" uuid NOT NULL, "service_id" uuid NOT NULL, "address_id" uuid, CONSTRAINT "PK_d5ccfde7690757421eb6a1a9b44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payouts_status_enum" AS ENUM('PENDING', 'PROCESSING', 'PAID', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "payouts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "amount" numeric(10,2) NOT NULL, "status" "public"."payouts_status_enum" NOT NULL DEFAULT 'PENDING', "method" character varying NOT NULL DEFAULT 'Bank Transfer', "reference" character varying, "paid_at" TIMESTAMP, "provider_id" uuid NOT NULL, "bank_account_id" uuid, CONSTRAINT "PK_76855dc4f0a6c18c72eea302e87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "request_rejections" ("client_service_requests_id" uuid NOT NULL, "provider_profiles_id" uuid NOT NULL, CONSTRAINT "PK_f38536962ab8e655b1a8639a90a" PRIMARY KEY ("client_service_requests_id", "provider_profiles_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6165f25d2bf4f67d6919f11ba4" ON "request_rejections" ("client_service_requests_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3a59571bf0db72c6e9b7d6a0b3" ON "request_rejections" ("provider_profiles_id") `);
        await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "order_id"`);
        await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "worker_id"`);
        await queryRunner.query(`ALTER TABLE "offers" ADD "estimated_duration_minutes" integer`);
        await queryRunner.query(`ALTER TABLE "offers" ADD "expires_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "offers" ADD "service_request_id" uuid`);
        await queryRunner.query(`ALTER TYPE "public"."offers_status_enum" RENAME TO "offers_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."offers_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'EXPIRED')`);
        await queryRunner.query(`ALTER TABLE "offers" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "offers" ALTER COLUMN "status" TYPE "public"."offers_status_enum" USING "status"::"text"::"public"."offers_status_enum"`);
        await queryRunner.query(`ALTER TABLE "offers" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."offers_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "offers" ADD CONSTRAINT "UQ_4c1ab15e915d32b19ff924459fb" UNIQUE ("service_request_id", "provider_id")`);
        await queryRunner.query(`ALTER TABLE "offers" ADD CONSTRAINT "FK_d4e2f8e131609f51df1182ffc59" FOREIGN KEY ("service_request_id") REFERENCES "client_service_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD CONSTRAINT "FK_c113b7d5e19895123ebffb883df" FOREIGN KEY ("service_request_id") REFERENCES "client_service_requests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD CONSTRAINT "FK_dec6205e2cd13841763710f9892" FOREIGN KEY ("client_id") REFERENCES "client_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD CONSTRAINT "FK_d732a878487323978f118ab361c" FOREIGN KEY ("provider_id") REFERENCES "provider_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD CONSTRAINT "FK_032c8d929b0d60944f52d444e09" FOREIGN KEY ("accepted_offer_id") REFERENCES "offers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD CONSTRAINT "FK_ee11a5e8d47cd5e01747d52f3b3" FOREIGN KEY ("assigned_worker_id") REFERENCES "provider_workers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_service_requests" ADD CONSTRAINT "FK_935ac53ff9311124ee2c5a2c744" FOREIGN KEY ("client_id") REFERENCES "client_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_service_requests" ADD CONSTRAINT "FK_8717696d36e264b7dd485759cde" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_service_requests" ADD CONSTRAINT "FK_a65bb49321080c219f053cdd78d" FOREIGN KEY ("address_id") REFERENCES "client_addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payouts" ADD CONSTRAINT "FK_2a5a17ac78a7320401f5c0d1a6c" FOREIGN KEY ("provider_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payouts" ADD CONSTRAINT "FK_7796c1df57eeefa9173325627c4" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "request_rejections" ADD CONSTRAINT "FK_6165f25d2bf4f67d6919f11ba49" FOREIGN KEY ("client_service_requests_id") REFERENCES "client_service_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "request_rejections" ADD CONSTRAINT "FK_3a59571bf0db72c6e9b7d6a0b39" FOREIGN KEY ("provider_profiles_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_rejections" DROP CONSTRAINT "FK_3a59571bf0db72c6e9b7d6a0b39"`);
        await queryRunner.query(`ALTER TABLE "request_rejections" DROP CONSTRAINT "FK_6165f25d2bf4f67d6919f11ba49"`);
        await queryRunner.query(`ALTER TABLE "payouts" DROP CONSTRAINT "FK_7796c1df57eeefa9173325627c4"`);
        await queryRunner.query(`ALTER TABLE "payouts" DROP CONSTRAINT "FK_2a5a17ac78a7320401f5c0d1a6c"`);
        await queryRunner.query(`ALTER TABLE "client_service_requests" DROP CONSTRAINT "FK_a65bb49321080c219f053cdd78d"`);
        await queryRunner.query(`ALTER TABLE "client_service_requests" DROP CONSTRAINT "FK_8717696d36e264b7dd485759cde"`);
        await queryRunner.query(`ALTER TABLE "client_service_requests" DROP CONSTRAINT "FK_935ac53ff9311124ee2c5a2c744"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_ee11a5e8d47cd5e01747d52f3b3"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_032c8d929b0d60944f52d444e09"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_d732a878487323978f118ab361c"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_dec6205e2cd13841763710f9892"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_c113b7d5e19895123ebffb883df"`);
        await queryRunner.query(`ALTER TABLE "offers" DROP CONSTRAINT "FK_d4e2f8e131609f51df1182ffc59"`);
        await queryRunner.query(`ALTER TABLE "offers" DROP CONSTRAINT "UQ_4c1ab15e915d32b19ff924459fb"`);
        await queryRunner.query(`CREATE TYPE "public"."offers_status_enum_old" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED')`);
        await queryRunner.query(`ALTER TABLE "offers" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "offers" ALTER COLUMN "status" TYPE "public"."offers_status_enum_old" USING "status"::"text"::"public"."offers_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "offers" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."offers_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."offers_status_enum_old" RENAME TO "offers_status_enum"`);
        await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "service_request_id"`);
        await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "expires_at"`);
        await queryRunner.query(`ALTER TABLE "offers" DROP COLUMN "estimated_duration_minutes"`);
        await queryRunner.query(`ALTER TABLE "offers" ADD "worker_id" uuid`);
        await queryRunner.query(`ALTER TABLE "offers" ADD "order_id" uuid`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3a59571bf0db72c6e9b7d6a0b3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6165f25d2bf4f67d6919f11ba4"`);
        await queryRunner.query(`DROP TABLE "request_rejections"`);
        await queryRunner.query(`DROP TABLE "payouts"`);
        await queryRunner.query(`DROP TYPE "public"."payouts_status_enum"`);
        await queryRunner.query(`DROP TABLE "client_service_requests"`);
        await queryRunner.query(`DROP TYPE "public"."client_service_requests_payment_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."client_service_requests_status_enum"`);
        await queryRunner.query(`DROP TABLE "jobs"`);
        await queryRunner.query(`DROP TYPE "public"."jobs_status_enum"`);
        await queryRunner.query(`ALTER TABLE "offers" ADD CONSTRAINT "UQ_bbc73b179d9650d0783fe7009eb" UNIQUE ("order_id", "provider_id")`);
        await queryRunner.query(`ALTER TABLE "offers" ADD CONSTRAINT "FK_4e8903a1e1291f81ee5a92f0522" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offers" ADD CONSTRAINT "FK_b2447f8e62e65bcd0625c9c8102" FOREIGN KEY ("worker_id") REFERENCES "provider_workers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
