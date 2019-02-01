import * as path from 'path';
import * as afs from 'async-file';
import * as os from 'os';
import * as drivelist from 'drivelist';
import { Injectable } from '@nestjs/common';
import { PathHelperService } from '../util/path-helper/path-helper.service';
import { IFsFile } from '../interface/IFsFile';

@Injectable()
export class FileSystemService {

    constructor(private readonly pathHelperService: PathHelperService) { }

    IMAGE_FILE_EXTENSIONS: string[] = ['jpg', 'jpeg', 'png', 'gif'];

    filterByFolder(files: IFsFile[]): IFsFile[] {
        return files.filter((file: IFsFile) => file.isDirectory);
    }

    filterByImage(files: IFsFile[]): IFsFile[] {
        return files.filter((file: IFsFile) => file.isFile && this.isImageFile(file));
    }

    async getSystemDrives(): Promise<IFsFile[]> {
        return new Promise<IFsFile[]>((resolve, reject) => {
            drivelist.list((error, driveList) => {
                if (error) {
                    reject(error);
                }

                const driveDirectories: IFsFile[] = [];
                driveList.forEach(driveInfo => {
                    driveInfo.mountpoints.forEach(mountpoint => {
                        const drivePath = mountpoint.path;
                        const strippedPath = drivePath.replace(path.sep, ''); // strip slashes after drive letter
                        driveDirectories.push({
                            name: strippedPath,
                            absolutePath: strippedPath,
                            isDirectory: true
                        });
                    });
                });
                resolve(driveDirectories);
            });
        });
    }

    async getFilesByPath(givenPath: string): Promise<IFsFile[]> {
        // Workaround: ensure we get sth like C:\\ when pathName is drive letter
        givenPath = this.pathHelperService.getAsDirectory(givenPath);

        const fileList = await afs.readdir(givenPath);
        const fileDtos: IFsFile[] = [];
        // use for-of loop instead of map, because map is synchronous!
        for (const fileName of fileList) {
            const absolutePath = path.join(givenPath, fileName);
            let stat;
            try {
                stat = await afs.lstat(absolutePath);
            } catch (error) {
                // skip directories whose access throws EPERM errors
                continue;
            }

            if (stat.isDirectory()) {
                fileDtos.push({
                    name: fileName,
                    absolutePath: absolutePath,
                    isDirectory: true
                });
            } else if (stat.isFile()) {
                const extension = path.extname(fileName);
                fileDtos.push({
                    name: path.basename(fileName, extension), // name without extension
                    absolutePath: absolutePath,
                    extension: extension.substring(1), // remove . at the beginning
                    size: stat.size,
                    isFile: true
                });
            } else if (stat.isSymbolicLink()) {
                // skip directories which are symlinks
                continue;
            } else {
                throw new Error(`File ${absolutePath} is neither file nor directory.`);
            }
        }
        return fileDtos;
    }

    getHomeDirectory(): string {
        return os.homedir();
    }

    private isImageFile(file: IFsFile): boolean {
        const fileExtensions = this.IMAGE_FILE_EXTENSIONS.join('|');
        return file.extension && file.extension.match(new RegExp('(' + fileExtensions + ')$', 'i')) != null;
    }
}
