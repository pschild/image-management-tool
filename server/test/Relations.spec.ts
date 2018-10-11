import 'reflect-metadata';
import { getManager, getConnection } from 'typeorm';
import { Image } from '../src/entity/Image';
import { setupTestConnection, closeTestConnection } from './utils/test-utils';
import { Tag } from '../src/entity/Tag';
import { Place } from '../src/entity/Place';

describe('Relations', function() {
    beforeAll(async () => {
        await setupTestConnection();
    });

    beforeEach(async () => {
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(Image)
            .execute();

        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(Tag)
            .execute();

        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(Place)
            .execute();
    });

    afterAll(async () => {
        await closeTestConnection();
    });

    it('of images and tags are handled correctly', async () => {
        let loadedImage, loadedTag;

        // create tag1
        const tag1 = new Tag();
        tag1.label = 'Tag1';
        await getManager().save(tag1);

        // create a new image and add tag1
        const image = new Image();
        image.name = 'Test';
        image.originalName = 'orig';
        image.suffix = 'jpg';
        image.tags = [tag1];
        await getManager().save(image);

        // ensure tag1 is set on image
        loadedImage = await getManager().getRepository(Image).findOne({ name: 'Test' }, { relations: ['tags'] });
        expect(loadedImage.tags).toBeDefined();
        expect(loadedImage.tags.length).toBe(1);
        expect(loadedImage.tags[0].label).toBe('Tag1');

        // ensure image is set on tag1
        loadedTag = await getManager().getRepository(Tag).findOne({ label: 'Tag1' }, { relations: ['images'] });
        expect(loadedTag.images).toBeDefined();
        expect(loadedTag.images.length).toBe(1);
        expect(loadedTag.images[0].name).toBe('Test');

        // create tag2
        const tag2 = new Tag();
        tag2.label = 'Tag2';
        await getManager().save(tag2);

        // update the image by adding tag2
        await getConnection()
            .createQueryBuilder()
            .relation(Image, 'tags')
            .of(loadedImage)
            .add(tag2);

        // ensure tag2 is set on image
        loadedImage = await getManager().getRepository(Image).findOne({ name: 'Test' }, { relations: ['tags'] });
        expect(loadedImage.tags).toBeDefined();
        expect(loadedImage.tags.length).toBe(2);
        expect(loadedImage.tags[1].label).toBe('Tag2');

        // ensure image is set on tag2
        loadedTag = await getManager().getRepository(Tag).findOne({ label: 'Tag2' }, { relations: ['images'] });
        expect(loadedTag.images).toBeDefined();
        expect(loadedTag.images.length).toBe(1);
        expect(loadedTag.images[0].name).toBe('Test');

        // remove tag1 from image
        await getConnection()
            .createQueryBuilder()
            .relation(Image, 'tags')
            .of(loadedImage) // or 1
            .remove(tag1); // or 1

        // only tag2 should be available for the image
        loadedImage = await getManager().getRepository(Image).findOne({ name: 'Test' }, { relations: ['tags'] });
        expect(loadedImage.tags).toBeDefined();
        expect(loadedImage.tags.length).toBe(1);
        expect(loadedImage.tags[0].label).toBe('Tag2');

        // delete tag2 from database
        await getManager().remove(tag2);

        const searchRemovedTag = await getManager().getRepository(Tag).findOne({ label: 'Tag2' });
        expect(searchRemovedTag).toBeUndefined();

        // tag2 should also be removed from image
        loadedImage = await getManager().getRepository(Image).findOne({ name: 'Test' }, { relations: ['tags'] });
        expect(loadedImage).toBeDefined();
        expect(loadedImage.tags).toBeDefined();
        expect(loadedImage.tags.length).toBe(0);

        // create tag3
        const tag3 = new Tag();
        tag3.label = 'Tag3';
        tag3.images = [loadedImage];
        await getManager().save(tag3);

        // ensure tag3 is set on image
        loadedImage = await getManager().getRepository(Image).findOne({ name: 'Test' }, { relations: ['tags'] });
        expect(loadedImage.tags).toBeDefined();
        expect(loadedImage.tags.length).toBe(1);
        expect(loadedImage.tags[0].label).toBe('Tag3');

        // ensure image is set on tag3
        loadedTag = await getManager().getRepository(Tag).findOne({ label: 'Tag3' }, { relations: ['images'] });
        expect(loadedTag.images).toBeDefined();
        expect(loadedTag.images.length).toBe(1);
        expect(loadedTag.images[0].name).toBe('Test');
    });

    it('of images and places are handled correctly', async () => {
        let loadedImage, loadedPlace;

        const place1 = new Place();
        place1.name = 'Ort1';
        await getManager().save(place1);

        // create a new image and add place1
        const image = new Image();
        image.name = 'Test';
        image.originalName = 'orig';
        image.suffix = 'jpg';
        image.place = place1;
        await getManager().save(image);

        // ensure place1 is set on image
        loadedImage = await getManager().getRepository(Image).findOne({ name: 'Test' }, { relations: ['place'] });
        expect(loadedImage.place).toBeDefined();
        expect(loadedImage.place.name).toBe('Ort1');

        // ensure image is set on place1
        loadedPlace = await getManager().getRepository(Place).findOne({ name: 'Ort1' }, { relations: ['images'] });
        expect(loadedPlace.images).toBeDefined();
        expect(loadedPlace.images.length).toBe(1);
        expect(loadedPlace.images[0].name).toBe('Test');

        // create place2
        const place2 = new Place();
        place2.name = 'Ort2';
        await getManager().save(place2);

        // update the image by setting place2
        await getConnection()
            .createQueryBuilder()
            .relation(Image, 'place')
            .of(loadedImage)
            .set(place2);

        // ensure place2 is set on image
        loadedImage = await getManager().getRepository(Image).findOne({ name: 'Test' }, { relations: ['place'] });
        expect(loadedImage.place).toBeDefined();
        expect(loadedImage.place.name).toBe('Ort2');

        // ensure image is set on place2
        loadedPlace = await getManager().getRepository(Place).findOne({ name: 'Ort2' }, { relations: ['images'] });
        expect(loadedPlace.images).toBeDefined();
        expect(loadedPlace.images.length).toBe(1);
        expect(loadedPlace.images[0].name).toBe('Test');

        // remove place2 from image
        await getConnection()
            .createQueryBuilder()
            .relation(Image, 'place')
            .of(loadedImage) // or 1
            .set(null);

        // ensure that no place is set on image
        loadedImage = await getManager().getRepository(Image).findOne({ name: 'Test' }, { relations: ['place'] });
        expect(loadedImage.place).toBe(null);

        // update the image by setting place2
        await getConnection()
            .createQueryBuilder()
            .relation(Image, 'place')
            .of(loadedImage)
            .set(place2);

        // delete place2 from database
        await getManager().remove(place2); // only works when onDelete property is set on entity!

        const searchRemovedPlace = await getManager().getRepository(Place).findOne({ name: 'Ort2' });
        expect(searchRemovedPlace).toBeUndefined();

        // place2 should also be removed from image
        loadedImage = await getManager().getRepository(Image).findOne({ name: 'Test' }, { relations: ['place'] });
        expect(loadedImage).toBeDefined();
        expect(loadedImage.place).toBe(null);

        // create place3
        const place3 = new Place();
        place3.name = 'Ort3';
        place3.images = [loadedImage];
        await getManager().save(place3);

        // ensure place3 is set on image
        loadedImage = await getManager().getRepository(Image).findOne({ name: 'Test' }, { relations: ['place'] });
        expect(loadedImage.place).toBeDefined();
        expect(loadedImage.place.name).toBe('Ort3');

        // ensure image is set on place3
        loadedPlace = await getManager().getRepository(Place).findOne({ name: 'Ort3' }, { relations: ['images'] });
        expect(loadedPlace.images).toBeDefined();
        expect(loadedPlace.images.length).toBe(1);
        expect(loadedPlace.images[0].name).toBe('Test');
    });
});
