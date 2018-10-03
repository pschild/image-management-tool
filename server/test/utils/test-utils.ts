import { createConnection, ConnectionOptions, getConnection } from 'typeorm';
import { Tag } from '../../src/entity/Tag';
import { Image } from '../../src/entity/Image';
import { Place } from '../../src/entity/Place';
import { Person } from '../../src/entity/Person';
import { Folder } from '../../src/entity/Folder';

const defaultConnectionOptions: ConnectionOptions = {
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    entities: [Tag, Image, Place, Person, Folder]
};

export const setupTestConnection = async (config = null) => await createConnection(Object.assign(defaultConnectionOptions, config));
export const closeTestConnection = async () => await getConnection().close();
