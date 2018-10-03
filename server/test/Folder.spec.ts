import 'reflect-metadata';
import { getManager } from 'typeorm';
import { Folder } from '../src/entity/Folder';
import { setupTestConnection, closeTestConnection } from './utils/test-utils';

describe('Folder Repository', function() {
    beforeAll(async () => {
        await setupTestConnection();
    });

    afterAll(async () => {
        await closeTestConnection();
    });

    it('can save and load hierarchical folders', async () => {
        /**
         * Create the following structure:
         *
         * ROOT
         *  |- 1
         *  |--- 1.1
         *  |--- 1.2
         *  |------ 1.2.1
         *  |- 2
         *  |--- 2.1
         */
        const manager = getManager();

        const folder1 = await manager.save(manager.create(Folder, { name: '1' }));
        const folder11 = await manager.save(manager.create(Folder, { name: '1.1', parent: folder1 }));
        const folder12 = await manager.save(manager.create(Folder, { name: '1.2', parent: folder1 }));
        const folder121 = await manager.save(manager.create(Folder, { name: '1.2.1', parent: folder12 }));

        const folder2 = await manager.save(manager.create(Folder, { name: '2' }));
        const folder21 = await manager.save(manager.create(Folder, { name: '2.1', parent: folder2 }));

        const count = await getManager().getTreeRepository(Folder).count();
        expect(count).toBe(6);

        const folderTree = await getManager().getTreeRepository(Folder).findTrees();
        expect(folderTree.length).toBe(2);

        expect(folderTree[0].name).toBe('1');
        expect(folderTree[0].children.length).toBe(2);

        expect(folderTree[0].children[0].name).toBe('1.1');
        expect(folderTree[0].children[0].children.length).toBe(0);

        expect(folderTree[0].children[1].name).toBe('1.2');
        expect(folderTree[0].children[1].children.length).toBe(1);

        expect(folderTree[0].children[1].children[0].name).toBe('1.2.1');
        expect(folderTree[0].children[1].children[0].children.length).toBe(0);

        expect(folderTree[1].name).toBe('2');
        expect(folderTree[1].children.length).toBe(1);

        expect(folderTree[1].children[0].name).toBe('2.1');
        expect(folderTree[1].children[0].children.length).toBe(0);
    });
});
