import 'jest-extended';
import { Connection, UpdateResult } from 'typeorm';
import { createTestModule, createTestData } from '../../test/utils/test-utils';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';
import { Folder } from '../entity/Folder';
import { PathHelperService } from '../util/pathHelper.service';

describe('FolderController', () => {
    let connection: Connection;
    let folderController: FolderController;
    let folderService: FolderService;

    beforeAll(async () => {
        const module = await createTestModule({
            controllers: [FolderController],
            providers: [FolderService, PathHelperService]
        });
        connection = module.get<Connection>(Connection);
        folderController = module.get<FolderController>(FolderController);
        folderService = module.get<FolderService>(FolderService);

        await createTestData();
    });

    afterAll(async () => {
        await connection.close();
    });

    describe('create', () => {
        it('should return a folder', async () => {
            jest.spyOn(folderService, 'create').mockImplementation(() => new Folder());
            const result = await folderController.create({ foo: 'bar' });

            expect(result).toBeDefined();
            expect(result instanceof Folder).toBeTrue();
        });
    });

    describe('findAll', () => {
        it('should return an array of folders', async () => {
            jest.spyOn(folderService, 'findAll').mockImplementation(() => [new Folder(), new Folder()]);
            const result = await folderController.findAll();

            expect(result).toBeDefined();
            expect(result).toBeArrayOfSize(2);
            expect(result[0] instanceof Folder).toBeTrue();
            expect(result[1] instanceof Folder).toBeTrue();
        });
    });

    describe('findOne', () => {
        it('should return a folder', async () => {
            jest.spyOn(folderService, 'findOne').mockImplementation(() => new Folder());
            const result = await folderController.findOne(42);

            expect(result).toBeDefined();
            expect(result instanceof Folder).toBeTrue();
        });
    });

    describe('update', () => {
        it('should return an UpdateResult', async () => {
            jest.spyOn(folderService, 'update').mockImplementation(() => new UpdateResult());
            const result = await folderController.update(42, { foo: 'bar' });

            expect(result).toBeDefined();
            expect(result instanceof UpdateResult).toBeTrue();
        });
    });

    describe('remove', () => {
        it('should return an image', async () => {
            jest.spyOn(folderService, 'remove').mockImplementation(() => new Folder());
            const result = await folderController.remove(42);

            expect(result).toBeDefined();
            expect(result instanceof Folder).toBeTrue();
        });
    });
});
