import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { FolderService } from '../folder/folder.service';
import { DuplicateFileException } from '../../../shared/exception/duplicate-file.exception';
import { IFsFile } from '../../../shared/IFsFile';
import { IMergedFolderDto } from '../../../shared/IMergedFolder.dto';
import { IMergedImageDto } from '../../../shared/IMergedImage.dto';
import { IImageEntity } from '../../../shared/IImageEntity';
import { IFolderEntity } from '../../../shared/IFolderEntity';

@Injectable()
export class ExplorerService {

    constructor(private readonly folderService: FolderService) { }

    async getMergedFolderList(fsFolders: IFsFile[], dbFolders: IFolderEntity[]): Promise<IMergedFolderDto[]> {
        // merge DB and FS folder lists
        const foldersInDbAndFs: IMergedFolderDto[] = [];
        for (const dbFolder of dbFolders) {
            let accordingFsFolder = null;
            const accordingFsFolderIndex = fsFolders.findIndex(folder => folder.name === dbFolder.name);
            if (accordingFsFolderIndex >= 0) {
                // remove found folder from foldersFromFileSystem, so that in the end this array only contains elements
                // that are in FS but not in DB.
                accordingFsFolder = fsFolders.splice(accordingFsFolderIndex, 1)[0];
            }

            const absolutePath = await this.folderService.buildPathByFolderId(dbFolder.id);
            foldersInDbAndFs.push({
                id: dbFolder.id,
                name: dbFolder.name,
                absolutePath,
                addedInFs: false,
                removedInFs: accordingFsFolder === null
            });
        }

        let resultList: IMergedFolderDto[] = [];
        // if there are elements left in foldersFromFileSystem, they are in FS but not in DB
        if (fsFolders.length) {
            const foldersOnlyInFs: IMergedFolderDto[] = fsFolders.map(fsFolder => {
                return {
                    name: fsFolder.name,
                    absolutePath: fsFolder.absolutePath,
                    addedInFs: true,
                    removedInFs: false
                } as IMergedFolderDto;
            });
            resultList = [...foldersInDbAndFs, ...foldersOnlyInFs];
        } else {
            resultList = foldersInDbAndFs;
        }

        // find duplicates
        const duplicates = this.findDuplicates(resultList.map((item: IMergedFolderDto) => item.name));
        if (duplicates.length) {
            throw new DuplicateFileException(`Found duplicate folder(s): ${duplicates.join(',')}`);
        }

        return resultList;
    }

    async getMergedImageList(fsImages: IFsFile[], dbImages: IImageEntity[]): Promise<IMergedImageDto[]> {
        // merge DB and FS folder lists
        const imagesInDbAndFs: IMergedImageDto[] = [];
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
            const absolutePath = `${parentFolderPath}${path.sep}${dbImage.name}.${dbImage.extension}`;
            imagesInDbAndFs.push({
                id: dbImage.id,
                name: dbImage.name,
                extension: dbImage.extension,
                absolutePath: absolutePath,
                addedInFs: false,
                removedInFs: accordingFsImage === null
            });
        }

        let resultList: IMergedImageDto[] = [];
        // if there are elements left in foldersFromFileSystem, they are in FS but not in DB
        if (fsImages.length) {
            const imagesOnlyInFs: IMergedImageDto[] = fsImages.map(fsImage => {
                return {
                    name: fsImage.name,
                    extension: fsImage.extension,
                    absolutePath: fsImage.absolutePath,
                    addedInFs: true,
                    removedInFs: false
                } as IMergedImageDto;
            });
            resultList = [...imagesInDbAndFs, ...imagesOnlyInFs];
        } else {
            resultList = imagesInDbAndFs;
        }

        // find duplicates
        const duplicates = this.findDuplicates(resultList.map((item: IMergedImageDto) => `${item.name}.${item.extension}`));
        if (duplicates.length) {
            throw new DuplicateFileException(`Found duplicate image(s): ${duplicates.join(',')}`);
        }

        return resultList;
    }

    findDuplicates(list: string[]): string[] {
        return list.filter((item, index) => list.indexOf(item) !== index);
    }
}
