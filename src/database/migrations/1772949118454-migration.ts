import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772949118454 implements MigrationInterface {
    name = 'Migration1772949118454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branches" DROP CONSTRAINT "FK_ce21261bfdd3e1aee0ff847fc71"`);
        await queryRunner.query(`ALTER TABLE "branches" ALTER COLUMN "providerProfileId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "branches" ADD CONSTRAINT "FK_ce21261bfdd3e1aee0ff847fc71" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branches" DROP CONSTRAINT "FK_ce21261bfdd3e1aee0ff847fc71"`);
        await queryRunner.query(`ALTER TABLE "branches" ALTER COLUMN "providerProfileId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "branches" ADD CONSTRAINT "FK_ce21261bfdd3e1aee0ff847fc71" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
