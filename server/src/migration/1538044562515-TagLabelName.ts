import {MigrationInterface, QueryRunner} from "typeorm";

export class TagLabelName1538044562515 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.renameColumn('tag', 'label', 'name');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.renameColumn('tag', 'name', 'label');
    }

}
