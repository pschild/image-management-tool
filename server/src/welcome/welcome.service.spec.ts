import { WelcomeService } from './welcome.service';
import { Connection } from 'typeorm';
import { createTestModule, createTestData } from '../../test/utils/test-utils';
import 'jest-extended';

describe('WelcomeService', () => {
    let connection: Connection;
    let welcomeService: WelcomeService;

    beforeAll(async () => {
        const module = await createTestModule({
            providers: [WelcomeService]
        });
        connection = module.get<Connection>(Connection);
        welcomeService = module.get<WelcomeService>(WelcomeService);

        await createTestData();
    });

    afterAll(async () => {
        await connection.close();
    });

    describe('generateGreeting', () => {
        it('should generate greeting', async () => {
            expect(welcomeService.generateGreeting('John Doe')).toEqual({greets: 'Hello, John Doe'});
        });
    });

    describe('findAllFolders', () => {
        it('should find all folders', async () => {
            const loadedFolders = await welcomeService.findAllFolders();

            expect(loadedFolders).toBeArrayOfSize(8);
            expect(loadedFolders[0].id).toBeGreaterThanOrEqual(1);
            expect(loadedFolders[0].name).toBe('C:');
            expect(loadedFolders[0].dateAdded).toBeValidDate();
            expect(loadedFolders[0].children).toBeUndefined();
            expect(loadedFolders[0].parent).toBeUndefined();
        });
    });
});
