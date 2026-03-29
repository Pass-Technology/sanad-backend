import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774746907738 implements MigrationInterface {
    name = 'Migration1774746907738'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lookup_languages" RENAME COLUMN "icon" TO "flag"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lookup_languages" RENAME COLUMN "flag" TO "icon"`);
    }

}
