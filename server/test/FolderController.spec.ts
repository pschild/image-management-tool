import 'reflect-metadata';
import { setupTestConnection, closeTestConnection } from './utils/test-utils';
import { FolderController } from '../src/controller/FolderController';
import { Folder } from '../src/entity/Folder';
import { getManager, getRepository, getConnection } from 'typeorm';
import * as path from 'path';

describe('Folder Controller', function() {
    beforeAll(async () => {
        await setupTestConnection();
        this.controller = new FolderController();
        this.repository = getRepository(Folder);
    });

    afterAll(async () => {
        await closeTestConnection();
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

    it('can remove the dot from system drive letters', () => {
        expect(this.controller.removeDotFromSystemDriveLetter(['C:.'])).toEqual(['C:']);
        expect(this.controller.removeDotFromSystemDriveLetter(['c:.'])).toEqual(['c:.']);
        expect(this.controller.removeDotFromSystemDriveLetter(['AB:.'])).toEqual(['AB:.']);
        expect(this.controller.removeDotFromSystemDriveLetter(['C:.', 'subfolder'])).toEqual(['C:', 'subfolder']);
        expect(this.controller.removeDotFromSystemDriveLetter(['C:.', 'subfolder.'])).toEqual(['C:', 'subfolder.']);
    });

    it('can build a path by folder id', async () => {
        const c = await this.repository.findOne({ name: 'C:' });
        const pathOfC = await this.controller.buildPathByFolderId(c.id);
        expect(pathOfC).toBe(['C:'].join(path.sep));

        const f6 = await this.repository.findOne({ name: 'F6' });
        const pathOfF6 = await this.controller.buildPathByFolderId(f6.id);
        expect(pathOfF6).toBe(['D:', 'F4', 'F5', 'F6'].join(path.sep));

        const f3 = await this.repository.findOne({ name: 'F3' });
        const pathOfF3 = await this.controller.buildPathByFolderId(f3.id);
        expect(pathOfF3).toBe(['C:', 'F2', 'F3'].join(path.sep));
    });

    it('can get a folder by path', async () => {
        let foundFolder;

        const c = await this.repository.findOne({ name: 'C:' });
        const pathOfFC = path.join('C:');
        foundFolder = await this.controller.getFolderByPath(pathOfFC);
        expect(foundFolder.id).toBe(c.id);

        const f6 = await this.repository.findOne({ name: 'F6' });
        const pathOfF6 = path.join('D:', 'F4', 'F5', 'F6');
        foundFolder = await this.controller.getFolderByPath(pathOfF6);
        expect(foundFolder.id).toBe(f6.id);

        const f3 = await this.repository.findOne({ name: 'F3' });
        const pathOfF3 = path.join('C:', 'F2', 'F3');
        foundFolder = await this.controller.getFolderByPath(pathOfF3);
        expect(foundFolder.id).toBe(f3.id);

        const pathOfUnknownFolderNoCreate = path.join('C:', 'F2', 'F3', 'unknown');
        foundFolder = await this.controller.getFolderByPath(pathOfUnknownFolderNoCreate);
        expect(foundFolder).toBeUndefined();

        const pathOfUnknownFolderCreate = path.join('C:', 'F2', 'F3', 'foo', 'bar');
        foundFolder = await this.controller.getFolderByPath(pathOfUnknownFolderCreate, true);
        expect(foundFolder).toBeDefined();
        expect(typeof foundFolder.id).toBe('number');
        expect(foundFolder.name).toBe('bar');
        expect(foundFolder.parent.name).toBe('foo');
    });

    it('can find direct descendants by folder and folder id', async () => {
        const c = await this.repository.findOne({ name: 'C:' });
        const directChildrenByFolder = await this.controller.findDirectDescendantsByFolder(c);
        const directChildrenByFolderId = await this.controller.findDirectDescendantsByFolderId(c.id);

        expect(directChildrenByFolder).toEqual(directChildrenByFolderId);
    });

    it('can find direct descendants', async () => {
        const c = await this.repository.findOne({ name: 'C:' });
        const directChildren = await this.controller.findDirectDescendantsByFolder(c);

        const descendantNames = directChildren.map(child => child.name);
        expect(descendantNames.length).toBe(2);
        expect(descendantNames[0]).toBe('F1');
        expect(descendantNames[1]).toBe('F2');
    });
});
