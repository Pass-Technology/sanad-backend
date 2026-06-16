import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescriptionToCategoriesTable1781162061899 implements MigrationInterface {
    name = 'AddDescriptionToCategoriesTable1781162061899';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "categories" ADD "description" jsonb DEFAULT '{"en":"Category description","ar":"وصف الفئة"}'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "description"`);
    }
}
