import { IFolderEntity } from './IFolderEntity';
import { IFsFile } from './IFsFile';

export interface IFolderDto {
    addedInFs: boolean;
    removedInFs: boolean;
    dbFolder: IFolderEntity;
    fsFolder: IFsFile;
}
