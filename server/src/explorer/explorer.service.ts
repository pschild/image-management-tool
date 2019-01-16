import { Injectable } from '@nestjs/common';
import { FolderService } from '../folder/folder.service';
import { IFileDto } from '../../../domain/interface/IFileDto';
import { Folder } from '../entity/Folder';
import { FolderDto } from '../../../domain/FolderDto';
import { Image } from '../entity/Image';
import { ImageDto } from '../../../domain/ImageDto';
import * as path from 'path';

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

        // if there are elements left in foldersFromFileSystem, they are in FS but not in DB
        if (fsFolders.length) {
            const foldersOnlyInFs: FolderDto[] = fsFolders.map(fsFolder => {
                return new FolderDto(fsFolder.name, fsFolder.absolutePath, true, false);
            });
            return [...foldersInDbAndFs, ...foldersOnlyInFs];
        } else {
            return foldersInDbAndFs;
        }
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

        // if there are elements left in foldersFromFileSystem, they are in FS but not in DB
        if (fsImages.length) {
            const imagesOnlyInFs: ImageDto[] = fsImages.map(fsImage => {
                return new ImageDto(fsImage.name, fsImage.absolutePath, fsImage.extension, true, false);
            });
            return [...imagesInDbAndFs, ...imagesOnlyInFs];
        } else {
            return imagesInDbAndFs;
        }
    }
}
