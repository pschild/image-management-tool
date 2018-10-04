import { JsonController } from 'routing-controllers';
import * as afs from 'async-file';
import * as path from 'path';
import { IFile } from '../../../domain/IFile';

@JsonController()
export class FileSystemController {

    IMAGE_FILE_EXTENSIONS: string[] = ['jpg', 'jpeg', 'png', 'gif'];

    async getFoldersByPath(givenPath: string): Promise<IFile[]> {
        const files: IFile[] = await this.getFilesByPath(givenPath);
        return files.filter((file: IFile) => file.isDirectory);
    }

    async getImagesByPath(givenPath: string): Promise<IFile[]> {
        const files: IFile[] = await this.getFilesByPath(givenPath);
        return files.filter((file: IFile) => file.isFile && this.isImageFile(file));
    }

    getSystemDrives() {
        // TODO: https://www.npmjs.com/package/drivelist
    }

    async getFilesByPath(givenPath: string): Promise<IFile[]> {
        const fileList = await afs.readdir(givenPath);
        const filePromises = fileList.map(async fileName => {
            const absolutePath = path.join(givenPath, fileName);
            const stat = await afs.stat(absolutePath);
            const extension = path.extname(fileName);
            return {
                name: path.basename(fileName, extension), // name without extension
                absolutePath: absolutePath,
                ext: extension.substring(1), // remove . at the beginning
                isFile: stat.isFile(),
                isDirectory: stat.isDirectory()
            };
        });
        return Promise.all(filePromises);
    }

    private isImageFile(file: IFile): boolean {
        const fileExtensions = this.IMAGE_FILE_EXTENSIONS.join('|');
        return file.ext.match(new RegExp('(' + fileExtensions + ')$', 'i')) != null;
    }
}
