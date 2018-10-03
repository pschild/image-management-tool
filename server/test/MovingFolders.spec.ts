import 'reflect-metadata';
import { createConnection, getConnection, getManager } from 'typeorm';
import { Tag } from '../src/entity/Tag';
import { Image } from '../src/entity/Image';
import { Folder } from '../src/entity/Folder';
import { Person } from '../src/entity/Person';
import { Place } from '../src/entity/Place';
import * as path from 'path';

describe('Moving of Folders', function() {
    beforeAll(async () => {
        await createConnection({
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
            entities: [Tag, Image, Place, Person, Folder]
        });
    });

    afterAll(async () => {
        await getConnection().close();
    });

    beforeEach(async () => {
        /**
         * Create the following structure:
         *
         * ROOT
         *  |- C
         *  |--- F1
         *  |--- F2
         *  |------ F3
         *  |- D
         *  |--- F4
         *  |------ F5
         *  |--------- F6
         */
        const c = await getManager().save(getManager().create(Folder, { name: 'C:' }));
        const f1 = await getManager().save(getManager().create(Folder, { name: 'F1', parent: c }));
        const f2 = await getManager().save(getManager().create(Folder, { name: 'F2', parent: c }));
        const f3 = await getManager().save(getManager().create(Folder, { name: 'F3', parent: f2 }));

        const d = await getManager().save(getManager().create(Folder, { name: 'D:' }));
        const f4 = await getManager().save(getManager().create(Folder, { name: 'F4', parent: d }));
        const f5 = await getManager().save(getManager().create(Folder, { name: 'F5', parent: f4 }));
        const f6 = await getManager().save(getManager().create(Folder, { name: 'F6', parent: f5 }));
    });

    it('works when moving to existing Folder', async () => {
        const repository = getManager().getTreeRepository(Folder);

        // Usecase: Folder F2 is moved to D:/F4/F5/F6, including subfolders
        const folderToMove = await repository.findOne({ name: 'F2' });

        const newPath = path.join('D:', 'F4', 'F5', 'F6'); // the new path will be chosen by Dialog in the application
        const pathParts = newPath.split(path.sep);

        let parentFolder = null;

        // analyze the given path from beginning to end: try to find each folder by name and parent folder
        for (const part of pathParts) {
            const foundFolder = await repository.findOne({ name: part, parent: parentFolder });
            if (foundFolder) {
                parentFolder = foundFolder;
            } else {
                // here we need to create a new folder. This should be sth for a different test case
            }
        }

        folderToMove.parent = parentFolder;
        const movedFolder = await getManager().save(folderToMove);
        expect(movedFolder.parent.name).toBe('F6');

        // moving of tree entities is not yet implemented in TypeORM:
        // https://github.com/typeorm/typeorm/issues/2032
        // the following 3 lines are temporary!
        const f6 = await repository.findOne({ name: 'F6' });
        f6.children = f6.children || [];
        f6.children.push(movedFolder);

        const f6New = await getManager().save(f6);
        expect(f6New.children).toBeDefined();
        expect(f6New.children.length).toBe(1);
        expect(f6New.children[0].name).toBe('F2');
    });

    it('works when moving to new Folder', async () => {

    });
});
