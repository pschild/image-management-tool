import { Injectable } from '@nestjs/common';
import { FolderService } from '../folder/folder.service';
import { Folder } from '../entity/folder.entity';
import { Image } from '../entity/image.entity';
import * as path from 'path';
import { IFileDto } from '../../../shared/interface/IFileDto';
import { FolderDto } from '../../../shared/FolderDto';
import { ImageDto } from '../../../shared/ImageDto';
import { DuplicateFileException } from '../../../shared/exception/duplicate-file.exception';

@Injectable()
export class ExplorerService {

    constructor(private readonly folderService: FolderService) { }

    async getMergedFolderList(fsFolders: IFileDto[], dbFolders: Folder[]): Promise<FolderDto[]> {
        // merge DB and FS folder lists
        const foldersInDbAndFs: FolderDto[] = [];
        for (const dbFolder of dbFolders) {
            let removedInFs = false;

            const accordingFsFolderIndex = fsFolders.findIndex(folder => folder.name === dbFolder.name);
            if (accordingFsFolderIndex < 0) {
                removedInFs = true;
            } else {
                // remove found folder from foldersFromFileSystem, so that in the end this array only contains elements
                // that are in FS but not in DB.
                fsFolders.splice(accordingFsFolderIndex, 1);
            }

            const absolutePath = await this.folderService.buildPathByFolderId(dbFolder.id);
            foldersInDbAndFs.push(new FolderDto(dbFolder.name, absolutePath, false, removedInFs, dbFolder.id));
        }

        let resultList: FolderDto[] = [];
        // if there are elements left in foldersFromFileSystem, they are in FS but not in DB
        if (fsFolders.length) {
            const foldersOnlyInFs: FolderDto[] = fsFolders.map(fsFolder => {
                return new FolderDto(fsFolder.name, fsFolder.absolutePath, true, false);
            });
            resultList = [...foldersInDbAndFs, ...foldersOnlyInFs];
        } else {
            resultList = foldersInDbAndFs;
        }

        // find duplicates
        const duplicates = this.findDuplicates(resultList.map(i => i.name));
        if (duplicates.length) {
            throw new DuplicateFileException(`Found duplicate folder(s): ${duplicates.join(',')}`);
        }

        return resultList;
    }

    async getMergedImageList(fsImages: IFileDto[], dbImages: Image[]): Promise<ImageDto[]> {
        // merge DB and FS folder lists
        const imagesInDbAndFs: ImageDto[] = [];
        for (const dbImage of dbImages) {
            let removedInFs = false;

            const accordingFsImageIndex = fsImages.findIndex(
                image => image.name === dbImage.name && image.extension === dbImage.extension
            );
            if (accordingFsImageIndex < 0) {
                removedInFs = true;
            } else {
                // remove found image from imagesFromFileSystem, so that in the end this array only contains elements
                // that are in FS but not in DB.
                fsImages.splice(accordingFsImageIndex, 1);
            }

            const parentFolderPath = await this.folderService.buildPathByFolderId(dbImage.parentFolder.id);
            const absolutePath = `${parentFolderPath}${path.sep}${dbImage.name}.${dbImage.extension}`;
            imagesInDbAndFs.push(new ImageDto(dbImage.name, absolutePath, dbImage.extension, false, removedInFs, dbImage.id));
        }

        let resultList: ImageDto[] = [];
        // if there are elements left in foldersFromFileSystem, they are in FS but not in DB
        if (fsImages.length) {
            const imagesOnlyInFs: ImageDto[] = fsImages.map(fsImage => {
                return new ImageDto(fsImage.name, fsImage.absolutePath, fsImage.extension, true, false);
            });
            resultList = [...imagesInDbAndFs, ...imagesOnlyInFs];
        } else {
            resultList = imagesInDbAndFs;
        }

        // find duplicates
        const duplicates = this.findDuplicates(resultList.map(i => `${i.name}.${i.extension}`));
        if (duplicates.length) {
            throw new DuplicateFileException(`Found duplicate image(s): ${duplicates.join(',')}`);
        }

        return resultList;
    }

    findDuplicates(list: string[]): string[] {
        return list.filter((item, index) => list.indexOf(item) !== index);
    }
}
