import { Connection, UpdateResult } from 'typeorm';
import { createTestModule, createTestData } from '../../test/utils/test-utils';
import { ImageService } from './image.service';
import 'jest-extended';

describe('ImageService', () => {
    let connection: Connection;
    let imageService: ImageService;

    beforeAll(async () => {
        const module = await createTestModule({
            providers: [ImageService]
        });
        connection = module.get<Connection>(Connection);
        imageService = module.get<ImageService>(ImageService);

        await createTestData();
    });

    afterAll(async () => {
        await connection.close();
    });

    describe('create', () => {
        it('should save an image', async () => {
            const result = await imageService.create({
                name: 'dummy-image-6',
                originalName: 'orig-image-6',
                extension: 'png'
            });

            expect(result).toBeDefined();
            expect(result.id).toBe(6);
            expect(result.name).toBe('dummy-image-6');
            expect(result.originalName).toBe('orig-image-6');
            expect(result.extension).toBe('png');
            expect(result.description).toBeNull();
            expect(result.dateAdded).toBeValidDate();
        });
    });

    describe('findOne', () => {
        it('should find image by id', async () => {
            const result = await imageService.findOne(6);

            expect(result).toBeDefined();
            expect(result.id).toBe(6);
            expect(result.name).toBe('dummy-image-6');
            expect(result.originalName).toBe('orig-image-6');
            expect(result.extension).toBe('png');
            expect(result.description).toBeNull();
            expect(result.dateAdded).toBeValidDate();
        });
    });

    describe('findAll', () => {
        it('should find all images', async () => {
            const result = await imageService.findAll();

            expect(result).toBeDefined();
            expect(result).toBeArrayOfSize(6);
        });
    });

    describe('findAllByFolderId', () => {
        it('should find all images of folder', async () => {
            const result = await imageService.findAllByFolderId(2); // f1

            expect(result).toBeDefined();
            expect(result).toBeArrayOfSize(2);
            expect(result[0].parentFolder).toBeDefined();
            expect(result[0].parentFolder.name).toBe('F1');
            expect(result.map(image => image.name)).toEqual(['dummy-image-2', 'dummy-image-3']);
        });
    });

    describe('update', () => {
        it('should update an image', async () => {
            const result = await imageService.update(6, {
                name: 'dummy-image-6-new',
                description: 'description-image-6'
            });

            expect(result).toBeDefined();
            expect(result instanceof UpdateResult).toBeTrue();

            const loadedImage = await imageService.findOne(6);
            expect(loadedImage).toBeDefined();
            expect(loadedImage.id).toBe(6);
            expect(loadedImage.name).toBe('dummy-image-6-new');
            expect(loadedImage.originalName).toBe('orig-image-6');
            expect(loadedImage.extension).toBe('png');
            expect(loadedImage.description).toBe('description-image-6');
            expect(loadedImage.dateAdded).toBeValidDate();
        });
    });

    describe('remove', () => {
        it('should remove an image', async () => {
            const result = await imageService.remove(6);
            expect(result).toBeDefined();

            const loadedImage = await imageService.findOne(6);
            expect(loadedImage).toBeUndefined();
        });
    });
});
