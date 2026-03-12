import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773279111187 implements MigrationInterface {
    name = 'Migration1773279111187'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "provider_user_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "full_name" character varying NOT NULL, "email" character varying NOT NULL, "mobile_number" character varying, "national_id" character varying NOT NULL, "date_of_birth" character varying, "provider_profile_id" uuid, CONSTRAINT "REL_ce9ee8785f564b8c5e2636d658" UNIQUE ("provider_profile_id"), CONSTRAINT "PK_c90df2be444c3fec317734e891c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "serving_areas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "branch_id" character varying NOT NULL, "radius_km" numeric NOT NULL, "phone" character varying, "map_link" character varying, "lat" numeric, "lng" numeric, "branchId" uuid, CONSTRAINT "PK_1bcde14eea84f7f427e5ec91059" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "branches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "provider_profile_id" character varying NOT NULL, "branch_name" character varying NOT NULL, "branch_manager_name" character varying NOT NULL, "branch_address" character varying NOT NULL, "city" character varying NOT NULL, "branch_phone" character varying, "manager_phone" character varying, "google_maps_link" character varying, "social_media_link" character varying, "providerProfileId" uuid, CONSTRAINT "PK_7f37d3b42defea97f1df0d19535" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "provider_compliance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "owner_id_file" character varying NOT NULL, "owner_id_expiry_date" character varying NOT NULL, "trade_license_file" character varying NOT NULL, "trade_license_expiry_date" character varying NOT NULL, "provider_profile_id" uuid, CONSTRAINT "REL_e0156372eaf3d0b92241870293" UNIQUE ("provider_profile_id"), CONSTRAINT "PK_86ef6a21adf6feaa7e892e091c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "provider_payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "bank_name" character varying NOT NULL, "account_holder_name" character varying NOT NULL, "account_number" character varying NOT NULL, "iban" character varying NOT NULL, "payment_method_ids" text NOT NULL, "provider_profile_id" uuid, CONSTRAINT "REL_e2eb5d82f6a2f941858c2fc348" UNIQUE ("provider_profile_id"), CONSTRAINT "PK_0fb7fd76d6f9dfe78d7c4fc5636" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lookup_billing_cycle" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "label_en" character varying NOT NULL, "label_ar" character varying NOT NULL, "months" integer NOT NULL, "discount_percent" integer NOT NULL DEFAULT '0', "badge_en" character varying, "badge_ar" character varying, CONSTRAINT "PK_a04d0f97f625326f36596187451" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscription_plan_features" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "feature_text" character varying NOT NULL, "display_order" integer NOT NULL DEFAULT '0', "plan_id" uuid, CONSTRAINT "UQ_6618a0c895ca7a53bc02a592b60" UNIQUE ("plan_id", "feature_text"), CONSTRAINT "PK_d9ee0b915953daf576ad8e57e26" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscription_plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "monthly_price" numeric NOT NULL, "booking_limit" integer, "commission_percent" numeric, "is_most_popular" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_9ab8fe6918451ab3d0a4fb6bb0c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "provider_subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "start_date" TIMESTAMP, "provider_profile_id" uuid, "selected_plan_id" uuid, "billing_cycle_id" uuid, CONSTRAINT "REL_d31b274fa7b95969da8a8b43eb" UNIQUE ("provider_profile_id"), CONSTRAINT "PK_b428463f4faba7b0f1c86399475" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lookup_profile_status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "label_en" character varying NOT NULL, "label_ar" character varying NOT NULL, CONSTRAINT "PK_93a04430d03ab1c9707a1cb66d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lookup_provider_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "label_en" character varying NOT NULL, "label_ar" character varying NOT NULL, CONSTRAINT "PK_afea6317030e6a215289489e64b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lookup_company_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "label_en" character varying NOT NULL, "label_ar" character varying NOT NULL, CONSTRAINT "PK_61646b18fc1e1ef5f6bee30c01c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "provider_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "status_id" character varying NOT NULL, "trade_name" character varying, "company_representative_name" character varying, "company_description" text, "social_media_link" character varying, "website_link" character varying, "languages_spoken" text, "selected_service_ids" text, "current_step" integer NOT NULL DEFAULT '1', "user_id" character varying NOT NULL, "statusId" uuid, "providerTypeId" uuid, "companyTypeId" uuid, "userId" uuid, CONSTRAINT "PK_0197ced76e32133df96a97168df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_identifier_type_enum" AS ENUM('email', 'mobile')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "identifier" character varying NOT NULL, "identifier_type" "public"."users_identifier_type_enum" NOT NULL, "password" character varying NOT NULL, "is_verified" boolean NOT NULL DEFAULT false, "refresh_token" character varying, "is_profile_completed" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_2e7b7debda55e0e7280dc93663d" UNIQUE ("identifier"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "otps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "identifier" character varying NOT NULL, "otp" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "provider_user_info" ADD CONSTRAINT "FK_ce9ee8785f564b8c5e2636d658e" FOREIGN KEY ("provider_profile_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "serving_areas" ADD CONSTRAINT "FK_ccdcd71ebbe5e41b46c24a2d3cf" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "branches" ADD CONSTRAINT "FK_ce21261bfdd3e1aee0ff847fc71" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_compliance" ADD CONSTRAINT "FK_e0156372eaf3d0b922418702939" FOREIGN KEY ("provider_profile_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_payments" ADD CONSTRAINT "FK_e2eb5d82f6a2f941858c2fc348c" FOREIGN KEY ("provider_profile_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription_plan_features" ADD CONSTRAINT "FK_6b01b9cbcc3119dac45d59f1848" FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" ADD CONSTRAINT "FK_d31b274fa7b95969da8a8b43eb6" FOREIGN KEY ("provider_profile_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" ADD CONSTRAINT "FK_c8b3abdcbe1366928f333a39ca9" FOREIGN KEY ("selected_plan_id") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" ADD CONSTRAINT "FK_bb7ac5533ea8aefbfdd4a4d28b6" FOREIGN KEY ("billing_cycle_id") REFERENCES "lookup_billing_cycle"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_da8207850c9b5e214a5e7822cc6" FOREIGN KEY ("statusId") REFERENCES "lookup_profile_status"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_2ac580d173f4738143cf874a3b3" FOREIGN KEY ("providerTypeId") REFERENCES "lookup_provider_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_14b384c3f2cba645a89c0c70f4a" FOREIGN KEY ("companyTypeId") REFERENCES "lookup_company_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_96071d5ba65f9c64f0f2dfdfaf3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_96071d5ba65f9c64f0f2dfdfaf3"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_14b384c3f2cba645a89c0c70f4a"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_2ac580d173f4738143cf874a3b3"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_da8207850c9b5e214a5e7822cc6"`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" DROP CONSTRAINT "FK_bb7ac5533ea8aefbfdd4a4d28b6"`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" DROP CONSTRAINT "FK_c8b3abdcbe1366928f333a39ca9"`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" DROP CONSTRAINT "FK_d31b274fa7b95969da8a8b43eb6"`);
        await queryRunner.query(`ALTER TABLE "subscription_plan_features" DROP CONSTRAINT "FK_6b01b9cbcc3119dac45d59f1848"`);
        await queryRunner.query(`ALTER TABLE "provider_payments" DROP CONSTRAINT "FK_e2eb5d82f6a2f941858c2fc348c"`);
        await queryRunner.query(`ALTER TABLE "provider_compliance" DROP CONSTRAINT "FK_e0156372eaf3d0b922418702939"`);
        await queryRunner.query(`ALTER TABLE "branches" DROP CONSTRAINT "FK_ce21261bfdd3e1aee0ff847fc71"`);
        await queryRunner.query(`ALTER TABLE "serving_areas" DROP CONSTRAINT "FK_ccdcd71ebbe5e41b46c24a2d3cf"`);
        await queryRunner.query(`ALTER TABLE "provider_user_info" DROP CONSTRAINT "FK_ce9ee8785f564b8c5e2636d658e"`);
        await queryRunner.query(`DROP TABLE "otps"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_identifier_type_enum"`);
        await queryRunner.query(`DROP TABLE "provider_profiles"`);
        await queryRunner.query(`DROP TABLE "lookup_company_type"`);
        await queryRunner.query(`DROP TABLE "lookup_provider_type"`);
        await queryRunner.query(`DROP TABLE "lookup_profile_status"`);
        await queryRunner.query(`DROP TABLE "provider_subscriptions"`);
        await queryRunner.query(`DROP TABLE "subscription_plans"`);
        await queryRunner.query(`DROP TABLE "subscription_plan_features"`);
        await queryRunner.query(`DROP TABLE "lookup_billing_cycle"`);
        await queryRunner.query(`DROP TABLE "provider_payments"`);
        await queryRunner.query(`DROP TABLE "provider_compliance"`);
        await queryRunner.query(`DROP TABLE "branches"`);
        await queryRunner.query(`DROP TABLE "serving_areas"`);
        await queryRunner.query(`DROP TABLE "provider_user_info"`);
    }

}
