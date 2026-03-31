import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774952505075 implements MigrationInterface {
    name = 'Migration1774952505075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_sanad" RENAME COLUMN "use_existing_bank_transfer_account" TO "is_using_bank_transfer_data"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_sanad" RENAME COLUMN "is_using_bank_transfer_data" TO "use_existing_bank_transfer_account"`);
    }

}
