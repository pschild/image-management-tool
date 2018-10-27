import 'reflect-metadata';
import { setupTestConnection, closeTestConnection } from './utils/test-utils';
import { FileSystemController } from '../src/controller/FileSystemController';
import * as drivelist from 'drivelist';

describe('FileSystem Controller', function() {
    beforeAll(async () => {
        await setupTestConnection();
        this.controller = new FileSystemController();

        spyOn(this.controller, 'getFilesByPath').and.returnValue([
            {
                name: 'folderA',
                absolutePath: 'some/drive/folderA',
                ext: '',
                isFile: false,
                isDirectory: true
            },
            {
                name: 'folderB',
                absolutePath: 'some/drive/folderB',
                ext: '',
                isFile: false,
                isDirectory: true
            },
            {
                name: 'img1',
                absolutePath: 'some/drive/img1.jpg',
                ext: 'jpg',
                isFile: true,
                isDirectory: false
            },
            {
                name: 'img2',
                absolutePath: 'some/drive/img2.PNG',
                ext: 'PNG',
                isFile: true,
                isDirectory: false
            },
            {
                name: 'document',
                absolutePath: 'some/drive/document.pdf',
                ext: 'pdf',
                isFile: true,
                isDirectory: false
            }
        ]);
    });

    afterAll(async () => {
        await closeTestConnection();
    });

    it('it can get folders by path', async () => {
        const folders = await this.controller.getFoldersByPath('some/drive');

        expect(folders.length).toBe(2);
        expect(folders[0].name).toBe('folderA');
        expect(folders[1].name).toBe('folderB');
    });

    it('it can get images by path', async () => {
        const images = await this.controller.getImagesByPath('some/drive');

        expect(images.length).toBe(2);
        expect(images[0].name).toBe('img1');
        expect(images[1].name).toBe('img2');
    });

    it('it can get the system drives', async () => {
        spyOn(drivelist, 'list').and.callFake(callbackFn => {
            callbackFn(null, [
                {
                    mountpoints: [{ path: 'C://' }]
                },
                {
                    mountpoints: [{ path: 'D://' }]
                }
            ]);
        });

        const systemDrives = await this.controller.getSystemDrives();

        expect(drivelist.list).toHaveBeenCalled();
        expect(systemDrives.length).toBe(2);
        expect(systemDrives[0].name).toBe('C://');
        expect(systemDrives[0].absolutePath).toBe('C://');
        expect(systemDrives[0].ext).toBeUndefined();
        expect(systemDrives[0].isFile).toBe(false);
        expect(systemDrives[0].isDirectory).toBe(true);
    });
});
