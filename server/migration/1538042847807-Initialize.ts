import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialize1538042847807 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "tag" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "label" varchar NOT NULL, "dateAdded" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "person" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstname" varchar NOT NULL, "lastname" varchar, "birthday" datetime, "dateAdded" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "place" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "address" varchar, "city" varchar, "country" varchar, "dateAdded" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "image" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "suffix" varchar NOT NULL, "originalName" varchar NOT NULL, "dateAdded" datetime NOT NULL DEFAULT (datetime('now')), "description" varchar, "dateFrom" datetime, "dateTo" datetime, "parentFolderId" integer, "placeId" integer)`);
        await queryRunner.query(`CREATE TABLE "folder" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "dateAdded" datetime NOT NULL DEFAULT (datetime('now')), "parentId" integer)`);
        await queryRunner.query(`CREATE TABLE "image_tags_tag" ("imageId" integer NOT NULL, "tagId" integer NOT NULL, PRIMARY KEY ("imageId", "tagId"))`);
        await queryRunner.query(`CREATE TABLE "image_persons_person" ("imageId" integer NOT NULL, "personId" integer NOT NULL, PRIMARY KEY ("imageId", "personId"))`);
        await queryRunner.query(`CREATE TABLE "folder_closure" ("id_ancestor" integer NOT NULL, "id_descendant" integer NOT NULL, PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`CREATE TABLE "temporary_image" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "suffix" varchar NOT NULL, "originalName" varchar NOT NULL, "dateAdded" datetime NOT NULL DEFAULT (datetime('now')), "description" varchar, "dateFrom" datetime, "dateTo" datetime, "parentFolderId" integer, "placeId" integer, CONSTRAINT "FK_a4784e0e64c5e2fabd692116287" FOREIGN KEY ("parentFolderId") REFERENCES "folder" ("id"), CONSTRAINT "FK_9ad0d872c1a54866d27b469a4e8" FOREIGN KEY ("placeId") REFERENCES "place" ("id"))`);
        await queryRunner.query(`INSERT INTO "temporary_image"("id", "name", "suffix", "originalName", "dateAdded", "description", "dateFrom", "dateTo", "parentFolderId", "placeId") SELECT "id", "name", "suffix", "originalName", "dateAdded", "description", "dateFrom", "dateTo", "parentFolderId", "placeId" FROM "image"`);
        await queryRunner.query(`DROP TABLE "image"`);
        await queryRunner.query(`ALTER TABLE "temporary_image" RENAME TO "image"`);
        await queryRunner.query(`CREATE TABLE "temporary_folder" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "dateAdded" datetime NOT NULL DEFAULT (datetime('now')), "parentId" integer, CONSTRAINT "FK_9ee3bd0f189fb242d488c0dfa39" FOREIGN KEY ("parentId") REFERENCES "folder" ("id"))`);
        await queryRunner.query(`INSERT INTO "temporary_folder"("id", "name", "dateAdded", "parentId") SELECT "id", "name", "dateAdded", "parentId" FROM "folder"`);
        await queryRunner.query(`DROP TABLE "folder"`);
        await queryRunner.query(`ALTER TABLE "temporary_folder" RENAME TO "folder"`);
        await queryRunner.query(`CREATE TABLE "temporary_image_tags_tag" ("imageId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "FK_fb0a8276058d9d4747e9d7b0ea1" FOREIGN KEY ("imageId") REFERENCES "image" ("id") ON DELETE CASCADE, CONSTRAINT "FK_a314e4dc3f17751aaf35c12c681" FOREIGN KEY ("tagId") REFERENCES "tag" ("id") ON DELETE CASCADE, PRIMARY KEY ("imageId", "tagId"))`);
        await queryRunner.query(`INSERT INTO "temporary_image_tags_tag"("imageId", "tagId") SELECT "imageId", "tagId" FROM "image_tags_tag"`);
        await queryRunner.query(`DROP TABLE "image_tags_tag"`);
        await queryRunner.query(`ALTER TABLE "temporary_image_tags_tag" RENAME TO "image_tags_tag"`);
        await queryRunner.query(`CREATE TABLE "temporary_image_persons_person" ("imageId" integer NOT NULL, "personId" integer NOT NULL, CONSTRAINT "FK_8bb7d111be89c0d2083a95173cd" FOREIGN KEY ("imageId") REFERENCES "image" ("id") ON DELETE CASCADE, CONSTRAINT "FK_2d6e185bf0c1a27a76752a2c401" FOREIGN KEY ("personId") REFERENCES "person" ("id") ON DELETE CASCADE, PRIMARY KEY ("imageId", "personId"))`);
        await queryRunner.query(`INSERT INTO "temporary_image_persons_person"("imageId", "personId") SELECT "imageId", "personId" FROM "image_persons_person"`);
        await queryRunner.query(`DROP TABLE "image_persons_person"`);
        await queryRunner.query(`ALTER TABLE "temporary_image_persons_person" RENAME TO "image_persons_person"`);
        await queryRunner.query(`CREATE TABLE "temporary_folder_closure" ("id_ancestor" integer NOT NULL, "id_descendant" integer NOT NULL, CONSTRAINT "FK_073b49e13e4ebe5c294443a16b4" FOREIGN KEY ("id_ancestor") REFERENCES "folder" ("id"), CONSTRAINT "FK_fe732379b449e3dc89f52b8b441" FOREIGN KEY ("id_descendant") REFERENCES "folder" ("id"), PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`INSERT INTO "temporary_folder_closure"("id_ancestor", "id_descendant") SELECT "id_ancestor", "id_descendant" FROM "folder_closure"`);
        await queryRunner.query(`DROP TABLE "folder_closure"`);
        await queryRunner.query(`ALTER TABLE "temporary_folder_closure" RENAME TO "folder_closure"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "folder_closure" RENAME TO "temporary_folder_closure"`);
        await queryRunner.query(`CREATE TABLE "folder_closure" ("id_ancestor" integer NOT NULL, "id_descendant" integer NOT NULL, PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`INSERT INTO "folder_closure"("id_ancestor", "id_descendant") SELECT "id_ancestor", "id_descendant" FROM "temporary_folder_closure"`);
        await queryRunner.query(`DROP TABLE "temporary_folder_closure"`);
        await queryRunner.query(`ALTER TABLE "image_persons_person" RENAME TO "temporary_image_persons_person"`);
        await queryRunner.query(`CREATE TABLE "image_persons_person" ("imageId" integer NOT NULL, "personId" integer NOT NULL, PRIMARY KEY ("imageId", "personId"))`);
        await queryRunner.query(`INSERT INTO "image_persons_person"("imageId", "personId") SELECT "imageId", "personId" FROM "temporary_image_persons_person"`);
        await queryRunner.query(`DROP TABLE "temporary_image_persons_person"`);
        await queryRunner.query(`ALTER TABLE "image_tags_tag" RENAME TO "temporary_image_tags_tag"`);
        await queryRunner.query(`CREATE TABLE "image_tags_tag" ("imageId" integer NOT NULL, "tagId" integer NOT NULL, PRIMARY KEY ("imageId", "tagId"))`);
        await queryRunner.query(`INSERT INTO "image_tags_tag"("imageId", "tagId") SELECT "imageId", "tagId" FROM "temporary_image_tags_tag"`);
        await queryRunner.query(`DROP TABLE "temporary_image_tags_tag"`);
        await queryRunner.query(`ALTER TABLE "folder" RENAME TO "temporary_folder"`);
        await queryRunner.query(`CREATE TABLE "folder" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "dateAdded" datetime NOT NULL DEFAULT (datetime('now')), "parentId" integer)`);
        await queryRunner.query(`INSERT INTO "folder"("id", "name", "dateAdded", "parentId") SELECT "id", "name", "dateAdded", "parentId" FROM "temporary_folder"`);
        await queryRunner.query(`DROP TABLE "temporary_folder"`);
        await queryRunner.query(`ALTER TABLE "image" RENAME TO "temporary_image"`);
        await queryRunner.query(`CREATE TABLE "image" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "suffix" varchar NOT NULL, "originalName" varchar NOT NULL, "dateAdded" datetime NOT NULL DEFAULT (datetime('now')), "description" varchar, "dateFrom" datetime, "dateTo" datetime, "parentFolderId" integer, "placeId" integer)`);
        await queryRunner.query(`INSERT INTO "image"("id", "name", "suffix", "originalName", "dateAdded", "description", "dateFrom", "dateTo", "parentFolderId", "placeId") SELECT "id", "name", "suffix", "originalName", "dateAdded", "description", "dateFrom", "dateTo", "parentFolderId", "placeId" FROM "temporary_image"`);
        await queryRunner.query(`DROP TABLE "temporary_image"`);
        await queryRunner.query(`DROP TABLE "folder_closure"`);
        await queryRunner.query(`DROP TABLE "image_persons_person"`);
        await queryRunner.query(`DROP TABLE "image_tags_tag"`);
        await queryRunner.query(`DROP TABLE "folder"`);
        await queryRunner.query(`DROP TABLE "image"`);
        await queryRunner.query(`DROP TABLE "place"`);
        await queryRunner.query(`DROP TABLE "person"`);
        await queryRunner.query(`DROP TABLE "tag"`);
    }

}
