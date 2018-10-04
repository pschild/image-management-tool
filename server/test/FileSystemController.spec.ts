import 'reflect-metadata';
import { setupTestConnection, closeTestConnection } from './utils/test-utils';
import { FileSystemController } from '../src/controller/FileSystemController';

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
});
