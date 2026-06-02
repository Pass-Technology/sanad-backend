import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProviderTypeIdToPlans1780325000000 implements MigrationInterface {
  name = 'AddProviderTypeIdToPlans1780325000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "plans" ADD "provider_type_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "plans" ADD CONSTRAINT "FK_af46370eb77b38658e2c40a70e3" FOREIGN KEY ("provider_type_id") REFERENCES "lookup_provider_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plans" DROP CONSTRAINT "FK_af46370eb77b38658e2c40a70e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" DROP COLUMN "provider_type_id"`,
    );
  }
}
