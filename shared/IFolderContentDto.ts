import { IFolderDto } from './IFolderDto';
import { IImageDto } from './IImageDto';

export interface IFolderContentDto {
    folders: IFolderDto[];
    images: IImageDto[];
}
