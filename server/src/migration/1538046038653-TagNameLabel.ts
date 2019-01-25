import {MigrationInterface, QueryRunner} from "typeorm";

export class TagNameLabel1538046038653 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        throw new Error(`Migrations NYI`);
        await queryRunner.renameColumn('tag', 'name', 'label');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        throw new Error(`Migrations NYI`);
        await queryRunner.renameColumn('tag', 'label', 'name');
    }

}
