import { IImageDto } from './IImage.dto';

export interface ITagDto {
    id?: number;
    label: string;
    dateAdded?: Date;
    images?: IImageDto[];
}
