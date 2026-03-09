import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773003717369 implements MigrationInterface {
    name = 'Migration1773003717369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "isProfileCompleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isProfileCompleted"`);
    }

}
