import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1777463905081 implements MigrationInterface {
    name = 'Migration1777463905081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "target-audience-profiles" ADD "target_audience_profile_complete_score" double precision DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "target-audience-profiles" DROP COLUMN "target_audience_profile_complete_score"`);
    }

}
