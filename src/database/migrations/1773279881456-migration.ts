import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773279881456 implements MigrationInterface {
    name = 'Migration1773279881456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_2ac580d173f4738143cf874a3b3"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" RENAME COLUMN "providerTypeId" TO "provider_type_id"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_c91b4eddecde820d748b3af5e85" FOREIGN KEY ("provider_type_id") REFERENCES "lookup_provider_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_c91b4eddecde820d748b3af5e85"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" RENAME COLUMN "provider_type_id" TO "providerTypeId"`);
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_2ac580d173f4738143cf874a3b3" FOREIGN KEY ("providerTypeId") REFERENCES "lookup_provider_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
