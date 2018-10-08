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
        expect(pathOfC).toBe(path.join('C:'));

        const f6 = await this.repository.findOne({ name: 'F6' });
        const pathOfF6 = await this.controller.buildPathByFolderId(f6.id);
        expect(pathOfF6).toBe(path.join('D:', 'F4', 'F5', 'F6'));

        const f3 = await this.repository.findOne({ name: 'F3' });
        const pathOfF3 = await this.controller.buildPathByFolderId(f3.id);
        expect(pathOfF3).toBe(path.join('C:', 'F2', 'F3'));
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

        const pathOfUnknownFolder = path.join('C:', 'F2', 'F3', 'unknown');
        foundFolder = await this.controller.getFolderByPath(pathOfUnknownFolder);
        expect(foundFolder).toBeUndefined();
    });

    it('can find direct descendants', async () => {
        const c = await this.repository.findOne({ name: 'C:' });
        const directChildren = await this.controller.findDirectDescendants(c.id);

        const descendantNames = directChildren.map(child => child.name);
        expect(descendantNames.length).toBe(2);
        expect(descendantNames[0]).toBe('F1');
        expect(descendantNames[1]).toBe('F2');
    });

    it('can change a folders parent and children', async () => {
        const f2 = await this.repository.findOne({ name: 'F2' });

        // ensure correct situations at beginning
        const ancestorsTree = await this.repository.findAncestorsTree(f2);
        expect(ancestorsTree.name).toBe('F2');
        expect(ancestorsTree.parent.name).toBe('C:');

        const descendantsTree = await this.repository.findDescendantsTree(f2);
        expect(descendantsTree.name).toBe('F2');
        expect(descendantsTree.children.length).toBe(1);
        expect(descendantsTree.children[0].name).toBe('F3');

        // set parent of F2 to F4 (move F2 > F3 from C: to D: > F4)
        const f4 = await this.repository.findOne({ name: 'F4' });
        const f4Parent = await this.repository.findAncestorsTree(f4);
        expect(f4Parent.name).toBe('F4');
        expect(f4Parent.parent.name).toBe('D:');

        f2.parent = f4;

        const f2New = await this.repository.save(f2);
        expect(f2New.parent.name).toBe('F4');
        expect(f2New.children.length).toBe(1);
        expect(f2New.children[0].name).toBe('F3');

        // moving of tree entities is not yet implemented in TypeORM:
        // https://github.com/typeorm/typeorm/issues/2032
        // the following 3 lines are temporary!

        // const f4New = await this.repository.findOne({ name: 'F4' });
        // const f4Children = await this.repository.findDescendantsTree(f4New);
        // console.log(f4Children);
        // expect(f4Children.children.length).toBe(2);
        // expect(f4Children.children[0].name).toBe('F2');
    });
});
