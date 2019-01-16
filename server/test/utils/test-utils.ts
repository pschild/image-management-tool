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
    /**
     * Create the following structure:
     *
     * ROOT
     *  |- C:       [i1]
     *  |--- F1     [i2, i3]
     *  |--- F2
     *  |------ F3  [i4, i5]
     *  |- D:
     *  |--- F4
     *  |------ F5
     *  |--------- F6
     */
    const folderRepo = getRepository(Folder);
    const c = await folderRepo.save(folderRepo.create({ name: 'C:' }));
    const f1 = await folderRepo.save(folderRepo.create({ name: 'F1', parent: c }));
    const f2 = await folderRepo.save(folderRepo.create({ name: 'F2', parent: c }));
    const f3 = await folderRepo.save(folderRepo.create({ name: 'F3', parent: f2 }));
    const d = await folderRepo.save(folderRepo.create({ name: 'D:' }));
    const f4 = await folderRepo.save(folderRepo.create({ name: 'F4', parent: d }));
    const f5 = await folderRepo.save(folderRepo.create({ name: 'F5', parent: f4 }));
    const f6 = await folderRepo.save(folderRepo.create({ name: 'F6', parent: f5 }));

    const imageRepo = getRepository(Image);
    const i1 = await imageRepo.save(imageRepo.create({ name: 'dummy-image-1', originalName: 'orig-image-1', extension: 'jpg', parentFolder: c }));
    const i2 = await imageRepo.save(imageRepo.create({ name: 'dummy-image-2', originalName: 'orig-image-2', extension: 'PNG', parentFolder: f1 }));
    const i3 = await imageRepo.save(imageRepo.create({ name: 'dummy-image-3', originalName: 'orig-image-3', extension: 'gif', parentFolder: f1 }));
    const i4 = await imageRepo.save(imageRepo.create({ name: 'dummy-image-4', originalName: 'orig-image-4', extension: 'jpeg', parentFolder: f3 }));
    const i5 = await imageRepo.save(imageRepo.create({ name: 'dummy-image-5', originalName: 'orig-image-5', extension: 'TIFF', parentFolder: f3 }));
};
