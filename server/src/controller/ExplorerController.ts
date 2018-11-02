import { JsonController, Get, Param } from 'routing-controllers';
import { FolderController } from './FolderController';
import { ImageController } from './ImageController';
import { FileSystemController } from './FileSystemController';
import { ImageDto } from '../../../domain/ImageDto';
import { FolderDto } from '../../../domain/FolderDto';
import { IFolderContentDto } from '../../../domain/interface/IFolderContentDto';
import { FileSystemError } from '../../../domain/error/FileSystemError';
import { IFileDto } from '../../../domain/interface/IFileDto';
import { Folder } from '../entity/Folder';
import { Image } from '../entity/Image';
import * as path from 'path';

@JsonController()
export class ExplorerController {

    folderController: FolderController = new FolderController();
    imageController: ImageController = new ImageController();
    fileSystemController: FileSystemController = new FileSystemController();

    @Get('/explorer/id/:folderId')
    async getContentByFolderId(@Param('folderId') folderId: number): Promise<IFolderContentDto | FileSystemError> {
        const folderPath = await this.folderController.buildPathByFolderId(folderId);
        return this.getContentByFolderPath(folderPath);
    }

    @Get('/explorer/path/:folderPath')
    async getContentByFolderPath(@Param('folderPath') folderPath: string): Promise<IFolderContentDto | FileSystemError> {
        const fsFiles: IFileDto[] = await this.fileSystemController.getFilesByPath(folderPath);
        const fsFolders: IFileDto[] = this.fileSystemController.filterByFolder(fsFiles);
        const fsImages: IFileDto[] = this.fileSystemController.filterByImage(fsFiles);

        const folderFromDb: Folder = await this.folderController.getFolderByPath(folderPath);

        let dbFolders: Folder[] = [];
        let dbImages: Image[] = [];
        if (folderFromDb) {
            dbFolders = await this.folderController.findDirectDescendantsByFolder(folderFromDb);
            dbImages = await this.imageController.allByFolderId(folderFromDb.id);
        }

        let mergedFolders: FolderDto[];
        mergedFolders = await this.getMergedFolderList(fsFolders, dbFolders).catch(error => {
            throw new FileSystemError(error.code, error.message);
        });

        let mergedImages: ImageDto[];
        mergedImages = await this.getMergedImageList(fsImages, dbImages).catch(error => {
            throw new FileSystemError(error.code, error.message);
        });

        return { folders: mergedFolders, images: mergedImages };
    }

    @Get('/explorer/systemDrives')
    async getSystemDrives(): Promise<IFolderContentDto | FileSystemError> {
        const fsFolders: IFileDto[] = await this.fileSystemController.getSystemDrives();
        const dbFolders: Folder[] = await this.folderController.findRootFolders();

        let mergedFolders: FolderDto[];
        mergedFolders = await this.getMergedFolderList(fsFolders, dbFolders).catch(error => {
            throw new FileSystemError(error.code, error.message);
        });

        // it's not possible that images are placed beside the system drives, so we return an empty array
        const mergedImages = [];

        return { folders: mergedFolders, images: mergedImages };
    }

    @Get('/explorer/homeDirectory')
    async getHomeDirectory(): Promise<string> {
        return this.fileSystemController.getHomeDirectory();
    }

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

            const absolutePath = await this.folderController.buildPathByFolderId(dbFolder.id);
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

            const parentFolderPath = await this.folderController.buildPathByFolderId(dbImage.parentFolder.id);
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
