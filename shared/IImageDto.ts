import { IImageEntity } from './IImageEntity';
import { IFsFile } from './IFsFile';

export interface IImageDto {
    addedInFs: boolean;
    removedInFs: boolean;
    dbImage: IImageEntity;
    fsImage: IFsFile;
}
