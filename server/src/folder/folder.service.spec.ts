import { Connection, UpdateResult } from 'typeorm';
import { createTestModule, createTestData } from '../../test/utils/test-utils';
import { FolderService } from './folder.service';
import 'jest-extended';
import { PathHelperService } from '../util/path-helper/path-helper.service';
import * as path from 'path';
import { Folder } from '../entity/folder.entity';
import { ImageService } from '../image/image.service';

describe('FolderService', () => {
    let connection: Connection;
    let folderService: FolderService;
    let imageService: ImageService;

    beforeAll(async () => {
        const module = await createTestModule({
            providers: [FolderService, PathHelperService, ImageService]
        });
        connection = module.get<Connection>(Connection);
        folderService = module.get<FolderService>(FolderService);
        imageService = module.get<ImageService>(ImageService);
    });

    beforeEach(async () => {
        await createTestData();
    });

    afterAll(async () => {
        await connection.close();
    });

    describe('create', () => {
        it('should save a folder', async () => {
            const f6 = await folderService.findOneByName('F6');
            const result = await folderService.create({
                name: 'dummy-folder',
                parent: f6
            });

            expect(result).toBeDefined();
            expect(result.id).toBeGreaterThan(1);
            expect(result.name).toBe('dummy-folder');
            expect(result.dateAdded).toBeValidDate();
        });
    });

    describe('findOne', () => {
        it('should find folder by id', async () => {
            const result = await folderService.findOne(3, true);

            expect(result).toBeDefined();
            expect(result.id).toBe(3);
            expect(result.name).toBe('F2');
            expect(result.dateAdded).toBeValidDate();
            expect(result.parent.name).toBe('C:');
            expect(result.children).toBeArrayOfSize(1);
            expect(result.children[0].name).toBe('F3');
        });
    });

    describe('findOneByName', () => {
        it('should find folder by name', async () => {
            const result = await folderService.findOneByName('F2', true);

            expect(result).toBeDefined();
            expect(result.id).toBe(3);
            expect(result.name).toBe('F2');
            expect(result.dateAdded).toBeValidDate();
            expect(result.parent.name).toBe('C:');
            expect(result.children).toBeArrayOfSize(1);
            expect(result.children[0].name).toBe('F3');
        });
    });

    describe('findDirectDescendantsByFolderId', () => {
        it('should find direct descendants folders by id', async () => {
            const result = await folderService.findDirectDescendantsByFolderId(1);

            expect(result).toBeDefined();
            expect(result).toBeArrayOfSize(2);
            expect(result.map(folder => folder.name)).toEqual(['F1', 'F2']);
        });
    });

    describe('findDirectDescendantsByFolder', () => {
        it('should find direct descendants folders by folder', async () => {
            const c = await folderService.findOneByName('C:');
            const result = await folderService.findDirectDescendantsByFolder(c);

            expect(result).toBeDefined();
            expect(result).toBeArrayOfSize(2);
            expect(result.map(folder => folder.name)).toEqual(['F1', 'F2']);
        });
    });

    describe('findRootFolders', () => {
        it('should find folders without parent (root folders)', async () => {
            const result = await folderService.findRootFolders();

            expect(result).toBeDefined();
            expect(result).toBeArrayOfSize(2);
            expect(result.map(folder => folder.name)).toEqual(['C:', 'D:']);
        });
    });

    describe('findAll', () => {
        it('should find all folders', async () => {
            const result = await folderService.findAll();

            expect(result).toBeDefined();
            expect(result).toBeArrayOfSize(8);
        });
    });

    describe('update', () => {
        it('should update a folder', async () => {
            const result = await folderService.update(1, {
                name: 'dummy-folder-new'
            });

            expect(result).toBeDefined();
            expect(result instanceof UpdateResult).toBeTrue();

            const loadedFolder = await folderService.findOne(1);
            expect(loadedFolder).toBeDefined();
            expect(loadedFolder.name).toBe('dummy-folder-new');
            expect(loadedFolder.dateAdded).toBeValidDate();
        });
    });

    describe('remove', () => {
        it('should remove a folder having no children', async () => {
            const result = await folderService.remove(1);
            expect(result).toBeDefined();

            const loadedFolder = await folderService.findOne(1);
            expect(loadedFolder).toBeUndefined();
        });

        it('should cascade folder removal to contained folders', async () => {
            const f2 = await folderService.findOneByName('F2', true);
            expect(f2).toBeDefined();
            expect(f2.children).toBeArrayOfSize(1);
            expect(f2.children[0].name).toBe('F3');

            const f3 = await folderService.findOneByName('F3', true);
            expect(f3).toBeDefined();
            expect(f3.children).toBeArrayOfSize(0);

            await folderService.remove(f2.id);

            const f2AfterRemoval = await folderService.findOneByName('F2');
            expect(f2AfterRemoval).toBeUndefined();

            const f3AfterRemoval = await folderService.findOneByName('F3');
            expect(f3AfterRemoval).toBeUndefined();
        });

        it('should cascade folder removal to contained images', async () => {
            const f2 = await folderService.findOneByName('F2', true);
            expect(f2).toBeDefined();
            expect(f2.images).toBeArrayOfSize(2);
            expect(f2.images.map(image => image.name)).toEqual(['dummy-image-4', 'dummy-image-5']);

            const f3 = await folderService.findOneByName('F3', true);
            expect(f3.images).toBeArrayOfSize(2);
            expect(f3.images.map(image => image.name)).toEqual(['dummy-image-6', 'dummy-image-7']);

            await folderService.remove(f2.id);

            const imagesOfF2 = await imageService.findAllByFolderId(f2.id);
            expect(imagesOfF2).toBeArrayOfSize(0);

            const imagesOfF3 = await imageService.findAllByFolderId(f3.id);
            expect(imagesOfF3).toBeArrayOfSize(0);
        });
    });

    describe('buildPathByFolderId', () => {
        it('should build a folders path by its id', async () => {
            const f6 = await folderService.findOneByName('F6');
            const result = await folderService.buildPathByFolderId(f6.id);

            expect(result).toBeDefined();
            expect(result).toBeString();
            expect(result).toBe(`D:${path.sep}F4${path.sep}F5${path.sep}F6`);
        });
    });

    describe('getFolderByPath', () => {
        it('should get an existing folder by its path', async () => {
            let foundFolder: Folder;

            const c = await folderService.findOneByName('C:');
            const pathOfFC = path.join('C:');
            foundFolder = await folderService.getFolderByPath(pathOfFC);
            expect(foundFolder.id).toBe(c.id);

            const f6 = await folderService.findOneByName('F6');
            const pathOfF6 = path.join('D:', 'F4', 'F5', 'F6');
            foundFolder = await folderService.getFolderByPath(pathOfF6);
            expect(foundFolder.id).toBe(f6.id);

            const pathOfUnknownFolder = path.join('C:', 'F2', 'F3', 'unknown');
            foundFolder = await folderService.getFolderByPath(pathOfUnknownFolder);
            expect(foundFolder).toBeUndefined();
        });
    });

    describe('createFolderByPath', () => {
        it('should create an unknown folder by its path', async () => {
            const pathOfUnknownFolderCreate = path.join('C:', 'F2', 'F3', 'foo', 'bar');
            const foundFolder = await folderService.createFolderByPath(pathOfUnknownFolderCreate);

            expect(foundFolder).toBeDefined();
            expect(foundFolder.id).toBeGreaterThanOrEqual(1);
            expect(foundFolder.name).toBe('bar');
            expect(foundFolder.parent.name).toBe('foo');
        });
    });
});
