import { JsonController, Get, Param } from 'routing-controllers';
import { FolderController } from './FolderController';
import { ImageController } from './ImageController';
import { FileSystemController } from './FileSystemController';
import { IFolder } from '../../../domain/IFolder';
import { IImage } from '../../../domain/IImage';

@JsonController()
export class ExplorerController {

    folderController: FolderController = new FolderController();
    imageController: ImageController = new ImageController();
    fileSystemController: FileSystemController = new FileSystemController();

    @Get('/explorer/:folderId')
    async getContentByFolderId(@Param('folderId') folderId: number) {
        const folders = await this.getMergedFolderList(folderId);
        const images = await this.getMergedImageList(folderId);

        return { folders, images };
    }

    async getMergedFolderList(folderId: number): Promise<IFolder[]> {
        const folderPath = await this.folderController.buildPathByFolderId(folderId);

        // DB > Folders
        const directDescendantFolders = await this.folderController.findDirectDescendants(folderId);
        // FS > Folders
        const foldersFromFileSystem = await this.fileSystemController.getFoldersByPath(folderPath);

        // merge DB and FS folder lists
        const foldersInDbAndFs: IFolder[] = directDescendantFolders.map(dbFolder => {
            let removedInFs = false;

            const accordingFsFolderIndex = foldersFromFileSystem.findIndex(folder => folder.name === dbFolder.name);
            if (accordingFsFolderIndex < 0) {
                removedInFs = true;
            } else {
                // remove found folder from foldersFromFileSystem, so that in the end this array only contains elements
                // that are in FS but not in DB.
                foldersFromFileSystem.splice(accordingFsFolderIndex, 1);
            }

            return {
                id: dbFolder.id,
                name: dbFolder.name,
                removedInFs: removedInFs,
                addedInFs: false
            };
        });

        // if there are elements left in foldersFromFileSystem, they are in FS but not in DB
        if (foldersFromFileSystem.length) {
            const foldersOnlyInFs: IFolder[] = foldersFromFileSystem.map(fsFolder => {
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

    async getMergedImageList(folderId: number): Promise<IImage[]> {
        const folderPath = await this.folderController.buildPathByFolderId(folderId);

        // DB > Images
        const directDescendantImages = await this.imageController.allByFolderId(folderId);
        // FS > Images
        const imagesFromFileSystem = await this.fileSystemController.getImagesByPath(folderPath);

        // merge DB and FS folder lists
        const imagesInDbAndFs: IImage[] = directDescendantImages.map(dbImage => {
            let removedInFs = false;

            const accordingFsImageIndex = imagesFromFileSystem.findIndex(
                image => image.name === dbImage.name && image.ext === dbImage.suffix
            );
            if (accordingFsImageIndex < 0) {
                removedInFs = true;
            } else {
                // remove found image from imagesFromFileSystem, so that in the end this array only contains elements
                // that are in FS but not in DB.
                imagesFromFileSystem.splice(accordingFsImageIndex, 1);
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
        if (imagesFromFileSystem.length) {
            const imagesOnlyInFs: IImage[] = imagesFromFileSystem.map(fsImage => {
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
