import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773598058453 implements MigrationInterface {
    name = 'Migration1773598058453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "otp"`);
        await queryRunner.query(`ALTER TABLE "otps" ADD "otp" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "otp"`);
        await queryRunner.query(`ALTER TABLE "otps" ADD "otp" character varying NOT NULL`);
    }

}
