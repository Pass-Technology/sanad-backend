import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772762116211 implements MigrationInterface {
    name = 'Migration1772762116211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_identifiertype_enum" AS ENUM('email', 'mobile')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "identifier" character varying NOT NULL, "identifierType" "public"."users_identifiertype_enum" NOT NULL, "password" character varying NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, "refreshToken" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2e7b7debda55e0e7280dc93663d" UNIQUE ("identifier"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "provider_user_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "providerProfileId" uuid NOT NULL, "fullName" character varying NOT NULL, "email" character varying NOT NULL, "mobileNumber" character varying, "nationalId" character varying NOT NULL, "dateOfBirth" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_c5708135f38e549be0deea9489" UNIQUE ("providerProfileId"), CONSTRAINT "PK_c90df2be444c3fec317734e891c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "provider_compliance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "providerProfileId" uuid NOT NULL, "ownerIdFile" character varying NOT NULL, "ownerIdExpiryDate" character varying NOT NULL, "tradeLicenseFile" character varying NOT NULL, "tradeLicenseExpiryDate" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_873d512873c9ac9753916929b4" UNIQUE ("providerProfileId"), CONSTRAINT "PK_86ef6a21adf6feaa7e892e091c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "provider_payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "providerProfileId" uuid NOT NULL, "bankName" character varying NOT NULL, "accountHolderName" character varying NOT NULL, "accountNumber" character varying NOT NULL, "iban" character varying NOT NULL, "paymentMethodIds" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_05dad2afcf8479855da1282264" UNIQUE ("providerProfileId"), CONSTRAINT "PK_0fb7fd76d6f9dfe78d7c4fc5636" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."provider_subscriptions_billingcycle_enum" AS ENUM('monthly', '3months', '6months', 'yearly')`);
        await queryRunner.query(`CREATE TABLE "provider_subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "providerProfileId" uuid NOT NULL, "selectedPlanId" character varying NOT NULL, "billingCycle" "public"."provider_subscriptions_billingcycle_enum" NOT NULL, "startDate" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_6b5553e80209c66531c8cfc79b" UNIQUE ("providerProfileId"), CONSTRAINT "PK_b428463f4faba7b0f1c86399475" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."provider_profiles_providertype_enum" AS ENUM('individual', 'company')`);
        await queryRunner.query(`CREATE TYPE "public"."provider_profiles_companytype_enum" AS ENUM('private', 'government', 'semi-government')`);
        await queryRunner.query(`CREATE TYPE "public"."provider_profiles_status_enum" AS ENUM('draft', 'pending_review', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "provider_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "providerType" "public"."provider_profiles_providertype_enum", "companyType" "public"."provider_profiles_companytype_enum", "tradeName" character varying, "companyRepresentativeName" character varying, "companyDescription" text, "socialMediaLink" character varying, "websiteLink" character varying, "languagesSpoken" text, "selectedServiceIds" text, "status" "public"."provider_profiles_status_enum" NOT NULL DEFAULT 'draft', "currentStep" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0197ced76e32133df96a97168df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "branches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "providerProfileId" uuid NOT NULL, "branchName" character varying NOT NULL, "branchManagerName" character varying NOT NULL, "branchAddress" character varying NOT NULL, "city" character varying NOT NULL, "branchPhone" character varying, "managerPhone" character varying, "googleMapsLink" character varying, "socialMediaLink" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7f37d3b42defea97f1df0d19535" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "serving_areas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "branchId" uuid NOT NULL, "radiusKm" numeric NOT NULL, "phone" character varying, "mapLink" character varying, "lat" numeric, "lng" numeric, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1bcde14eea84f7f427e5ec91059" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "otps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "identifier" character varying NOT NULL, "otp" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "provider_user_info" ADD CONSTRAINT "FK_c5708135f38e549be0deea94891" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_compliance" ADD CONSTRAINT "FK_873d512873c9ac9753916929b4d" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_payments" ADD CONSTRAINT "FK_05dad2afcf8479855da1282264e" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" ADD CONSTRAINT "FK_6b5553e80209c66531c8cfc79b7" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "branches" ADD CONSTRAINT "FK_ce21261bfdd3e1aee0ff847fc71" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "serving_areas" ADD CONSTRAINT "FK_ccdcd71ebbe5e41b46c24a2d3cf" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "serving_areas" DROP CONSTRAINT "FK_ccdcd71ebbe5e41b46c24a2d3cf"`);
        await queryRunner.query(`ALTER TABLE "branches" DROP CONSTRAINT "FK_ce21261bfdd3e1aee0ff847fc71"`);
        await queryRunner.query(`ALTER TABLE "provider_subscriptions" DROP CONSTRAINT "FK_6b5553e80209c66531c8cfc79b7"`);
        await queryRunner.query(`ALTER TABLE "provider_payments" DROP CONSTRAINT "FK_05dad2afcf8479855da1282264e"`);
        await queryRunner.query(`ALTER TABLE "provider_compliance" DROP CONSTRAINT "FK_873d512873c9ac9753916929b4d"`);
        await queryRunner.query(`ALTER TABLE "provider_user_info" DROP CONSTRAINT "FK_c5708135f38e549be0deea94891"`);
        await queryRunner.query(`DROP TABLE "otps"`);
        await queryRunner.query(`DROP TABLE "serving_areas"`);
        await queryRunner.query(`DROP TABLE "branches"`);
        await queryRunner.query(`DROP TABLE "provider_profiles"`);
        await queryRunner.query(`DROP TYPE "public"."provider_profiles_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."provider_profiles_companytype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."provider_profiles_providertype_enum"`);
        await queryRunner.query(`DROP TABLE "provider_subscriptions"`);
        await queryRunner.query(`DROP TYPE "public"."provider_subscriptions_billingcycle_enum"`);
        await queryRunner.query(`DROP TABLE "provider_payments"`);
        await queryRunner.query(`DROP TABLE "provider_compliance"`);
        await queryRunner.query(`DROP TABLE "provider_user_info"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_identifiertype_enum"`);
    }

}
