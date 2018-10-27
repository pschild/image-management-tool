import 'reflect-metadata';
import { getManager, getConnection, getRepository } from 'typeorm';
import { Image } from '../src/entity/Image';
import { setupTestConnection, closeTestConnection } from './utils/test-utils';
import { Tag } from '../src/entity/Tag';
import { Place } from '../src/entity/Place';
import { Folder } from '../src/entity/Folder';
import { Person } from '../src/entity/Person';

describe('Relations', function() {
    beforeAll(async () => {
        await setupTestConnection();
    });

    beforeEach(async () => {
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(Folder)
            .execute();

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

    it('of folders and images are handled correctly', async () => {
        const folderRepository = getManager().getRepository(Folder);
        const imageRepository = getManager().getRepository(Image);

        let f1 = new Folder();
        f1.name = 'F1';
        await getManager().save(f1);

        let f2 = new Folder();
        f2.name = 'F2';
        f2.parent = f1;
        await getManager().save(f2);

        let i1 = new Image();
        i1.name = 'Test 1';
        i1.originalName = 'orig 1';
        i1.suffix = 'jpg';
        i1.parentFolder = f1;
        await getManager().save(i1);

        let i2 = new Image();
        i2.name = 'Test 2';
        i2.originalName = 'orig 2';
        i2.suffix = 'jpg';
        i2.parentFolder = f2;
        await getManager().save(i2);

        const folderToDelete = await folderRepository.findOne({ name: 'F1' });
        await folderRepository.remove(folderToDelete);

        f1 = await folderRepository.findOne({ name: 'F1' });
        f2 = await folderRepository.findOne({ name: 'F2' });
        i1 = await imageRepository.findOne({ name: 'Test 1' });
        i2 = await imageRepository.findOne({ name: 'Test 2' });

        expect(f1).toBeUndefined();
        expect(f2).toBeUndefined();
        expect(i1).toBeUndefined();
        expect(i2).toBeUndefined();
    });

    it('of images and tags are handled correctly', async () => {
        const imageRepository = getManager().getRepository(Image);
        const tagRepository = getManager().getRepository(Tag);

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
        loadedImage = await imageRepository.findOne({ name: 'Test' }, { relations: ['tags'] });
        expect(loadedImage.tags).toBeDefined();
        expect(loadedImage.tags.length).toBe(1);
        expect(loadedImage.tags[0].label).toBe('Tag1');

        // ensure image is set on tag1
        loadedTag = await tagRepository.findOne({ label: 'Tag1' }, { relations: ['images'] });
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
        loadedImage = await imageRepository.findOne({ name: 'Test' }, { relations: ['tags'] });
        expect(loadedImage.tags).toBeDefined();
        expect(loadedImage.tags.length).toBe(2);
        expect(loadedImage.tags[1].label).toBe('Tag2');

        // ensure image is set on tag2
        loadedTag = await tagRepository.findOne({ label: 'Tag2' }, { relations: ['images'] });
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
        loadedImage = await imageRepository.findOne({ name: 'Test' }, { relations: ['tags'] });
        expect(loadedImage.tags).toBeDefined();
        expect(loadedImage.tags.length).toBe(1);
        expect(loadedImage.tags[0].label).toBe('Tag2');

        // delete tag2 from database
        await getManager().remove(tag2);

        const searchRemovedTag = await tagRepository.findOne({ label: 'Tag2' });
        expect(searchRemovedTag).toBeUndefined();

        // tag2 should also be removed from image
        loadedImage = await imageRepository.findOne({ name: 'Test' }, { relations: ['tags'] });
        expect(loadedImage).toBeDefined();
        expect(loadedImage.tags).toBeDefined();
        expect(loadedImage.tags.length).toBe(0);

        // create tag3
        const tag3 = new Tag();
        tag3.label = 'Tag3';
        tag3.images = [loadedImage];
        await getManager().save(tag3);

        // ensure tag3 is set on image
        loadedImage = await imageRepository.findOne({ name: 'Test' }, { relations: ['tags'] });
        expect(loadedImage.tags).toBeDefined();
        expect(loadedImage.tags.length).toBe(1);
        expect(loadedImage.tags[0].label).toBe('Tag3');

        // ensure image is set on tag3
        loadedTag = await tagRepository.findOne({ label: 'Tag3' }, { relations: ['images'] });
        expect(loadedTag.images).toBeDefined();
        expect(loadedTag.images.length).toBe(1);
        expect(loadedTag.images[0].name).toBe('Test');

        // remove image
        const imageToDelete = await imageRepository.findOne({ name: 'Test' });
        await imageRepository.remove(imageToDelete);

        // ensure that Tag1 and Tag3 are still saved
        const t1 = await tagRepository.findOne({ label: 'Tag1' });
        const t3 = await tagRepository.findOne({ label: 'Tag3' });
        expect(t1).toBeDefined();
        expect(t3).toBeDefined();
    });

    it('of images and places are handled correctly', async () => {
        const imageRepository = getManager().getRepository(Image);
        const placeRepository = getManager().getRepository(Place);

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
        loadedImage = await imageRepository.findOne({ name: 'Test' }, { relations: ['place'] });
        expect(loadedImage.place).toBeDefined();
        expect(loadedImage.place.name).toBe('Ort1');

        // ensure image is set on place1
        loadedPlace = await placeRepository.findOne({ name: 'Ort1' }, { relations: ['images'] });
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
        loadedImage = await imageRepository.findOne({ name: 'Test' }, { relations: ['place'] });
        expect(loadedImage.place).toBeDefined();
        expect(loadedImage.place.name).toBe('Ort2');

        // ensure image is set on place2
        loadedPlace = await placeRepository.findOne({ name: 'Ort2' }, { relations: ['images'] });
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
        loadedImage = await imageRepository.findOne({ name: 'Test' }, { relations: ['place'] });
        expect(loadedImage.place).toBe(null);

        // update the image by setting place2
        await getConnection()
            .createQueryBuilder()
            .relation(Image, 'place')
            .of(loadedImage)
            .set(place2);

        // delete place2 from database
        await getManager().remove(place2); // only works when onDelete property is set on entity!

        const searchRemovedPlace = await placeRepository.findOne({ name: 'Ort2' });
        expect(searchRemovedPlace).toBeUndefined();

        // place2 should also be removed from image
        loadedImage = await imageRepository.findOne({ name: 'Test' }, { relations: ['place'] });
        expect(loadedImage).toBeDefined();
        expect(loadedImage.place).toBe(null);

        // create place3
        const place3 = new Place();
        place3.name = 'Ort3';
        place3.images = [loadedImage];
        await getManager().save(place3);

        // ensure place3 is set on image
        loadedImage = await imageRepository.findOne({ name: 'Test' }, { relations: ['place'] });
        expect(loadedImage.place).toBeDefined();
        expect(loadedImage.place.name).toBe('Ort3');

        // ensure image is set on place3
        loadedPlace = await placeRepository.findOne({ name: 'Ort3' }, { relations: ['images'] });
        expect(loadedPlace.images).toBeDefined();
        expect(loadedPlace.images.length).toBe(1);
        expect(loadedPlace.images[0].name).toBe('Test');

        // remove image
        const imageToDelete = await imageRepository.findOne({ name: 'Test' });
        await imageRepository.remove(imageToDelete);

        // ensure that Ort1 and Ort3 are still saved
        const p1 = await placeRepository.findOne({ name: 'Ort1' });
        const p3 = await placeRepository.findOne({ name: 'Ort3' });
        expect(p1).toBeDefined();
        expect(p3).toBeDefined();
    });

    it('of images and persons are handled correctly', async () => {
        const imageRepository = getManager().getRepository(Image);
        const personRepository = getManager().getRepository(Person);

        let loadedImage, loadedPerson;

        // create person1
        const person1 = new Person();
        person1.firstname = 'Person1';
        await getManager().save(person1);

        // create a new image and add person1
        const image = new Image();
        image.name = 'Test';
        image.originalName = 'orig';
        image.suffix = 'jpg';
        image.persons = [person1];
        await getManager().save(image);

        // ensure person1 is set on image
        loadedImage = await imageRepository.findOne({ name: 'Test' }, { relations: ['persons'] });
        expect(loadedImage.persons).toBeDefined();
        expect(loadedImage.persons.length).toBe(1);
        expect(loadedImage.persons[0].firstname).toBe('Person1');

        // ensure image is set on person1
        loadedPerson = await personRepository.findOne({ firstname: 'Person1' }, { relations: ['images'] });
        expect(loadedPerson.images).toBeDefined();
        expect(loadedPerson.images.length).toBe(1);
        expect(loadedPerson.images[0].name).toBe('Test');

        // create person2
        const person2 = new Person();
        person2.firstname = 'Person2';
        await getManager().save(person2);

        // update the image by adding person2
        await getConnection()
            .createQueryBuilder()
            .relation(Image, 'persons')
            .of(loadedImage)
            .add(person2);

        // ensure person2 is set on image
        loadedImage = await imageRepository.findOne({ name: 'Test' }, { relations: ['persons'] });
        expect(loadedImage.persons).toBeDefined();
        expect(loadedImage.persons.length).toBe(2);
        expect(loadedImage.persons[1].firstname).toBe('Person2');

        // ensure image is set on person2
        loadedPerson = await personRepository.findOne({ firstname: 'Person2' }, { relations: ['images'] });
        expect(loadedPerson.images).toBeDefined();
        expect(loadedPerson.images.length).toBe(1);
        expect(loadedPerson.images[0].name).toBe('Test');

        // remove person1 from image
        await getConnection()
            .createQueryBuilder()
            .relation(Image, 'persons')
            .of(loadedImage) // or 1
            .remove(person1); // or 1

        // only person2 should be available for the image
        loadedImage = await imageRepository.findOne({ name: 'Test' }, { relations: ['persons'] });
        expect(loadedImage.persons).toBeDefined();
        expect(loadedImage.persons.length).toBe(1);
        expect(loadedImage.persons[0].firstname).toBe('Person2');

        // delete person2 from database
        await getManager().remove(person2);

        const searchRemovedPerson = await personRepository.findOne({ firstname: 'Person2' });
        expect(searchRemovedPerson).toBeUndefined();

        // person2 should also be removed from image
        loadedImage = await imageRepository.findOne({ name: 'Test' }, { relations: ['persons'] });
        expect(loadedImage).toBeDefined();
        expect(loadedImage.persons).toBeDefined();
        expect(loadedImage.persons.length).toBe(0);

        // create person3
        const person3 = new Person();
        person3.firstname = 'Person3';
        person3.images = [loadedImage];
        await getManager().save(person3);

        // ensure person3 is set on image
        loadedImage = await imageRepository.findOne({ name: 'Test' }, { relations: ['persons'] });
        expect(loadedImage.persons).toBeDefined();
        expect(loadedImage.persons.length).toBe(1);
        expect(loadedImage.persons[0].firstname).toBe('Person3');

        // ensure image is set on person3
        loadedPerson = await personRepository.findOne({ firstname: 'Person3' }, { relations: ['images'] });
        expect(loadedPerson.images).toBeDefined();
        expect(loadedPerson.images.length).toBe(1);
        expect(loadedPerson.images[0].name).toBe('Test');

        // remove image
        const imageToDelete = await imageRepository.findOne({ name: 'Test' });
        await imageRepository.remove(imageToDelete);

        // ensure that Person1 and Person3 are still saved
        const p1 = await personRepository.findOne({ firstname: 'Person1' });
        const p3 = await personRepository.findOne({ firstname: 'Person3' });
        expect(p1).toBeDefined();
        expect(p3).toBeDefined();
    });
});
