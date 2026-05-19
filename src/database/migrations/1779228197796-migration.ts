import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1779228197796 implements MigrationInterface {
    name = 'Migration1779228197796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "client_favorite_providers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "client_id" uuid NOT NULL, "provider_id" uuid NOT NULL, CONSTRAINT "UQ_97e7e493c63d051d131cb2a65dc" UNIQUE ("client_id", "provider_id"), CONSTRAINT "PK_a7a8efdaef9b1e463dfd142db48" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "client_favorite_services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "client_id" uuid NOT NULL, "service_id" uuid NOT NULL, CONSTRAINT "UQ_0a917d11af8fe0df4db25411a0e" UNIQUE ("client_id", "service_id"), CONSTRAINT "PK_0cead11285dea80c177a60ec3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "client_favorite_providers" ADD CONSTRAINT "FK_5ffe264ede48de33909d35add47" FOREIGN KEY ("client_id") REFERENCES "client_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_favorite_providers" ADD CONSTRAINT "FK_f934362609a1ed9b7a2287bbe90" FOREIGN KEY ("provider_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_favorite_services" ADD CONSTRAINT "FK_7cf10b3f956d04d601269485849" FOREIGN KEY ("client_id") REFERENCES "client_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_favorite_services" ADD CONSTRAINT "FK_f08d1473f6b6b67bed650724a1f" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_favorite_services" DROP CONSTRAINT "FK_f08d1473f6b6b67bed650724a1f"`);
        await queryRunner.query(`ALTER TABLE "client_favorite_services" DROP CONSTRAINT "FK_7cf10b3f956d04d601269485849"`);
        await queryRunner.query(`ALTER TABLE "client_favorite_providers" DROP CONSTRAINT "FK_f934362609a1ed9b7a2287bbe90"`);
        await queryRunner.query(`ALTER TABLE "client_favorite_providers" DROP CONSTRAINT "FK_5ffe264ede48de33909d35add47"`);
        await queryRunner.query(`DROP TABLE "client_favorite_services"`);
        await queryRunner.query(`DROP TABLE "client_favorite_providers"`);
    }

}
