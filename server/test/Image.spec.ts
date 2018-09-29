import 'reflect-metadata';
import { createConnection, getManager, getConnection } from 'typeorm';
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
    });

    afterAll(async () => {
        await getConnection().close();
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
