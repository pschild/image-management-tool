import { IImageEntity } from './IImageEntity';

export interface IFolderEntity {
    id: number;
    name: string;
    parent: IFolderEntity;
    children: IFolderEntity[];
    dateAdded: Date;
    images: IImageEntity[];
}
