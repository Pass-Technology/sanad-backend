import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772922035949 implements MigrationInterface {
    name = 'Migration1772922035949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_2ac580d173f4738143cf874a3b3"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ALTER COLUMN "providerTypeId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_2ac580d173f4738143cf874a3b3" FOREIGN KEY ("providerTypeId") REFERENCES "lookup_provider_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_2ac580d173f4738143cf874a3b3"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ALTER COLUMN "providerTypeId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_2ac580d173f4738143cf874a3b3" FOREIGN KEY ("providerTypeId") REFERENCES "lookup_provider_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
