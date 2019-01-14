import { Test } from '@nestjs/testing';
import { WelcomeService } from './welcome.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from '../entity/Folder';
import { Tag } from '../entity/Tag';
import { Place } from '../entity/Place';
import { Person } from '../entity/Person';
import { Image } from '../entity/Image';
import { ConfigModule } from '../config/config.module';

describe('WelcomeService', () => {
    let welcomeService: WelcomeService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
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

        welcomeService = module.get<WelcomeService>(WelcomeService);
    });

    describe('generateGreeting', () => {
        it('should generate greeting', async () => {
            expect(welcomeService.generateGreeting('asd')).toEqual({greets: 'Hello, asd'});
        });
    });

    /*describe('findAllFolders', () => {
        it('should find all folders', async () => {
            expect(welcomeService.findAllFolders()).toEqual([]);
        });
    });*/
});
