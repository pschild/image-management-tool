import { Test } from '@nestjs/testing';
import { WelcomeService } from './welcome.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from '../entity/Folder';
import { Tag } from '../entity/Tag';
import { Place } from '../entity/Place';
import { Person } from '../entity/Person';
import { Image } from '../entity/Image';
import { ConfigModule } from '../config/config.module';
import { Connection } from 'typeorm';

describe('WelcomeService', () => {
    let connection: Connection;
    let welcomeService: WelcomeService;

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
            providers: [WelcomeService]
        }).compile();

        connection = module.get<Connection>(Connection);
        welcomeService = module.get<WelcomeService>(WelcomeService);
    });

    afterAll(async () => {
        await connection.close(); // TODO: move to own file
    });

    describe('generateGreeting', () => {
        it('should generate greeting', async () => {
            expect(welcomeService.generateGreeting('John Doe')).toEqual({greets: 'Hello, John Doe'});
        });
    });

    describe('findAllFolders', () => {
        it('should find all folders', async () => {
            expect(await welcomeService.findAllFolders()).toEqual([]);
        });
    });
});
