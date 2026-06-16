import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusToProviderServiceTable1781168204308 implements MigrationInterface {
    name = 'AddStatusToProviderServiceTable1781168204308';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status') THEN 
                    CREATE TYPE "public"."status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            ALTER TABLE "provider_services" 
            ADD "status" "public"."status" NOT NULL DEFAULT 'PENDING'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "provider_services" DROP COLUMN "status"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."status"
        `);
    }
}
