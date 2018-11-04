import 'reflect-metadata';
import * as path from 'path';
import { setupTestConnection, closeTestConnection } from './utils/test-utils';
import { ExplorerController } from '../src/controller/ExplorerController';
import { getManager } from 'typeorm';
import { Folder } from '../src/entity/Folder';
import { FolderController } from '../src/controller/FolderController';
import { ImageController } from '../src/controller/ImageController';
import { FileSystemController } from '../src/controller/FileSystemController';
import { Image } from '../src/entity/Image';

describe('Explorer Controller', function() {
    beforeAll(async () => {
        await setupTestConnection();
        this.controller = new ExplorerController();
        this.folderController = new FolderController();

        this.dummyFolderContent = [
            {
                name: 'F1',
                absolutePath: 'some/drive/F1',
                isFile: false,
                isDirectory: true
            },
            {
                name: 'F2',
                absolutePath: 'some/drive/F2',
                isFile: false,
                isDirectory: true
            },
            {
                name: 'img1',
                absolutePath: 'some/drive/img1.jpg',
                extension: 'jpg',
                isFile: true,
                isDirectory: false
            },
            {
                name: 'img2',
                absolutePath: 'some/drive/img2.PNG',
                extension: 'PNG',
                isFile: true,
                isDirectory: false
            },
            {
                name: 'document',
                absolutePath: 'some/drive/document.pdf',
                extension: 'pdf',
                isFile: true,
                isDirectory: false
            }
        ];
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
         *  |------ img3.jpg
         *  |--- img1.jpg
         *  |--- img2.PNG
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

        const imageController = new ImageController();
        const img1: Image = await imageController.save({
            name: 'img1',
            extension: 'jpg',
            originalName: 'original Name 1',
            parentFolder: c
        });
        const img2: Image = await imageController.save({
            name: 'img2',
            extension: 'PNG',
            originalName: 'original Name 2',
            parentFolder: c
        });
        const img3: Image = await imageController.save({
            name: 'img3',
            extension: 'jpg',
            originalName: 'original Name 3',
            parentFolder: f2 // not in C:
        });
    });

    it('can merge content when FS and DB are equal', async () => {
        spyOn(FileSystemController.prototype, 'getFilesByPath').and.returnValue(Promise.resolve(this.dummyFolderContent));

        const c = await this.folderController.oneByName('C:');
        const mergeResult = await this.controller.getContentByFolderId(c.id);

        expect(mergeResult.folders).toBeDefined();
        expect(mergeResult.folders.length).toBe(2);
        expect(mergeResult.folders[0].name).toBe('F1');
        expect(mergeResult.folders[0].removedInFs).toBe(false);
        expect(mergeResult.folders[0].addedInFs).toBe(false);
        expect(mergeResult.folders[1].name).toBe('F2');
        expect(mergeResult.folders[1].removedInFs).toBe(false);
        expect(mergeResult.folders[1].addedInFs).toBe(false);

        expect(mergeResult.images.length).toBe(2);
        expect(mergeResult.images[0].name).toBe('img1');
        expect(mergeResult.images[0].removedInFs).toBe(false);
        expect(mergeResult.images[0].addedInFs).toBe(false);
        expect(mergeResult.images[1].name).toBe('img2');
        expect(mergeResult.images[1].removedInFs).toBe(false);
        expect(mergeResult.images[1].addedInFs).toBe(false);
    });

    it('can merge content when FS contains added elements', async () => {
        const dummyContent = [...this.dummyFolderContent, {
            name: 'addedFolder',
            absolutePath: 'some/drive/addedFolder',
            extension: '',
            isFile: false,
            isDirectory: true
        }, {
            name: 'addedImg',
            absolutePath: 'some/drive/addedImg.JPG',
            extension: 'JPG',
            isFile: true,
            isDirectory: false
        }];
        spyOn(FileSystemController.prototype, 'getFilesByPath').and.returnValue(Promise.resolve(dummyContent));

        const c = await this.folderController.oneByName('C:');

        const mergeResult = await this.controller.getContentByFolderId(c.id);

        expect(mergeResult.folders).toBeDefined();
        expect(mergeResult.folders.length).toBe(3);
        expect(mergeResult.folders[2].name).toBe('addedFolder');
        expect(mergeResult.folders[2].removedInFs).toBe(false);
        expect(mergeResult.folders[2].addedInFs).toBe(true);

        expect(mergeResult.images.length).toBe(3);
        expect(mergeResult.images[2].name).toBe('addedImg');
        expect(mergeResult.images[2].removedInFs).toBe(false);
        expect(mergeResult.images[2].addedInFs).toBe(true);
    });

    it('can merge content when FS contains removed elements', async () => {
        const dummyContent = this.dummyFolderContent.filter(element => element.name !== 'F1' && element.name !== 'img1');
        spyOn(FileSystemController.prototype, 'getFilesByPath').and.returnValue(Promise.resolve(dummyContent));

        const c = await this.folderController.oneByName('C:');

        const mergeResult = await this.controller.getContentByFolderId(c.id);

        expect(mergeResult.folders).toBeDefined();
        expect(mergeResult.folders.length).toBe(2);
        expect(mergeResult.folders[0].name).toBe('F1');
        expect(mergeResult.folders[0].removedInFs).toBe(true);
        expect(mergeResult.folders[0].addedInFs).toBe(false);

        expect(mergeResult.images.length).toBe(2);
        expect(mergeResult.images[0].name).toBe('img1');
        expect(mergeResult.images[0].removedInFs).toBe(true);
        expect(mergeResult.images[0].addedInFs).toBe(false);
    });

    it('returns equal results by folder path and folder id', async () => {
        spyOn(FileSystemController.prototype, 'getFilesByPath').and.returnValue(Promise.resolve(this.dummyFolderContent));

        const c = await this.folderController.oneByName('C:');

        const mergeResult1 = await this.controller.getContentByFolderPath('C:');
        const mergeResult2 = await this.controller.getContentByFolderId(c.id);
        expect(mergeResult1).toEqual(mergeResult2);
    });
});
