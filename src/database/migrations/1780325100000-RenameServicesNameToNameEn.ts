import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameServicesNameToNameEn1780325100000 implements MigrationInterface {
  name = 'RenameServicesNameToNameEn1780325100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "services" RENAME COLUMN "name" TO "name_en"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "services" RENAME COLUMN "name_en" TO "name"`,
    );
  }
}
