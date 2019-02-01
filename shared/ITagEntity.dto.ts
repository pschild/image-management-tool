import { IImageEntityDto } from './IImageEntity.dto';

export interface ITagEntityDto {
    id?: number;
    label: string;
    dateAdded?: Date;
    images?: IImageEntityDto[];
}
