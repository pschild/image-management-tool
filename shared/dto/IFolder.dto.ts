import { IImageDto } from './IImage.dto';

export interface IFolderDto {
    id?: number;
    name: string;
    absolutePath: string;
    parent: IFolderDto;
    children?: IFolderDto[];
    images?: IImageDto[];
    dateAdded?: Date;
}
