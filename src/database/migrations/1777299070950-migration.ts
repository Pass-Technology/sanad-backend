import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1777299070950 implements MigrationInterface {
    name = 'Migration1777299070950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "target-audience-profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "basic_info" jsonb NOT NULL DEFAULT '{}', "services" jsonb NOT NULL DEFAULT '{}', "operations" jsonb NOT NULL DEFAULT '{}', "customer" jsonb NOT NULL DEFAULT '{}', "purchasing" jsonb NOT NULL DEFAULT '{}', "strategy" jsonb NOT NULL DEFAULT '{}', "provider_profile_id" uuid, CONSTRAINT "REL_0c828a93d75fe265732a3cfa2c" UNIQUE ("provider_profile_id"), CONSTRAINT "PK_7a61b048269aae79f3d3a89c750" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "target-audience-profiles" ADD CONSTRAINT "FK_0c828a93d75fe265732a3cfa2cd" FOREIGN KEY ("provider_profile_id") REFERENCES "provider_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "target-audience-profiles" DROP CONSTRAINT "FK_0c828a93d75fe265732a3cfa2cd"`);
        await queryRunner.query(`DROP TABLE "target-audience-profiles"`);
    }

}
