import { IImageEntityDto } from './IImageEntity.dto';

export interface IPersonEntityDto {
    id?: number;
    firstname: string;
    lastname?: string;
    birthday?: Date;
    dateAdded?: Date;
    images?: IImageEntityDto[];
}
