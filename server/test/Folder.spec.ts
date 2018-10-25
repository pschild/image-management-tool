import 'reflect-metadata';
import * as path from 'path';
import { getManager, getConnection } from 'typeorm';
import { Folder } from '../src/entity/Folder';
import { setupTestConnection, closeTestConnection } from './utils/test-utils';

describe('Folder Repository', function() {
    beforeAll(async () => {
        await setupTestConnection();
        this.repository = getManager().getRepository(Folder);
    });

    beforeEach(async () => {
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(Folder)
            .execute();

        /**
         * Create the following structure:
         *
         * ROOT
         *  |- C:
         *  |--- F1
         *  |--- F2
         *  |------ F3
         *  |- D:
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

    afterAll(async () => {
        await closeTestConnection();
    });

    it('can save and load hierarchical folders', async () => {
        const c = await this.repository.findOne({ name: 'C:' }, { relations: ['children', 'parent'] });
        expect(c.children.length).toBe(2);
        expect(c.parent).toBe(null);

        const f5 = await this.repository.findOne({ name: 'F5' }, { relations: ['children', 'parent'] });
        expect(f5.children.length).toBe(1);
        expect(f5.parent.name).toBe('F4');

        const f6 = await this.repository.findOne({ name: 'F6' }, { relations: ['children', 'parent'] });
        expect(f6.children.length).toBe(0);
        expect(f6.parent.name).toBe('F5');
    });

    it('can add a child folder', async () => {
        // Usecase: add Folder F7, use D: as parent
        let d = await this.repository.findOne({ name: 'D:' });
        let f7 = new Folder();
        f7.name = 'F7';
        await getManager().save(f7);

        await getConnection()
            .createQueryBuilder()
            .relation(Folder, 'children')
            .of(d)
            .add(f7);

        d = await this.repository.findOne({ name: 'D:' }, { relations: ['children'] });
        expect(d.children.length).toBe(2);
        expect(d.children[0].name).toBe('F4');
        expect(d.children[1].name).toBe('F7');

        f7 = await this.repository.findOne({ name: 'F7' }, { relations: ['parent'] });
        expect(f7.parent.name).toBe('D:');
    });

    it('can remove a child folder', async () => {
        // Usecase: remove Folder F5 as child of F4
        let f4 = await this.repository.findOne({ name: 'F4' }, { relations: ['children'] });
        let f5 = await this.repository.findOne({ name: 'F5' });

        await getConnection()
            .createQueryBuilder()
            .relation(Folder, 'children')
            .of(f4)
            .remove(f5);

        f4 = await this.repository.findOne({ name: 'F4' }, { relations: ['children'] });
        expect(f4.children.length).toBe(0);

        f5 = await this.repository.findOne({ name: 'F5' }, { relations: ['children', 'parent'] });
        expect(f5.parent).toBe(null);
        expect(f5.children.length).toBe(1);
        expect(f5.children[0].name).toBe('F6');
    });

    it('can move folders (existing folder)', async () => {
        // Usecase: set parent of F2 to F5 (move F2 > F3 from C: to D: > F4 > F5)
        const folderToMove = await this.repository.findOne({ name: 'F2' });

        const newPath = path.join('D:', 'F4', 'F5'); // the new path will be chosen by Dialog in the application
        const pathParts = newPath.split(path.sep);

        let parent = null;

        // analyze the given path from beginning to end: try to find each folder by name and parent folder
        for (const part of pathParts) {
            const foundFolder = await this.repository.findOne({ name: part, parent: parent });
            if (foundFolder) {
                parent = foundFolder;
            } else {
                // here we need to create a new folder. This should be sth for a different test case
            }
        }

        expect(parent.name).toBe('F5');

        folderToMove.parent = parent;
        await getManager().save(folderToMove);

        const f5 = await this.repository.findOne({ name: 'F5' }, { relations: ['children'] });
        expect(f5.children).toBeDefined();
        expect(f5.children.length).toBe(2);
        expect(f5.children[0].name).toBe('F2');
        expect(f5.children[1].name).toBe('F6');

        const f2 = await this.repository.findOne({ name: 'F2' }, { relations: ['parent', 'children'] });
        expect(f2.parent.name).toBe('F5');
        expect(f2.children).toBeDefined();
        expect(f2.children.length).toBe(1);
        expect(f2.children[0].name).toBe('F3');
    });

    it('can delete leaf folders', async () => {
        // Usecase: delete Folder F3, which does not have child folders
        const folderToDelete = await this.repository.findOne({ name: 'F3' });

        let error;
        try {
            await this.repository.remove(folderToDelete);
        } catch (errorMsg) {
            error = errorMsg;
        }

        expect(error).toBeUndefined();
    });

    it('cannot delete folder with children', async () => {
        // Usecase: delete Folder D:, which has child folders
        const folderToDelete = await this.repository.findOne({ name: 'D:' });

        let error;
        try {
            await this.repository.remove(folderToDelete);
        } catch (errorMsg) {
            error = errorMsg;
        }

        expect(error).toBeDefined();
    });
});
