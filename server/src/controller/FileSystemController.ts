import { JsonController } from 'routing-controllers';
import * as afs from 'async-file';
import * as path from 'path';
import { IFileDTO } from '../../../domain/IFileDTO';

@JsonController()
export class FileSystemController {

    IMAGE_FILE_EXTENSIONS: string[] = ['jpg', 'jpeg', 'png', 'gif'];

    async getFoldersByPath(givenPath: string): Promise<IFileDTO[]> {
        const files: IFileDTO[] = await this.getFilesByPath(givenPath);
        return files.filter((file: IFileDTO) => file.isDirectory);
    }

    async getImagesByPath(givenPath: string): Promise<IFileDTO[]> {
        const files: IFileDTO[] = await this.getFilesByPath(givenPath);
        return files.filter((file: IFileDTO) => file.isFile && this.isImageFile(file));
    }

    getSystemDrives() {
        // TODO: https://www.npmjs.com/package/drivelist
    }

    async getFilesByPath(givenPath: string): Promise<IFileDTO[]> {
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

    private isImageFile(file: IFileDTO): boolean {
        const fileExtensions = this.IMAGE_FILE_EXTENSIONS.join('|');
        return file.ext.match(new RegExp('(' + fileExtensions + ')$', 'i')) != null;
    }
}
