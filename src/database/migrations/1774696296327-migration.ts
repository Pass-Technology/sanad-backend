import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774696296327 implements MigrationInterface {
    name = 'Migration1774696296327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "services" RENAME COLUMN "name" TO "name_en"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "services" RENAME COLUMN "name_en" TO "name"`);
    }

}
