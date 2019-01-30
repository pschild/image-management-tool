import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { FolderService } from '../folder/folder.service';
import { DuplicateFileException } from '../../../shared/exception/duplicate-file.exception';
import { IFsFile } from '../../../shared/IFsFile';
import { IFolderEntity } from '../../../shared/IFolderEntity';
import { IFolderDto } from '../../../shared/IFolderDto';
import { IImageEntity } from '../../../shared/IImageEntity';
import { IImageDto } from '../../../shared/IImageDto';

@Injectable()
export class ExplorerService {

    constructor(private readonly folderService: FolderService) { }

    async getMergedFolderList(fsFolders: IFsFile[], dbFolders: IFolderEntity[]): Promise<IFolderDto[]> {
        // merge DB and FS folder lists
        const foldersInDbAndFs: IFolderDto[] = [];
        for (const dbFolder of dbFolders) {
            let accordingFsFolder = null;
            const accordingFsFolderIndex = fsFolders.findIndex(folder => folder.name === dbFolder.name);
            if (accordingFsFolderIndex >= 0) {
                // remove found folder from foldersFromFileSystem, so that in the end this array only contains elements
                // that are in FS but not in DB.
                accordingFsFolder = fsFolders.splice(accordingFsFolderIndex, 1)[0];
            }

            // TODO: required?
            const absolutePath = await this.folderService.buildPathByFolderId(dbFolder.id);
            // foldersInDbAndFs.push(new FolderDto(dbFolder.name, absolutePath, false, removedInFs, dbFolder.id));
            foldersInDbAndFs.push({
                dbFolder,
                fsFolder: accordingFsFolder,
                addedInFs: false,
                removedInFs: accordingFsFolder === null
            });
        }

        let resultList: IFolderDto[] = [];
        // if there are elements left in foldersFromFileSystem, they are in FS but not in DB
        if (fsFolders.length) {
            const foldersOnlyInFs: IFolderDto[] = fsFolders.map(fsFolder => {
                // return new FolderDto(fsFolder.name, fsFolder.absolutePath, true, false);
                return {
                    dbFolder: null,
                    fsFolder,
                    addedInFs: true,
                    removedInFs: false
                } as IFolderDto;
            });
            resultList = [...foldersInDbAndFs, ...foldersOnlyInFs];
        } else {
            resultList = foldersInDbAndFs;
        }

        // TODO
        // find duplicates
        // const duplicates = this.findDuplicates(resultList.map(i => i.name));
        // if (duplicates.length) {
        //     throw new DuplicateFileException(`Found duplicate folder(s): ${duplicates.join(',')}`);
        // }

        return resultList;
    }

    async getMergedImageList(fsImages: IFsFile[], dbImages: IImageEntity[]): Promise<IImageDto[]> {
        // merge DB and FS folder lists
        const imagesInDbAndFs: IImageDto[] = [];
        for (const dbImage of dbImages) {
            let accordingFsImage = null;
            const accordingFsImageIndex = fsImages.findIndex(
                image => image.name === dbImage.name && image.extension === dbImage.extension
            );
            if (accordingFsImageIndex >= 0) {
                // remove found image from imagesFromFileSystem, so that in the end this array only contains elements
                // that are in FS but not in DB.
                accordingFsImage = fsImages.splice(accordingFsImageIndex, 1)[0];
            }

            const parentFolderPath = await this.folderService.buildPathByFolderId(dbImage.parentFolder.id);
            // TODO: required?
            const absolutePath = `${parentFolderPath}${path.sep}${dbImage.name}.${dbImage.extension}`;
            // imagesInDbAndFs.push(new ImageDto(dbImage.name, absolutePath, dbImage.extension, false, removedInFs, dbImage.id));
            imagesInDbAndFs.push({
                dbImage,
                fsImage: accordingFsImage,
                addedInFs: false,
                removedInFs: accordingFsImage === null
            });
        }

        let resultList: IImageDto[] = [];
        // if there are elements left in foldersFromFileSystem, they are in FS but not in DB
        if (fsImages.length) {
            const imagesOnlyInFs: IImageDto[] = fsImages.map(fsImage => {
                // return new ImageDto(fsImage.name, fsImage.absolutePath, fsImage.extension, true, false);
                return {
                    dbImage: null,
                    fsImage,
                    addedInFs: true,
                    removedInFs: false
                } as IImageDto;
            });
            resultList = [...imagesInDbAndFs, ...imagesOnlyInFs];
        } else {
            resultList = imagesInDbAndFs;
        }

        // TODO
        // find duplicates
        // const duplicates = this.findDuplicates(resultList.map(i => `${i.name}.${i.extension}`));
        // if (duplicates.length) {
        //     throw new DuplicateFileException(`Found duplicate image(s): ${duplicates.join(',')}`);
        // }

        return resultList;
    }

    findDuplicates(list: string[]): string[] {
        return list.filter((item, index) => list.indexOf(item) !== index);
    }
}
