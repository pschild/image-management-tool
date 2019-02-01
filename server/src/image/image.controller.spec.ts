import { Connection, UpdateResult } from 'typeorm';
import { createTestModule, createTestData } from '../../test/utils/test-utils';
import 'jest-extended';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { ImageEntityToDtoMapper } from '../mapper/ImageEntityToDto.mapper';
import { FolderService } from '../folder/folder.service';
import { PathHelperService } from '../util/path-helper/path-helper.service';
import { IImageEntityDto } from '../../../shared/dto/IImageEntity.dto';
import { IFolderEntityDto } from '../../../shared/dto/IFolderEntity.dto';
import { FolderEntityToDtoMapper } from '../mapper/FolderEntityToDto.mapper';
import { PersonEntityToDtoMapper } from '../mapper/PersonEntityToDto.mapper';
import { PlaceEntityToDtoMapper } from '../mapper/PlaceEntityToDto.mapper';
import { TagEntityToDtoMapper } from '../mapper/TagEntityToDto.mapper';

describe('ImageController', () => {
    let connection: Connection;
    let imageController: ImageController;
    let imageService: ImageService;

    let dummyImage: IImageEntityDto;

    beforeAll(async () => {
        const module = await createTestModule({
            controllers: [ImageController],
            providers: [
                ImageService,
                FolderService,
                PathHelperService,
                ImageEntityToDtoMapper,
                FolderEntityToDtoMapper,
                PersonEntityToDtoMapper,
                PlaceEntityToDtoMapper,
                TagEntityToDtoMapper
            ]
        });
        connection = module.get<Connection>(Connection);
        imageController = module.get<ImageController>(ImageController);
        imageService = module.get<ImageService>(ImageService);

        dummyImage = {
            id: 42,
            name: 'dummy',
            extension: 'jpg',
            absolutePath: 'C:\\foo\\bar\\dummy.jpg',
            parentFolder: {
                id: 43,
                name: 'bar',
                absolutePath: 'C:\\foo\\bar'
            } as IFolderEntityDto
        };
    });

    beforeEach(async () => {
        await createTestData();
    });

    afterAll(async () => {
        await connection.close();
    });

    describe('create', () => {
        it('should return an image', async () => {
            jest.spyOn(imageService, 'create').mockImplementation(() => dummyImage);
            const result = await imageController.create({ foo: 'bar' });

            expect(result).toBeDefined();
            expect(result).toContainKeys(['id', 'name', 'extension', 'absolutePath']);
        });
    });

    describe('createByPath', () => {
        it('should return an image', async () => {
            jest.spyOn(imageService, 'create').mockImplementation(() => dummyImage);
            const result = await imageController.createByPath({
                absolutePath: 'C:\\foo\\bar\\dummy.jpg',
                name: 'dummy',
                extension: 'jpg'
            });

            expect(result).toBeDefined();
            expect(result).toContainKeys(['id', 'name', 'extension', 'absolutePath']);
        });
    });

    describe('findAll', () => {
        it('should return an array of images', async () => {
            jest.spyOn(imageService, 'findAll').mockImplementation(() => [dummyImage, dummyImage]);
            const result = await imageController.findAll();

            expect(result).toBeDefined();
            expect(result).toBeArrayOfSize(2);
            expect(result[0]).toContainKeys(['id', 'name', 'extension', 'absolutePath']);
            expect(result[1]).toContainKeys(['id', 'name', 'extension', 'absolutePath']);
        });
    });

    describe('findOne', () => {
        it('should return an image', async () => {
            jest.spyOn(imageService, 'findOne').mockImplementation(() => dummyImage);
            const result = await imageController.findOne(42);

            expect(result).toBeDefined();
            expect(result).toContainKeys(['id', 'name', 'extension', 'absolutePath']);
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
            jest.spyOn(imageService, 'remove').mockImplementation(() => dummyImage);
            const result = await imageController.remove(42);

            expect(result).toBeUndefined();
        });
    });
});
