import { IImageEntityDto } from './IImageEntity.dto';

export interface IPlaceEntityDto {
    id?: number;
    name: string;
    address?: string;
    city?: string;
    country?: string;
    dateAdded?: Date;
    images?: IImageEntityDto[];
}
