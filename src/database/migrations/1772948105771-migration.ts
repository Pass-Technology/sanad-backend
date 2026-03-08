import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772948105771 implements MigrationInterface {
    name = 'Migration1772948105771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_96071d5ba65f9c64f0f2dfdfaf3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_96071d5ba65f9c64f0f2dfdfaf3"`);
    }

}
