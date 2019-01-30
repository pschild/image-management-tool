import { IImageEntity } from './IImageEntity';

export interface IPersonEntity {
    id: number;
    firstname: string;
    lastname: string;
    birthday: Date;
    dateAdded: Date;
    images: IImageEntity[];
}
