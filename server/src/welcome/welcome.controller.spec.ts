import { Test } from '@nestjs/testing';
import { WelcomeController } from './welcome.controller';
import { WelcomeService } from './welcome.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from '../entity/Folder';
import { Tag } from '../entity/Tag';
import { Place } from '../entity/Place';
import { Person } from '../entity/Person';
import { Image } from '../entity/Image';
import { ConfigModule } from '../config/config.module';
import { Connection, EntityManager } from 'typeorm';

describe('WelcomeController', () => {
    let connection: Connection;
    let manager: EntityManager;
    let welcomeController: WelcomeController;

    beforeAll(async () => {
        const module = await Test.createTestingModule({ // TODO: move to own file
            imports: [
                ConfigModule.forRoot({ // TODO: move to own file
                    appHomeDirPath: '.',
                    electronAppPath: '.'
                }),
                TypeOrmModule.forRoot({ // TODO: move to own file
                    type: 'sqlite',
                    database: ':memory:',
                    synchronize: true,
                    entities: [Tag, Image, Place, Person, Folder]
                }),
                TypeOrmModule.forFeature([Folder])
            ],
            controllers: [WelcomeController],
            providers: [WelcomeService]
        }).compile();

        welcomeController = module.get<WelcomeController>(WelcomeController);
        connection = module.get<Connection>(Connection);
        manager = module.get<EntityManager>(EntityManager);

        await manager.save(manager.create(Folder, { name: 'C:' }));
    });

    afterAll(async () => {
        await connection.close(); // TODO: move to own file
    });

    describe('findAllFolders', () => {
        it('should return an array of folders', async () => {
            // const result = [];
            // jest.spyOn(welcomeService, 'findAllFolders').mockImplementation(() => [1]);
            const result = await welcomeController.test();

            expect(result.length).toBe(1);
            expect(result[0]).toBeDefined();
            expect(result[0].id).toBeGreaterThanOrEqual(1);
            expect(result[0].name).toBe('C:');
            expect(typeof result[0].dateAdded).toBe('object');
            expect(result[0].children).toBeUndefined();
            expect(result[0].parent).toBeUndefined();
        });
    });
});
