import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMinMaxPriceForProviderServiceTable1781176659256 implements MigrationInterface {
    name = 'AddMinMaxPriceForProviderServiceTable1781176659256';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_services" ADD "min_price" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "provider_services" ADD "max_price" numeric(10,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "provider_services" DROP COLUMN "max_price"`);
        await queryRunner.query(`ALTER TABLE "provider_services" DROP COLUMN "min_price"`);
    }
}
