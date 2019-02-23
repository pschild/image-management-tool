import { Tag } from '../../src/entity/tag.entity';
import { Image } from '../../src/entity/image.entity';
import { Place } from '../../src/entity/place.entity';
import { Person } from '../../src/entity/person.entity';
import { Folder } from '../../src/entity/folder.entity';
import { IAppConfig } from '../../src/config/IAppConfig';
import { ConnectionOptions, getRepository, getManager } from 'typeorm';
import { ConfigModule } from '../../src/config/config.module';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Type, Provider } from '@nestjs/common';
import { FactoryModule } from '../../src/factory/factory.module';

const defaultConnectionOptions: ConnectionOptions = {
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    entities: [Tag, Image, Place, Person, Folder]
};

const defaultConfigOptions: IAppConfig = {
    appHomeDirPath: '.',
    appRootPath: '.'
};

export const createTestModule = async (moduleConfig: { controllers?: Type<any>[], providers?: Provider[] }) => {
    return await Test.createTestingModule({
        imports: [
            ConfigModule.forRoot(defaultConfigOptions),
            TypeOrmModule.forRoot(defaultConnectionOptions),
            TypeOrmModule.forFeature([Folder, Image]),
            FactoryModule
        ],
        controllers: moduleConfig.controllers,
        providers: moduleConfig.providers
    }).compile();
};

const resetDatabase = async () => {
    await getRepository(Folder).query(`DELETE FROM folder;`);
    await getManager().query(`DELETE FROM SQLITE_SEQUENCE WHERE name='folder';`);
    await getRepository(Image).query(`DELETE FROM image;`);
    await getManager().query(`DELETE FROM SQLITE_SEQUENCE WHERE name='image';`);
};

export const createTestData = async () => {
    await resetDatabase();

    /**
     * Create the following structure:
     *
     * ROOT
     *  |- C:       [dummy-image-1.jpg]
     *  |--- F1     [dummy-image-2.PNG, dummy-image-3.gif]
     *  |--- F2     [dummy-image-4.jpeg, dummy-image-5.TIFF]
     *  |------ F3  [dummy-image-6.jpg, dummy-image-7.png]
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
    // tslint:disable:max-line-length
    const i1 = await imageRepo.save(imageRepo.create({ name: 'dummy-image-1', originalName: 'orig-image-1', extension: 'jpg', parentFolder: c }));
    const i2 = await imageRepo.save(imageRepo.create({ name: 'dummy-image-2', originalName: 'orig-image-2', extension: 'PNG', parentFolder: f1 }));
    const i3 = await imageRepo.save(imageRepo.create({ name: 'dummy-image-3', originalName: 'orig-image-3', extension: 'gif', parentFolder: f1 }));
    const i4 = await imageRepo.save(imageRepo.create({ name: 'dummy-image-4', originalName: 'orig-image-4', extension: 'jpeg', parentFolder: f2 }));
    const i5 = await imageRepo.save(imageRepo.create({ name: 'dummy-image-5', originalName: 'orig-image-5', extension: 'TIFF', parentFolder: f2 }));
    const i6 = await imageRepo.save(imageRepo.create({ name: 'dummy-image-6', originalName: 'orig-image-6', extension: 'jpg', parentFolder: f3 }));
    const i7 = await imageRepo.save(imageRepo.create({ name: 'dummy-image-7', originalName: 'orig-image-7', extension: 'png', parentFolder: f3 }));
};
