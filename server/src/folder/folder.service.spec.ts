import { Connection, UpdateResult } from 'typeorm';
import { createTestModule, createTestData } from '../../test/utils/test-utils';
import { FolderService } from './folder.service';
import 'jest-extended';
import { PathHelperService } from '../util/path-helper/path-helper.service';
import * as path from 'path';
import { Folder } from '../entity/folder.entity';

describe('FolderService', () => {
    let connection: Connection;
    let folderService: FolderService;

    beforeAll(async () => {
        const module = await createTestModule({
            providers: [FolderService, PathHelperService]
        });
        connection = module.get<Connection>(Connection);
        folderService = module.get<FolderService>(FolderService);

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
            expect(result).toBeArrayOfSize(9);
        });
    });

    describe('update', () => {
        it('should update a folder', async () => {
            const result = await folderService.update(9, {
                name: 'dummy-folder-new'
            });

            expect(result).toBeDefined();
            expect(result instanceof UpdateResult).toBeTrue();

            const loadedFolder = await folderService.findOne(9);
            expect(loadedFolder).toBeDefined();
            expect(loadedFolder.name).toBe('dummy-folder-new');
            expect(loadedFolder.dateAdded).toBeValidDate();
        });
    });

    describe('remove', () => {
        it('should remove a folder', async () => {
            const result = await folderService.remove(9);
            expect(result).toBeDefined();

            const loadedFolder = await folderService.findOne(9);
            expect(loadedFolder).toBeUndefined();
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

        it('should get an unknown folder by its path and create it', async () => {
            const pathOfUnknownFolderCreate = path.join('C:', 'F2', 'F3', 'foo', 'bar');
            const foundFolder = await folderService.getFolderByPath(pathOfUnknownFolderCreate, true);

            expect(foundFolder).toBeDefined();
            expect(foundFolder.id).toBeGreaterThanOrEqual(1);
            expect(foundFolder.name).toBe('bar');
            expect(foundFolder.parent.name).toBe('foo');
        });
    });
});
