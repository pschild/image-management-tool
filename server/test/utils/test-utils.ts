import { Tag } from '../../src/entity/Tag';
import { Image } from '../../src/entity/Image';
import { Place } from '../../src/entity/Place';
import { Person } from '../../src/entity/Person';
import { Folder } from '../../src/entity/Folder';
import { IAppConfig } from '../../src/config/IAppConfig';
import { ConnectionOptions, getRepository } from 'typeorm';
import { ConfigModule } from '../../src/config/config.module';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Type, Provider } from '@nestjs/common';

const defaultConnectionOptions: ConnectionOptions = {
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    entities: [Tag, Image, Place, Person, Folder]
};

const defaultConfigOptions: IAppConfig = {
    appHomeDirPath: '.',
    electronAppPath: '.'
};

export const createTestModule = async (moduleConfig: { controllers?: Type<any>[], providers?: Provider[] }) => {
    return await Test.createTestingModule({
        imports: [
            ConfigModule.forRoot(defaultConfigOptions),
            TypeOrmModule.forRoot(defaultConnectionOptions),
            TypeOrmModule.forFeature([Folder, Image])
        ],
        controllers: moduleConfig.controllers,
        providers: moduleConfig.providers
    }).compile();
};

export const createTestData = async () => {
    const folderRepo = getRepository(Folder);
    await folderRepo.save(folderRepo.create({ name: 'C:' }));
};
