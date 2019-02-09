import { IImageEntityDto } from './IImageEntity.dto';

export interface IFolderDto {
    id?: number;
    name: string;
    absolutePath: string;
    parent: IFolderDto;
    children?: IFolderDto[];
    images?: IImageEntityDto[];
    dateAdded?: Date;
}
