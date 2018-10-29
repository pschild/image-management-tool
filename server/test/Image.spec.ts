import 'reflect-metadata';
import { getManager } from 'typeorm';
import { Image } from '../src/entity/Image';
import { setupTestConnection, closeTestConnection } from './utils/test-utils';

describe('Image Repository', function() {
    beforeAll(async () => {
        await setupTestConnection();
    });

    afterAll(async () => {
        await closeTestConnection();
    });

    it('can save and load entities', async () => {
        const image = new Image();
        image.name = 'Test';
        image.originalName = 'orig';
        image.extension = 'jpg';
        await getManager().save(image);

        const count = await getManager().getRepository(Image).count();
        expect(count).toBe(1);

        const readImage: Image = await getManager().getRepository(Image).findOne();
        expect(readImage.name).toBe('Test');
        expect(readImage.originalName).toBe('orig');
        expect(readImage.extension).toBe('jpg');
    });
});
