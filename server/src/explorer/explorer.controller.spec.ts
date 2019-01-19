import { Connection } from 'typeorm';
import { createTestModule, createTestData } from '../../test/utils/test-utils';
import 'jest-extended';
import { ExplorerService } from './explorer.service';
import { ExplorerController } from './explorer.controller';
import { FolderService } from '../folder/folder.service';
import { PathHelperService } from '../util/path-helper/path-helper.service';
import { FileSystemService } from '../fileSystem/file-system.service';
import { ImageService } from '../image/image.service';
import { IFolderContentDto } from '../../../domain/interface/IFolderContentDto';
import * as drivelist from 'drivelist';
import { Folder } from '../entity/folder.entity';
import { FileSystemException } from '../../../domain/exception/file-system.exception';

describe('ExplorerController', () => {
    let connection: Connection;
    let explorerController: ExplorerController;
    let explorerService: ExplorerService;
    let folderService: FolderService;
    let fileSystemService: FileSystemService;

    beforeAll(async () => {
        const module = await createTestModule({
            controllers: [ExplorerController],
            providers: [FolderService, ExplorerService, FileSystemService, PathHelperService, ImageService]
        });
        connection = module.get<Connection>(Connection);
        explorerController = module.get<ExplorerController>(ExplorerController);
        explorerService = module.get<ExplorerService>(ExplorerService);
        folderService = module.get<FolderService>(FolderService);
        fileSystemService = module.get<FileSystemService>(FileSystemService);

        jest.spyOn(fileSystemService, 'getFilesByPath').mockResolvedValue([{
            name: 'F3',
            absolutePath: 'some/drive/F3',
            isFile: false,
            isDirectory: true
        }, {
            name: 'new folder',
            absolutePath: 'some/drive/new folder',
            isFile: false,
            isDirectory: true
        }, {
            name: 'dummy-image-4',
            absolutePath: 'some/drive/dummy-image-4.jpeg',
            extension: 'jpeg',
            isFile: true,
            isDirectory: false
        }]);
    });

    beforeEach(async () => {
        await createTestData();
    });

    afterAll(async () => {
        await connection.close();
    });

    describe('getContentByFolderId', () => {
        it('should return the same result as getContentByFolderPath', async () => {
            const c = await folderService.findOneByName('C:');

            const mergeResult1 = await explorerController.getContentByFolderPath('C:');
            const mergeResult2 = await explorerController.getContentByFolderId(c.id);
            expect(mergeResult1).toEqual(mergeResult2);
        });
    });

    describe('getContentByFolderPath', () => {
        it('should return a correctly merged result', async () => {
            const f2 = await folderService.findOneByName('F2');
            const f2Path = await folderService.buildPathByFolderId(f2.id);
            const result: IFolderContentDto | FileSystemException = await explorerController.getContentByFolderPath(f2Path);
            const mergeResult = result as IFolderContentDto;

            expect(mergeResult.folders).toBeDefined();
            expect(mergeResult.folders).toBeArrayOfSize(2);
            expect(mergeResult.images).toBeDefined();
            expect(mergeResult.images).toBeArrayOfSize(2);

            expect(mergeResult.folders.map(folderDto => folderDto.id)).toEqual([4, undefined]);
            expect(mergeResult.folders.map(folderDto => folderDto.name)).toEqual(['F3', 'new folder']);
            expect(mergeResult.folders.map(folderDto => folderDto.addedInFs)).toEqual([false, true]);
            expect(mergeResult.folders.map(folderDto => folderDto.removedInFs)).toEqual([false, false]);

            expect(mergeResult.images.map(imageDto => imageDto.id)).toEqual([4, 5]);
            expect(mergeResult.images.map(imageDto => imageDto.name)).toEqual(['dummy-image-4', 'dummy-image-5']);
            expect(mergeResult.images.map(imageDto => imageDto.extension)).toEqual(['jpeg', 'TIFF']);
            expect(mergeResult.images.map(imageDto => imageDto.addedInFs)).toEqual([false, false]);
            expect(mergeResult.images.map(imageDto => imageDto.removedInFs)).toEqual([false, true]);
        });
    });

    describe('getSystemDrives', () => {
        it('should return a correctly merged result', async () => {
            jest.spyOn(drivelist, 'list').mockImplementation(callbackFn => {
                callbackFn(null, [
                    { mountpoints: [{ path: 'C:\\' }] },
                    { mountpoints: [{ path: 'D:\\' }] }
                ]);
            });

            const result: IFolderContentDto | FileSystemException = await explorerController.getSystemDrives();
            const mergeResult = result as IFolderContentDto;

            expect(mergeResult.folders).toBeDefined();
            expect(mergeResult.folders).toBeArrayOfSize(2);
            expect(mergeResult.images).toBeDefined();
            expect(mergeResult.images).toBeArrayOfSize(0);

            expect(mergeResult.folders.map(folderDto => folderDto.id)).toEqual([1, 5]);
            expect(mergeResult.folders.map(folderDto => folderDto.name)).toEqual(['C:', 'D:']);
            expect(mergeResult.folders.map(folderDto => folderDto.addedInFs)).toEqual([false, false]);
            expect(mergeResult.folders.map(folderDto => folderDto.removedInFs)).toEqual([false, false]);
        });
    });

    describe('getHomeDirectory', () => {
        it('should return a string', async () => {
            jest.spyOn(fileSystemService, 'getHomeDirectory').mockImplementation(() => 'some/path');
            const result = await explorerController.getHomeDirectory();

            expect(result).toBeDefined();
            expect(result).toBeString();
        });
    });

    describe('createByPath', () => {
        it('should return a string', async () => {
            jest.spyOn(folderService, 'getFolderByPath').mockImplementationOnce(() => new Folder());
            const result: Folder = await explorerController.createByPath({ path: 'some/path' });

            expect(result).toBeDefined();
        });
    });

    describe('relocateFolder', () => {
        it('should relocate a renamed folder', async () => {
            jest.clearAllMocks();
            jest.spyOn(folderService, 'update').mockResolvedValue(undefined);

            const f2 = await folderService.findOneByName('F2');
            await explorerController.relocateFolder({ oldPath: 'C:\\F2', newPath: 'C:\\F2 new' });

            expect(folderService.update).toBeCalledWith(
                f2.id,
                expect.toContainAnyEntries([
                    ['name', 'F2 new'],
                    ['parent', expect.toContainEntry(['name', 'C:'])]
                ])
            );
        });

        it('should relocate a moved (to existing folder) folder', async () => {
            jest.clearAllMocks();
            jest.spyOn(folderService, 'update').mockResolvedValue(undefined);

            const f2 = await folderService.findOneByName('F2');
            await explorerController.relocateFolder({ oldPath: 'C:\\F2', newPath: 'D:\\F4\\F5\\F2' });

            expect(folderService.update).toBeCalledWith(
                f2.id,
                expect.toContainAnyEntries([
                    ['name', 'F2'],
                    ['parent', expect.toContainEntry(['name', 'F5'])]
                ])
            );
        });

        it('should relocate a renamed and moved (to existing folder) folder', async () => {
            jest.clearAllMocks();
            jest.spyOn(folderService, 'update').mockResolvedValue(undefined);

            const f2 = await folderService.findOneByName('F2');
            await explorerController.relocateFolder({ oldPath: 'C:\\F2', newPath: 'D:\\F4\\F5\\F2 new' });

            expect(folderService.update).toBeCalledWith(
                f2.id,
                expect.toContainAnyEntries([
                    ['name', 'F2 new'],
                    ['parent', expect.toContainEntry(['name', 'F5'])]
                ])
            );
        });

        it('should relocate a renamed and moved (to new folder) folder', async () => {
            jest.clearAllMocks();
            jest.spyOn(folderService, 'update').mockResolvedValue(undefined);

            const f2 = await folderService.findOneByName('F2');
            await explorerController.relocateFolder({ oldPath: 'C:\\F2', newPath: 'D:\\F4\\foo\\bar\\F2 new' });

            expect(folderService.update).toBeCalledWith(
                f2.id,
                expect.toContainAnyEntries([
                    ['name', 'F2 new'],
                    ['parent', expect.toContainEntry(['name', 'bar'])]
                ])
            );
        });

        it('should relocated a renamed folder with no parent', async () => {
            jest.clearAllMocks();
            jest.spyOn(folderService, 'update').mockResolvedValue(undefined);

            const c = await folderService.findOneByName('C:');
            await explorerController.relocateFolder({ oldPath: 'C:', newPath: 'Y:' });

            expect(folderService.update).toBeCalledWith(
                c.id,
                expect.toContainAnyEntries([
                    ['name', 'Y:'],
                    ['parent', null]
                ])
            );
        });
    });
});
