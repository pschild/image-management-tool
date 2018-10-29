import { JsonController, Get, Param } from 'routing-controllers';
import { FolderController } from './FolderController';
import { ImageController } from './ImageController';
import { FileSystemController } from './FileSystemController';
import { ImageDto } from '../../../domain/ImageDto';
import { FolderDto } from '../../../domain/FolderDto';
import { IFolderContentDto } from '../../../domain/interface/IFolderContentDto';
import { FileSystemError } from '../../../domain/error/FileSystemError';

@JsonController()
export class ExplorerController {

    folderController: FolderController = new FolderController();
    imageController: ImageController = new ImageController();
    fileSystemController: FileSystemController = new FileSystemController();

    @Get('/explorer/:folderId')
    async getContentByFolderId(@Param('folderId') folderId: number): Promise<IFolderContentDto | FileSystemError> {
        const folderPath = await this.folderController.buildPathByFolderId(folderId);
        return this.getContentByFolderPath(folderPath);
    }

    @Get('/explorer/path/:folderPath')
    async getContentByFolderPath(@Param('folderPath') folderPath: string): Promise<IFolderContentDto | FileSystemError> {
        /**
         * TODO:
         * fileSystemController.getFilesByPath is called twice:
         *
         * this.getMergedFolderList > fileSystemController.getFoldersByPath > fileSystemController.getFilesByPath
         * this.getMergedImageList > fileSystemController.getFoldersByPath > fileSystemController.getFilesByPath
         */
        let folders;
        folders = await this.getMergedFolderList(folderPath).catch(error => {
            throw new FileSystemError(error.code, error.message);
        });

        let images;
        images = await this.getMergedImageList(folderPath).catch(error => {
            throw new FileSystemError(error.code, error.message);
        });

        return { folders, images };
    }

    async getMergedFolderList(folderPath: string): Promise<FolderDto[]> {
        let dbFolders = [];
        const folderFromDb = await this.folderController.getFolderByPath(folderPath);
        if (folderFromDb) {
            dbFolders = await this.folderController.findDirectDescendantsByFolder(folderFromDb);
        }

        const fsFolders = await this.fileSystemController.getFoldersByPath(folderPath);

        // merge DB and FS folder lists
        const foldersInDbAndFs: FolderDto[] = dbFolders.map(dbFolder => {
            let removedInFs = false;

            const accordingFsFolderIndex = fsFolders.findIndex(folder => folder.name === dbFolder.name);
            if (accordingFsFolderIndex < 0) {
                removedInFs = true;
            } else {
                // remove found folder from foldersFromFileSystem, so that in the end this array only contains elements
                // that are in FS but not in DB.
                fsFolders.splice(accordingFsFolderIndex, 1);
            }

            return new FolderDto(dbFolder.name, folderPath, false, removedInFs, dbFolder.id);
        });

        // if there are elements left in foldersFromFileSystem, they are in FS but not in DB
        if (fsFolders.length) {
            const foldersOnlyInFs: FolderDto[] = fsFolders.map(fsFolder => {
                return new FolderDto(fsFolder.name, folderPath, true, false);
            });
            return [...foldersInDbAndFs, ...foldersOnlyInFs];
        } else {
            return foldersInDbAndFs;
        }
    }

    async getMergedImageList(folderPath: string): Promise<ImageDto[]> {
        let dbImages = [];
        const folderFromDb = await this.folderController.getFolderByPath(folderPath);
        if (folderFromDb) {
            dbImages = await this.imageController.allByFolderId(folderFromDb.id);
        }

        const fsImages = await this.fileSystemController.getImagesByPath(folderPath);

        // merge DB and FS folder lists
        const imagesInDbAndFs: ImageDto[] = dbImages.map(dbImage => {
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

            return new ImageDto(dbImage.name, folderPath, dbImage.extension, false, removedInFs, dbImage.id);
        });

        // if there are elements left in foldersFromFileSystem, they are in FS but not in DB
        if (fsImages.length) {
            const imagesOnlyInFs: ImageDto[] = fsImages.map(fsImage => {
                return new ImageDto(fsImage.name, folderPath, fsImage.extension, true, false);
            });
            return [...imagesInDbAndFs, ...imagesOnlyInFs];
        } else {
            return imagesInDbAndFs;
        }
    }
}
