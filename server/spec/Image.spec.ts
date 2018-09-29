import 'reflect-metadata';
import { createConnection, getManager } from 'typeorm';
import { Tag } from '../entity/Tag';
import { Image } from '../entity/Image';
import { Folder } from '../entity/Folder';
import { Person } from '../entity/Person';
import { Place } from '../entity/Place';

describe('Image Repository', function() {
    beforeAll(async () => {
        await createConnection({
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
            entities: [Tag, Image, Place, Person, Folder]
        });
    });

    it('can save and load entities', async () => {
        const image = new Image();
        image.name = 'Test';
        image.originalName = 'orig';
        image.suffix = 'jpg';
        await getManager().save(image);

        const count = await getManager().getRepository(Image).count();
        expect(count).toBe(1);

        const readImage: Image = await getManager().getRepository(Image).findOne();
        expect(readImage.name).toBe('Test');
        expect(readImage.originalName).toBe('orig');
        expect(readImage.suffix).toBe('jpg');
    });
});