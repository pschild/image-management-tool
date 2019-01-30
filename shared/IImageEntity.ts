import { IFolderEntity } from './IFolderEntity';
import { IPlaceEntity } from './IPlaceEntity';
import { ITagEntity } from './ITagEntity';
import { IPersonEntity } from './IPersonEntity';

export interface IImageEntity {
    id: number;
    name: string;
    extension: string;
    originalName: string;
    description: string;
    parentFolder: IFolderEntity;
    dateAdded: Date;
    dateFrom: Date;
    dateTo: Date;
    place: IPlaceEntity;
    tags: ITagEntity[];
    persons: IPersonEntity[];
}
