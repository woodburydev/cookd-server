import { MigrationInterface, QueryRunner } from 'typeorm';

export class new1647999817420 implements MigrationInterface {
  name = 'new1647999817420';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cook" ADD "firstname" character varying(120) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "cook" ADD "lastname" character varying(120) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "cook" ADD "countrycode" character varying(10) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "cook" ADD "fbuuid" character varying(120) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "cook" ALTER COLUMN "email" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "cook" ALTER COLUMN "phone" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "allergies" DROP DEFAULT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "allergies" SET DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "cook" ALTER COLUMN "phone" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "cook" ALTER COLUMN "email" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "cook" DROP COLUMN "fbuuid"`);
    await queryRunner.query(`ALTER TABLE "cook" DROP COLUMN "countrycode"`);
    await queryRunner.query(`ALTER TABLE "cook" DROP COLUMN "lastname"`);
    await queryRunner.query(`ALTER TABLE "cook" DROP COLUMN "firstname"`);
  }
}
