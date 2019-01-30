import { IImageEntity } from './IImageEntity';

export interface IPlaceEntity {
    id: number;
    name: string;
    address: string;
    city: string;
    country: string;
    dateAdded: Date;
    images: IImageEntity[];
}
