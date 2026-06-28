import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueReviewPerContractReviewer1783300000000 implements MigrationInterface {
    name = 'AddUniqueReviewPerContractReviewer1783300000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_review_per_contract_reviewer"
            ON "reviews" ("contract_id", "reviewer_id")
            WHERE "deleted_at" IS NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."UQ_review_per_contract_reviewer"`);
    }
}
