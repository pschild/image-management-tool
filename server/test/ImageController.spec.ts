import 'reflect-metadata';
import { createConnection, getConnection } from 'typeorm';
import { ImageController } from '../src/controller/ImageController';
import { Tag } from '../src/entity/Tag';
import { Image } from '../src/entity/Image';
import { Folder } from '../src/entity/Folder';
import { Person } from '../src/entity/Person';
import { Place } from '../src/entity/Place';

describe('Image Repository', function() {
    beforeAll(async () => {
        await createConnection({
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
            entities: [Tag, Image, Place, Person, Folder]
        });

        this.controller = new ImageController();
    });

    afterAll(async () => {
        await getConnection().close();
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
});
