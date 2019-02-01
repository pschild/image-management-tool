import { IImageEntityDto } from './IImageEntity.dto';

export interface ITagEntityDto {
    id?: number;
    label: string;
    dateAdded?: string;
    images?: IImageEntityDto[];
}
