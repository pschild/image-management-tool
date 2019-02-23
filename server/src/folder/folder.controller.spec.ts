import 'jest-extended';
import { Connection, UpdateResult } from 'typeorm';
import { createTestModule, createTestData } from '../../test/utils/test-utils';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';
import { PathHelperService } from '../util/path-helper/path-helper.service';
import { FolderDto } from '../dto/Folder.dto';
import { FolderDtoFactory } from '../factory/folder-dto.factory';

describe('FolderController', () => {
    let connection: Connection;
    let folderController: FolderController;
    let folderService: FolderService;

    let dummyFolder: FolderDto;

    beforeAll(async () => {
        const module = await createTestModule({
            controllers: [FolderController],
            providers: [
                FolderService,
                PathHelperService
            ]
        });
        connection = module.get<Connection>(Connection);
        folderController = module.get<FolderController>(FolderController);
        folderService = module.get<FolderService>(FolderService);

        // call the lifecycle-hook manually
        module.get<FolderDtoFactory>(FolderDtoFactory).onModuleInit();

        dummyFolder = new FolderDto();
        dummyFolder.id = 43;
        dummyFolder.name = 'bar';
        dummyFolder.absolutePath = 'C:\\foo\\bar';
    });

    beforeEach(async () => {
        await createTestData();
    });

    afterAll(async () => {
        await connection.close();
    });

    describe('create', () => {
        it('should return a folder', async () => {
            jest.spyOn(folderService, 'create').mockImplementation(() => dummyFolder);
            const result = await folderController.create({ foo: 'bar' });

            expect(result).toBeDefined();
            expect(result).toContainKeys(['id', 'name', 'absolutePath']);
        });
    });

    describe('createByPath', () => {
        it('should return a folder', async () => {
            jest.spyOn(folderService, 'createFolderByPath').mockImplementation(() => dummyFolder);
            const result: FolderDto = await folderController.createByPath({ path: 'some/path' });

            expect(result).toBeDefined();
            expect(result).toContainKeys(['id', 'name', 'absolutePath']);
        });
    });

    describe('findAll', () => {
        it('should return an array of folders', async () => {
            jest.spyOn(folderService, 'findAll').mockImplementation(() => [dummyFolder, dummyFolder]);
            const result = await folderController.findAll();

            expect(result).toBeDefined();
            expect(result).toBeArrayOfSize(2);
            expect(result[0]).toContainKeys(['id', 'name', 'absolutePath']);
            expect(result[1]).toContainKeys(['id', 'name', 'absolutePath']);
        });
    });

    describe('findOne', () => {
        it('should return a folder', async () => {
            jest.spyOn(folderService, 'findOne').mockImplementation(() => dummyFolder);
            const result = await folderController.findOne(42);

            expect(result).toBeDefined();
            expect(result).toContainKeys(['id', 'name', 'absolutePath']);
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
        it('should return a folder', async () => {
            jest.spyOn(folderService, 'remove').mockImplementation(() => dummyFolder);
            const result = await folderController.remove(42);

            expect(result).toBeUndefined();
        });
    });
});
