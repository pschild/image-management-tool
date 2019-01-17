import 'jest-extended';
import { Test } from '@nestjs/testing';
import { FileSystemService } from './fileSystem.service';
import { UtilModule } from '../util/util.module';
import * as drivelist from 'drivelist';
import * as os from 'os';
import * as path from 'path';

describe('FileSystemService', () => {
    let fileSystemService: FileSystemService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [UtilModule],
            providers: [FileSystemService]
        }).compile();

        fileSystemService = module.get<FileSystemService>(FileSystemService);

        jest.spyOn(fileSystemService, 'getFilesByPath').mockReturnValue([
            {
                name: 'folderA',
                absolutePath: 'some/drive/folderA',
                isFile: false,
                isDirectory: true
            },
            {
                name: 'folderB',
                absolutePath: 'some/drive/folderB',
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
        ]);
    });

    describe('getFilesByPath', () => {
        it('should return files by path', async () => {
            const files = await fileSystemService.getFilesByPath('some/drive');
            expect(files).toBeArrayOfSize(5);
        });

        it('should return folders by path', async () => {
            const files = await fileSystemService.getFilesByPath('some/drive');
            const folders = fileSystemService.filterByFolder(files);

            expect(folders).toBeArrayOfSize(2);
            expect(folders[0].name).toBe('folderA');
            expect(folders[1].name).toBe('folderB');
        });

        it('should return images by path', async () => {
            const files = await fileSystemService.getFilesByPath('some/drive');
            const images = fileSystemService.filterByImage(files);

            expect(images).toBeArrayOfSize(2);
            expect(images[0].name).toBe('img1');
            expect(images[1].name).toBe('img2');
        });
    });

    describe('getSystemDrives', () => {
        it('should return system drives', async () => {
            jest.spyOn(drivelist, 'list').mockImplementation(callbackFn => {
                callbackFn(null, [
                    { mountpoints: [{ path: 'C:\\' }] },
                    { mountpoints: [{ path: 'D:\\' }] }
                ]);
            });

            const systemDrives = await fileSystemService.getSystemDrives();
            expect(drivelist.list).toHaveBeenCalled();
            expect(systemDrives).toBeArrayOfSize(2);
            expect(systemDrives[0].name).toBe('C:');
            expect(systemDrives[0].absolutePath).toBe('C:');
            expect(systemDrives[0].ext).toBeUndefined();
            expect(systemDrives[0].isFile).toBeUndefined();
            expect(systemDrives[0].isDirectory).toBeTrue();
        });
    });

    describe('getHomeDirectory', () => {
        it('should return the home directory', async () => {
            jest.spyOn(os, 'homedir').mockReturnValue(path.join('C:', 'Users', 'johndoe'));

            const homedir = await fileSystemService.getHomeDirectory();
            expect(os.homedir).toHaveBeenCalled();
            expect(homedir).toBe(`C:${path.sep}Users${path.sep}johndoe`);
        });
    });
});
