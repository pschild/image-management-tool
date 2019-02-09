import { IImageDto } from './IImage.dto';

export interface IPlaceDto {
    id?: number;
    name: string;
    address?: string;
    city?: string;
    country?: string;
    dateAdded?: Date;
    images?: IImageDto[];
}
