import 'reflect-metadata';
import { ImageController } from '../src/controller/ImageController';
import { Image } from '../src/entity/Image';
import { setupTestConnection, closeTestConnection } from './utils/test-utils';
import { getManager } from 'typeorm';
import { Folder } from '../src/entity/Folder';

describe('Image Controller', function() {
    beforeAll(async () => {
        await setupTestConnection();
        this.controller = new ImageController();
    });

    afterAll(async () => {
        await closeTestConnection();
    });

    it('can save a new entity', async () => {
        const savedImage: Image = await this.controller.save({
            name: 'New Image',
            suffix: 'png',
            originalName: 'original Name'
        });

        expect(savedImage.id).toBeGreaterThanOrEqual(1);
        expect(savedImage.name).toBe('New Image');
    });

    it('can load all entities', async () => {
        const images: Image[] = await this.controller.all();

        expect(Array.isArray(images)).toBeTruthy();
        expect(images.length).toBe(1);
    });

    it('can load an entity by id', async () => {
        const image: Image = await this.controller.one(1);

        expect(image.name).toBe('New Image');
    });

    it('can update an entity', async () => {
        await this.controller.update(1, { name: 'New Image 1', suffix: 'jpg' });
        const newImage: Image = await this.controller.one(1);

        expect(newImage.name).toBe('New Image 1');
        expect(newImage.suffix).toBe('jpg');

        expect(newImage.originalName).toBe('original Name');
    });

    it('can delete an entity by id', async () => {
        await this.controller.remove(1);
        const images: Image[] = await this.controller.all();

        expect(images.length).toBe(0);
    });

    it('can load all entities by folder id', async () => {
        const folder = await getManager().save(getManager().create(Folder, { name: 'lorem' }));
        const image1: Image = await this.controller.save({
            name: 'New Image 1',
            suffix: 'png',
            originalName: 'original Name 1',
            parentFolder: folder
        });

        const image2: Image = await this.controller.save({
            name: 'New Image 2',
            suffix: 'jpg',
            originalName: 'original Name 2',
            parentFolder: folder
        });

        const image3: Image = await this.controller.save({
            name: 'New Image 3',
            suffix: 'jpg',
            originalName: 'original Name 3'
            // not in lorem
        });

        const images: Image[] = await this.controller.allByFolderId(folder.id);

        expect(images.length).toBe(2);
        expect(images[0].name).toBe('New Image 1');
        expect(images[1].name).toBe('New Image 2');
    });
});
