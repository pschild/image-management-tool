import { IPlaceEntity } from './IPlaceEntity';
import { ITagEntity } from './ITagEntity';
import { IPersonEntity } from './IPersonEntity';
import { Folder } from '../entity/folder.entity';

export interface IImageEntity {
    id: number;
    name: string;
    extension: string;
    originalName: string;
    description: string;
    parentFolder: Folder;
    dateAdded: Date;
    dateFrom: Date;
    dateTo: Date;
    place: IPlaceEntity;
    tags: ITagEntity[];
    persons: IPersonEntity[];
}
