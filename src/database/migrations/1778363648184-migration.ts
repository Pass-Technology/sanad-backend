import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1778363648184 implements MigrationInterface {
    name = 'Migration1778363648184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."provider_workers_status_enum" AS ENUM('AVAILABLE', 'BUSY', 'OFFLINE')`);
        await queryRunner.query(`CREATE TABLE "provider_workers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "status" "public"."provider_workers_status_enum" NOT NULL DEFAULT 'AVAILABLE', "image_url" character varying, "provider_id" uuid, CONSTRAINT "PK_9a29b7851fe85b5097e6287d77d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."offers_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "offers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "price" numeric(10,2) NOT NULL, "notes" text, "status" "public"."offers_status_enum" NOT NULL DEFAULT 'PENDING', "order_id" uuid, "provider_id" uuid NOT NULL, "worker_id" uuid, CONSTRAINT "UQ_bbc73b179d9650d0783fe7009eb" UNIQUE ("order_id", "provider_id"), CONSTRAINT "PK_4c88e956195bba85977da21b8f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('PENDING', 'SEARCHING', 'ACCEPTED', 'PROVIDER_ON_THE_WAY', 'PROVIDER_ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_payment_method_enum" AS ENUM('CARD', 'APPLE_PAY', 'CASH', 'WALLET')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'PENDING', "description" text, "scheduled_at" TIMESTAMP, "address" character varying, "lat" numeric(10,7), "lng" numeric(10,7), "is_urgent" boolean NOT NULL DEFAULT false, "payment_method" "public"."orders_payment_method_enum", "total_estimate" numeric(10,2), "details" jsonb, "client_id" uuid NOT NULL, "service_id" uuid NOT NULL, "accepted_offer_id" uuid, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "client_addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "label" character varying NOT NULL, "address" character varying NOT NULL, "lat" numeric(10,7), "lng" numeric(10,7), "is_default" boolean NOT NULL DEFAULT false, "client_id" uuid, CONSTRAINT "PK_1df84115ce2e00312a3cca277e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."client_payment_methods_type_enum" AS ENUM('CARD', 'APPLE_PAY', 'CASH', 'WALLET')`);
        await queryRunner.query(`CREATE TABLE "client_payment_methods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" "public"."client_payment_methods_type_enum" NOT NULL, "provider" character varying, "last_four" character varying, "is_default" boolean NOT NULL DEFAULT false, "metadata" jsonb, "client_id" uuid, CONSTRAINT "PK_b131aaf0097a3b931485c3a9c00" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."client_coupons_discount_type_enum" AS ENUM('PERCENTAGE', 'FIXED')`);
        await queryRunner.query(`CREATE TABLE "client_coupons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "code" character varying NOT NULL, "description" character varying NOT NULL, "discount_value" numeric(10,2) NOT NULL, "discount_type" "public"."client_coupons_discount_type_enum" NOT NULL DEFAULT 'PERCENTAGE', "expiry_date" TIMESTAMP NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "client_id" uuid, CONSTRAINT "UQ_469984443ae7791423ccc4135e8" UNIQUE ("code"), CONSTRAINT "PK_d539608d53a818eeec26637e19b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."provider_coupons_discount_type_enum" AS ENUM('PERCENTAGE', 'FIXED')`);
        await queryRunner.query(`CREATE TABLE "provider_coupons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "code" character varying NOT NULL, "description" character varying NOT NULL, "discount_value" numeric(10,2) NOT NULL, "discount_type" "public"."provider_coupons_discount_type_enum" NOT NULL DEFAULT 'PERCENTAGE', "expiry_date" TIMESTAMP NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "provider_id" uuid, CONSTRAINT "UQ_ba83770e6b1dbe83040c30ce5b4" UNIQUE ("code"), CONSTRAINT "PK_fb0f5286a38f29537f3040279b1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_rejections" ("orders_id" uuid NOT NULL, "provider_profiles_id" uuid NOT NULL, CONSTRAINT "PK_a67bb106cf2d280474fd60d40b0" PRIMARY KEY ("orders_id", "provider_profiles_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_27bf403626bf2bda1f04ea315e" ON "order_rejections" ("orders_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_6ba19e394de057db3d4fe89011" ON "order_rejections" ("provider_profiles_id") `);
        await queryRunner.query(`ALTER TABLE "client_profiles" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "client_profiles" ADD "wallet_balance" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "provider_workers" ADD CONSTRAINT "FK_9723618f8291698a49d46bd65aa" FOREIGN KEY ("provider_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offers" ADD CONSTRAINT "FK_4e8903a1e1291f81ee5a92f0522" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offers" ADD CONSTRAINT "FK_eca91fbc6f480a8d4eafacb8b22" FOREIGN KEY ("provider_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offers" ADD CONSTRAINT "FK_b2447f8e62e65bcd0625c9c8102" FOREIGN KEY ("worker_id") REFERENCES "provider_workers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_505ba3689ef2763acd6c4fc93a4" FOREIGN KEY ("client_id") REFERENCES "client_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_8612f4a8dd8f756d53d2856a09a" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_20cc5bf06d010d60fb97bb1e54b" FOREIGN KEY ("accepted_offer_id") REFERENCES "offers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_addresses" ADD CONSTRAINT "FK_a88557f9d4f0eebd10e1c46af73" FOREIGN KEY ("client_id") REFERENCES "client_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_payment_methods" ADD CONSTRAINT "FK_e996f74243d95b8f15bd17f1200" FOREIGN KEY ("client_id") REFERENCES "client_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_coupons" ADD CONSTRAINT "FK_46649d4b94fcd013b0ea693b5bd" FOREIGN KEY ("client_id") REFERENCES "client_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_coupons" ADD CONSTRAINT "FK_7322807550d48df6aa6e4e3b13d" FOREIGN KEY ("provider_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_rejections" ADD CONSTRAINT "FK_27bf403626bf2bda1f04ea315e1" FOREIGN KEY ("orders_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "order_rejections" ADD CONSTRAINT "FK_6ba19e394de057db3d4fe89011d" FOREIGN KEY ("provider_profiles_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_rejections" DROP CONSTRAINT "FK_6ba19e394de057db3d4fe89011d"`);
        await queryRunner.query(`ALTER TABLE "order_rejections" DROP CONSTRAINT "FK_27bf403626bf2bda1f04ea315e1"`);
        await queryRunner.query(`ALTER TABLE "provider_coupons" DROP CONSTRAINT "FK_7322807550d48df6aa6e4e3b13d"`);
        await queryRunner.query(`ALTER TABLE "client_coupons" DROP CONSTRAINT "FK_46649d4b94fcd013b0ea693b5bd"`);
        await queryRunner.query(`ALTER TABLE "client_payment_methods" DROP CONSTRAINT "FK_e996f74243d95b8f15bd17f1200"`);
        await queryRunner.query(`ALTER TABLE "client_addresses" DROP CONSTRAINT "FK_a88557f9d4f0eebd10e1c46af73"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_20cc5bf06d010d60fb97bb1e54b"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_8612f4a8dd8f756d53d2856a09a"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_505ba3689ef2763acd6c4fc93a4"`);
        await queryRunner.query(`ALTER TABLE "offers" DROP CONSTRAINT "FK_b2447f8e62e65bcd0625c9c8102"`);
        await queryRunner.query(`ALTER TABLE "offers" DROP CONSTRAINT "FK_eca91fbc6f480a8d4eafacb8b22"`);
        await queryRunner.query(`ALTER TABLE "offers" DROP CONSTRAINT "FK_4e8903a1e1291f81ee5a92f0522"`);
        await queryRunner.query(`ALTER TABLE "provider_workers" DROP CONSTRAINT "FK_9723618f8291698a49d46bd65aa"`);
        await queryRunner.query(`ALTER TABLE "client_profiles" DROP COLUMN "wallet_balance"`);
        await queryRunner.query(`ALTER TABLE "client_profiles" DROP COLUMN "name"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6ba19e394de057db3d4fe89011"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_27bf403626bf2bda1f04ea315e"`);
        await queryRunner.query(`DROP TABLE "order_rejections"`);
        await queryRunner.query(`DROP TABLE "provider_coupons"`);
        await queryRunner.query(`DROP TYPE "public"."provider_coupons_discount_type_enum"`);
        await queryRunner.query(`DROP TABLE "client_coupons"`);
        await queryRunner.query(`DROP TYPE "public"."client_coupons_discount_type_enum"`);
        await queryRunner.query(`DROP TABLE "client_payment_methods"`);
        await queryRunner.query(`DROP TYPE "public"."client_payment_methods_type_enum"`);
        await queryRunner.query(`DROP TABLE "client_addresses"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_payment_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "offers"`);
        await queryRunner.query(`DROP TYPE "public"."offers_status_enum"`);
        await queryRunner.query(`DROP TABLE "provider_workers"`);
        await queryRunner.query(`DROP TYPE "public"."provider_workers_status_enum"`);
    }

}
