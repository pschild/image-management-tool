import { JsonController, Get, Param } from 'routing-controllers';
import { FolderController } from './FolderController';
import { ImageController } from './ImageController';
import { FileSystemController } from './FileSystemController';
import { IFolderDto } from '../../../domain/IFolderDto';
import { IImageDto } from '../../../domain/IImageDto';

@JsonController()
export class ExplorerController {

    folderController: FolderController = new FolderController();
    imageController: ImageController = new ImageController();
    fileSystemController: FileSystemController = new FileSystemController();

    @Get('/explorer/:folderId')
    async getContentByFolderId(@Param('folderId') folderId: number) {
        const folderPath = await this.folderController.buildPathByFolderId(folderId);
        return this.getContentByFolderPath(folderPath);
    }

    @Get('/explorer/path/:folderPath')
    async getContentByFolderPath(@Param('folderPath') folderPath: string) {
        let folders;
        try {
            folders = await this.getMergedFolderList(folderPath);
        } catch (error) {
            return { error: true, message: error.message };
        }

        let images;
        try {
            images = await this.getMergedImageList(folderPath);
        } catch (error) {
            return { error: true, message: error.message };
        }

        return { folders, images };
    }

    async getMergedFolderList(folderPath: string): Promise<IFolderDto[]> {
        let dbFolders = [];
        const folderFromDb = await this.folderController.getFolderByPath(folderPath);
        if (folderFromDb) {
            dbFolders = await this.folderController.findDirectDescendantsByFolder(folderFromDb);
        }

        const fsFolders = await this.fileSystemController.getFoldersByPath(folderPath);

        // merge DB and FS folder lists
        const foldersInDbAndFs: IFolderDto[] = dbFolders.map(dbFolder => {
            let removedInFs = false;

            const accordingFsFolderIndex = fsFolders.findIndex(folder => folder.name === dbFolder.name);
            if (accordingFsFolderIndex < 0) {
                removedInFs = true;
            } else {
                // remove found folder from foldersFromFileSystem, so that in the end this array only contains elements
                // that are in FS but not in DB.
                fsFolders.splice(accordingFsFolderIndex, 1);
            }

            return {
                id: dbFolder.id,
                name: dbFolder.name,
                removedInFs: removedInFs,
                addedInFs: false
            };
        });

        // if there are elements left in foldersFromFileSystem, they are in FS but not in DB
        if (fsFolders.length) {
            const foldersOnlyInFs: IFolderDto[] = fsFolders.map(fsFolder => {
                return {
                    name: fsFolder.name,
                    removedInFs: false,
                    addedInFs: true
                };
            });
            return [...foldersInDbAndFs, ...foldersOnlyInFs];
        } else {
            return foldersInDbAndFs;
        }
    }

    async getMergedImageList(folderPath: string): Promise<IImageDto[]> {
        let dbImages = [];
        const folderFromDb = await this.folderController.getFolderByPath(folderPath);
        if (folderFromDb) {
            dbImages = await this.imageController.allByFolderId(folderFromDb.id);
        }

        const fsImages = await this.fileSystemController.getImagesByPath(folderPath);

        // merge DB and FS folder lists
        const imagesInDbAndFs: IImageDto[] = dbImages.map(dbImage => {
            let removedInFs = false;

            const accordingFsImageIndex = fsImages.findIndex(
                image => image.name === dbImage.name && image.ext === dbImage.suffix
            );
            if (accordingFsImageIndex < 0) {
                removedInFs = true;
            } else {
                // remove found image from imagesFromFileSystem, so that in the end this array only contains elements
                // that are in FS but not in DB.
                fsImages.splice(accordingFsImageIndex, 1);
            }

            return {
                id: dbImage.id,
                name: dbImage.name,
                extension: dbImage.suffix,
                removedInFs: removedInFs,
                addedInFs: false
            };
        });

        // if there are elements left in foldersFromFileSystem, they are in FS but not in DB
        if (fsImages.length) {
            const imagesOnlyInFs: IImageDto[] = fsImages.map(fsImage => {
                return {
                    name: fsImage.name,
                    extension: fsImage.ext,
                    removedInFs: false,
                    addedInFs: true
                };
            });
            return [...imagesInDbAndFs, ...imagesOnlyInFs];
        } else {
            return imagesInDbAndFs;
        }
    }
}
