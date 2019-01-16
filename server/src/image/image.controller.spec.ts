import { Connection, UpdateResult } from 'typeorm';
import { createTestModule, createTestData } from '../../test/utils/test-utils';
import 'jest-extended';
import { Image } from '../entity/Image';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

describe('ImageController', () => {
    let connection: Connection;
    let imageController: ImageController;
    let imageService: ImageService;

    beforeAll(async () => {
        const module = await createTestModule({
            controllers: [ImageController],
            providers: [ImageService]
        });
        connection = module.get<Connection>(Connection);
        imageController = module.get<ImageController>(ImageController);
        imageService = module.get<ImageService>(ImageService);

        await createTestData();
    });

    afterAll(async () => {
        await connection.close();
    });

    describe('create', () => {
        it('should return an image', async () => {
            jest.spyOn(imageService, 'create').mockImplementation(() => new Image());
            const result = await imageController.create({ foo: 'bar' });

            expect(result).toBeDefined();
            expect(result instanceof Image).toBeTrue();
        });
    });

    describe('findAll', () => {
        it('should return an array of images', async () => {
            jest.spyOn(imageService, 'findAll').mockImplementation(() => [new Image(), new Image()]);
            const result = await imageController.findAll();

            expect(result).toBeDefined();
            expect(result).toBeArrayOfSize(2);
            expect(result[0] instanceof Image).toBeTrue();
            expect(result[1] instanceof Image).toBeTrue();
        });
    });

    describe('findOne', () => {
        it('should return an image', async () => {
            jest.spyOn(imageService, 'findOne').mockImplementation(() => new Image());
            const result = await imageController.findOne(42);

            expect(result).toBeDefined();
            expect(result instanceof Image).toBeTrue();
        });
    });

    describe('update', () => {
        it('should return an UpdateResult', async () => {
            jest.spyOn(imageService, 'update').mockImplementation(() => new UpdateResult());
            const result = await imageController.update(42, { foo: 'bar' });

            expect(result).toBeDefined();
            expect(result instanceof UpdateResult).toBeTrue();
        });
    });

    describe('remove', () => {
        it('should return an image', async () => {
            jest.spyOn(imageService, 'remove').mockImplementation(() => new Image());
            const result = await imageController.remove(42);

            expect(result).toBeDefined();
            expect(result instanceof Image).toBeTrue();
        });
    });
});
