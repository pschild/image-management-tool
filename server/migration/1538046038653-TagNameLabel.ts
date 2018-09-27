import {MigrationInterface, QueryRunner} from "typeorm";

export class TagNameLabel1538046038653 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tag" RENAME TO "tmp_tag"`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "label" varchar NOT NULL, "dateAdded" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "tag" (id, label, dateAdded) SELECT id, name, dateAdded FROM "tmp_tag"`);
        await queryRunner.query(`DROP TABLE "tmp_tag"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "tag" RENAME TO "tmp_tag"`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "dateAdded" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "tag" (id, name, dateAdded) SELECT id, label, dateAdded FROM "tmp_tag"`);
        await queryRunner.query(`DROP TABLE "tmp_tag"`);
    }

}
