import { WelcomeController } from './welcome.controller';
import { WelcomeService } from './welcome.service';
import { Connection } from 'typeorm';
import { createTestModule, createTestData } from '../../test/utils/test-utils';
import 'jest-extended';
import { Folder } from '../entity/folder.entity';

describe('WelcomeController', () => {
    let connection: Connection;
    let welcomeController: WelcomeController;
    let welcomeService: WelcomeService;

    beforeAll(async () => {
        const module = await createTestModule({
            controllers: [WelcomeController],
            providers: [WelcomeService]
        });
        connection = module.get<Connection>(Connection);
        welcomeController = module.get<WelcomeController>(WelcomeController);
        welcomeService = module.get<WelcomeService>(WelcomeService);

        await createTestData();
    });

    beforeEach(async () => {
        await createTestData();
    });

    afterAll(async () => {
        await connection.close();
    });

    describe('findAllFolders', () => {
        it('should return an array of folders', async () => {
            jest.spyOn(welcomeService, 'findAllFolders').mockImplementation(() => [new Folder()]);
            const result = await welcomeController.test();

            expect(result).toBeDefined();
            expect(result).toBeArrayOfSize(1);
        });
    });
});
