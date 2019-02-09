import { IImageDto } from './IImage.dto';

export interface IPersonDto {
    id?: number;
    firstname: string;
    lastname?: string;
    birthday?: Date;
    dateAdded?: Date;
    images?: IImageDto[];
}
