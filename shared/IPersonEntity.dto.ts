import { IImageEntityDto } from './IImageEntity.dto';

export interface IPersonEntityDto {
    id?: number;
    firstname: string;
    lastname?: string;
    birthday?: string;
    dateAdded?: string;
    images?: IImageEntityDto[];
}
