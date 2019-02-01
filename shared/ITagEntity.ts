import { IImageEntity } from './IImageEntity';

export interface ITagEntity {
    id: number;
    label: string;
    dateAdded: Date;
    images: IImageEntity[];
}
