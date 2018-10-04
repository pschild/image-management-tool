import 'reflect-metadata';
import { setupTestConnection, closeTestConnection } from './utils/test-utils';
import { FolderController } from '../src/controller/FolderController';
import { Folder } from '../src/entity/Folder';
import { getManager, getTreeRepository } from 'typeorm';
import * as path from 'path';

describe('Folder Controller', function() {
    beforeAll(async () => {
        await setupTestConnection();
        this.controller = new FolderController();
        this.repository = getTreeRepository(Folder);
    });

    afterAll(async () => {
        await closeTestConnection();
    });

    beforeEach(async () => {
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

    it('can build a path by folder id', async () => {
        const c = await this.repository.findOne({ name: 'C:' });
        const pathOfFC = await this.controller.buildPathByFolderId(c.id);
        expect(pathOfFC).toBe(path.join('C:'));

        const f6 = await this.repository.findOne({ name: 'F6' });
        const pathOfF6 = await this.controller.buildPathByFolderId(f6.id);
        expect(pathOfF6).toBe(path.join('D:', 'F4', 'F5', 'F6'));

        const f3 = await this.repository.findOne({ name: 'F3' });
        const pathOfF3 = await this.controller.buildPathByFolderId(f3.id);
        expect(pathOfF3).toBe(path.join('C:', 'F2', 'F3'));
    });

    it('can find direct descendants', async () => {
        const c = await this.repository.findOne({ name: 'C:' });
        const directChildren = await this.controller.findDirectDescendants(c.id);

        const descendantNames = directChildren.map(child => child.name);
        expect(descendantNames.length).toBe(2);
        expect(descendantNames[0]).toBe('F1');
        expect(descendantNames[1]).toBe('F2');
    });
});
