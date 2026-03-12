import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773279502792 implements MigrationInterface {
    name = 'Migration1773279502792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_96071d5ba65f9c64f0f2dfdfaf3"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_5d1880ed16ff13ea6fd9bca019d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_5d1880ed16ff13ea6fd9bca019d"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_96071d5ba65f9c64f0f2dfdfaf3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
