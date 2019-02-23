import { Connection } from 'typeorm';
import { createTestModule, createTestData } from '../../test/utils/test-utils';
import 'jest-extended';
import { ExplorerService } from './explorer.service';
import { ExplorerController } from './explorer.controller';
import { FolderService } from '../folder/folder.service';
import { PathHelperService } from '../util/path-helper/path-helper.service';
import { FileSystemService } from '../fileSystem/file-system.service';
import { ImageService } from '../image/image.service';
import * as drivelist from 'drivelist';
import { FileSystemException } from '../../../shared/exception/file-system.exception';
import { RelocationException } from '../../../shared/exception/relocation.exception';
import { FileNotFoundException } from '../../../shared/exception/file-not-found.exception';
import { IExplorerContentDto } from '../../../shared/dto/IExplorerContent.dto';
import { ImageDtoFactory } from '../factory/image-dto.factory';
import { FolderDtoFactory } from '../factory/folder-dto.factory';

describe('ExplorerController', () => {
    let connection: Connection;
    let explorerController: ExplorerController;
    let explorerService: ExplorerService;
    let folderService: FolderService;
    let fileSystemService: FileSystemService;
    let imageService: ImageService;

    beforeAll(async () => {
        const module = await createTestModule({
            controllers: [ExplorerController],
            providers: [
                // FolderService does not need to be provided as it's provided by FactoryModule...
                ExplorerService,
                FileSystemService,
                PathHelperService,
                ImageService
            ]
        });
        connection = module.get<Connection>(Connection);
        explorerController = module.get<ExplorerController>(ExplorerController);
        explorerService = module.get<ExplorerService>(ExplorerService);
        folderService = module.get<FolderService>(FolderService);
        fileSystemService = module.get<FileSystemService>(FileSystemService);
        imageService = module.get<ImageService>(ImageService);

        // call the lifecycle-hook manually
        module.get<FolderDtoFactory>(FolderDtoFactory).onModuleInit();
        module.get<ImageDtoFactory>(ImageDtoFactory).onModuleInit();

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
            const result: IExplorerContentDto | FileSystemException = await explorerController.getContentByFolderPath(f2Path);
            const mergeResult = result as IExplorerContentDto;

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

            const result: IExplorerContentDto | FileSystemException = await explorerController.getSystemDrives();
            const mergeResult = result as IExplorerContentDto;

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

    describe('relocateFolder', () => {
        it('should relocate a renamed folder', async () => {
            jest.spyOn(folderService, 'update').mockResolvedValue(undefined);

            const f2 = await folderService.findOneByName('F2');
            await explorerController.relocateFolder({ oldPath: 'C:\\F2', newPath: 'C:\\F2 new' });

            expect(folderService.update).toBeCalledWith(
                f2.id,
                expect.toContainEntries([
                    ['name', 'F2 new'],
                    ['parent', expect.toContainEntry(['name', 'C:'])]
                ])
            );
        });

        it('should relocate a moved folder (moved into tracked folder)', async () => {
            jest.spyOn(folderService, 'update').mockResolvedValue(undefined);

            const f2 = await folderService.findOneByName('F2');
            await explorerController.relocateFolder({ oldPath: 'C:\\F2', newPath: 'D:\\F4\\F5\\F2' });

            expect(folderService.update).toBeCalledWith(
                f2.id,
                expect.toContainEntries([
                    ['name', 'F2'],
                    ['parent', expect.toContainEntry(['name', 'F5'])]
                ])
            );
        });

        it('should relocate a renamed and moved folder (moved into tracked folder)', async () => {
            jest.spyOn(folderService, 'update').mockResolvedValue(undefined);

            const f2 = await folderService.findOneByName('F2');
            await explorerController.relocateFolder({ oldPath: 'C:\\F2', newPath: 'D:\\F4\\F5\\F2 new' });

            expect(folderService.update).toBeCalledWith(
                f2.id,
                expect.toContainEntries([
                    ['name', 'F2 new'],
                    ['parent', expect.toContainEntry(['name', 'F5'])]
                ])
            );
        });

        it('should relocate a renamed and moved folder (moved into untracked folder)', async () => {
            jest.spyOn(folderService, 'update').mockResolvedValue(undefined);

            const f2 = await folderService.findOneByName('F2');
            await explorerController.relocateFolder({ oldPath: 'C:\\F2', newPath: 'D:\\F4\\foo\\bar\\F2 new' });

            expect(folderService.update).toBeCalledWith(
                f2.id,
                expect.toContainEntries([
                    ['name', 'F2 new'],
                    ['parent', expect.toContainEntry(['name', 'bar'])]
                ])
            );
        });

        it('should relocated a renamed folder with no parent', async () => {
            jest.spyOn(folderService, 'update').mockResolvedValue(undefined);

            const c = await folderService.findOneByName('C:');
            await explorerController.relocateFolder({ oldPath: 'C:', newPath: 'Y:' });

            expect(folderService.update).toBeCalledWith(
                c.id,
                expect.toContainEntries([
                    ['name', 'Y:'],
                    ['parent', null]
                ])
            );
        });

        it('should relocated a dissolved folder (moved content to tracked folder)', async () => {
            jest.spyOn(folderService, 'updateByConditions').mockResolvedValue(undefined);
            jest.spyOn(imageService, 'updateByConditions').mockResolvedValue(undefined);
            jest.spyOn(folderService, 'remove').mockResolvedValue(undefined);

            const f2 = await folderService.findOneByName('F2');
            await explorerController.relocateFolder({ oldPath: 'C:\\F2', newPath: 'D:\\F4\\F5' });

            expect(folderService.updateByConditions).toBeCalledWith(
                expect.toContainEntry(['parent', expect.toContainAnyEntries([['name', 'F2']])]),
                expect.toContainEntry(['parent', expect.toContainAnyEntries([['name', 'F5']])])
            );
            expect(imageService.updateByConditions).toBeCalledWith(
                expect.toContainEntry(['parentFolder', expect.toContainAnyEntries([['name', 'F2']])]),
                expect.toContainEntry(['parentFolder', expect.toContainAnyEntries([['name', 'F5']])])
            );
            expect(folderService.remove).toBeCalledWith(f2.id);
        });
    });

    describe('relocateImage', () => {
        it('should relocate a renamed image', async () => {
            jest.spyOn(imageService, 'update').mockResolvedValue(undefined);

            const image = await imageService.findOneByConditions({ name: 'dummy-image-1' });
            await explorerController.relocateImage({ oldPath: 'C:\\dummy-image-1.jpg', newPath: 'C:\\dummy-image-1-new.jpg' });

            expect(imageService.update).toBeCalledWith(
                image.id,
                expect.toContainEntries([
                    ['name', 'dummy-image-1-new'],
                    ['extension', 'jpg'],
                    ['parentFolder', expect.toContainEntry(['name', 'C:'])]
                ])
            );
        });

        it('should relocate a moved image (moved into tracked folder)', async () => {
            jest.spyOn(imageService, 'update').mockResolvedValue(undefined);

            const image = await imageService.findOneByConditions({ name: 'dummy-image-6' });
            await explorerController.relocateImage({ oldPath: 'C:\\F2\\F3\\dummy-image-6.jpg', newPath: 'D:\\F4\\dummy-image-6.jpg' });

            expect(imageService.update).toBeCalledWith(
                image.id,
                expect.toContainEntries([
                    ['name', 'dummy-image-6'],
                    ['extension', 'jpg'],
                    ['parentFolder', expect.toContainEntry(['name', 'F4'])]
                ])
            );
        });

        it('should relocate a renamed and moved image (moved into tracked folder)', async () => {
            jest.spyOn(imageService, 'update').mockResolvedValue(undefined);

            const image = await imageService.findOneByConditions({ name: 'dummy-image-6' });
            await explorerController.relocateImage({ oldPath: 'C:\\F2\\F3\\dummy-image-6.jpg', newPath: 'D:\\F4\\dummy-image-6-new.PNG' });

            expect(imageService.update).toBeCalledWith(
                image.id,
                expect.toContainEntries([
                    ['name', 'dummy-image-6-new'],
                    ['extension', 'PNG'],
                    ['parentFolder', expect.toContainEntry(['name', 'F4'])]
                ])
            );
        });

        it('should relocate a renamed and moved image (moved into untracked folder)', async () => {
            jest.spyOn(imageService, 'update').mockResolvedValue(undefined);

            const image = await imageService.findOneByConditions({ name: 'dummy-image-6' });
            await explorerController.relocateImage({ oldPath: 'C:\\F2\\F3\\dummy-image-6.jpg', newPath: 'D:\\foo\\dummy-image-6-new.PNG' });

            expect(imageService.update).toBeCalledWith(
                image.id,
                expect.toContainEntries([
                    ['name', 'dummy-image-6-new'],
                    ['extension', 'PNG'],
                    ['parentFolder', expect.toContainEntry(['name', 'foo'])]
                ])
            );
        });

        it('should throw an error when source image doesn\'t exists', async () => {
            let thrownError;
            try {
                await explorerController.relocateImage({ oldPath: 'C:\\foo\\not-existing.jpg', newPath: 'C:\\foo\\dummy-image-1.jpg' });
            } catch (error) {
                thrownError = error;
            }
            expect(thrownError).toBeInstanceOf(FileNotFoundException);
            expect(thrownError.status).toBe(500);
            expect(thrownError.userMessage).toBeDefined();
        });

        it('should throw an error when target image already exists', async () => {
            let thrownError;
            try {
                await explorerController.relocateImage({ oldPath: 'C:\\F2\\F3\\dummy-image-6.jpg', newPath: 'C:\\dummy-image-1.jpg' });
            } catch (error) {
                thrownError = error;
            }
            expect(thrownError).toBeInstanceOf(RelocationException);
            expect(thrownError.status).toBe(500);
            expect(thrownError.userMessage).toBeDefined();
        });
    });
});
