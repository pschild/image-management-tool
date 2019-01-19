import { Controller, Get, Param, Post, Body, UseFilters } from '@nestjs/common';
import { FileSystemService } from '../fileSystem/file-system.service';
import { FolderService } from '../folder/folder.service';
import { ImageService } from '../image/image.service';
import { IFolderContentDto } from '../../../domain/interface/IFolderContentDto';
import { IFileDto } from '../../../domain/interface/IFileDto';
import { Folder } from '../entity/folder.entity';
import { Image } from '../entity/image.entity';
import { FolderDto } from '../../../domain/FolderDto';
import { ImageDto } from '../../../domain/ImageDto';
import { ExplorerService } from './explorer.service';
import * as path from 'path';
import { FileSystemExceptionFilter } from '../filter/file-system-exception.filter';
import { FileSystemException } from '../../../domain/exception/file-system.exception';

@Controller('explorer')
@UseFilters(FileSystemExceptionFilter)
export class ExplorerController {
    constructor(
        private readonly explorerService: ExplorerService,
        private readonly fileSystemService: FileSystemService,
        private readonly folderService: FolderService,
        private readonly imageService: ImageService
    ) { }

    @Get('id/:folderId')
    async getContentByFolderId(@Param('folderId') folderId: number): Promise<IFolderContentDto | FileSystemException> {
        const folderPath = await this.folderService.buildPathByFolderId(folderId);
        return this.getContentByFolderPath(folderPath);
    }

    @Get('path/:folderPath')
    async getContentByFolderPath(@Param('folderPath') folderPath: string): Promise<IFolderContentDto | FileSystemException> {
        const fsFiles: IFileDto[] = await this.fileSystemService.getFilesByPath(folderPath).catch(error => {
            throw new FileSystemException({
                userMessage: `Could not get files of path ${folderPath}`,
                errno: error.code,
                technicalMessage: error.message
            });
        });

        const fsFolders: IFileDto[] = this.fileSystemService.filterByFolder(fsFiles);
        const fsImages: IFileDto[] = this.fileSystemService.filterByImage(fsFiles);

        const folderFromDb: Folder = await this.folderService.getFolderByPath(folderPath);

        let dbFolders: Folder[] = [];
        let dbImages: Image[] = [];
        if (folderFromDb) {
            dbFolders = await this.folderService.findDirectDescendantsByFolder(folderFromDb);
            dbImages = await this.imageService.findAllByFolderId(folderFromDb.id);
        }

        const mergedFolders: FolderDto[] = await this.explorerService.getMergedFolderList(fsFolders, dbFolders);
        const mergedImages: ImageDto[] = await this.explorerService.getMergedImageList(fsImages, dbImages);

        return { folders: mergedFolders, images: mergedImages };
    }

    @Get('systemDrives')
    async getSystemDrives(): Promise<IFolderContentDto | FileSystemException> {
        const fsFolders: IFileDto[] = await this.fileSystemService.getSystemDrives();
        const dbFolders: Folder[] = await this.folderService.findRootFolders();

        let mergedFolders: FolderDto[];
        mergedFolders = await this.explorerService.getMergedFolderList(fsFolders, dbFolders).catch(error => {
            throw new FileSystemException({
                userMessage: `An error occured: ${error.message}`,
                errno: error.code,
                technicalMessage: error.message
            });
        });

        // it's not possible that images are placed beside the system drives, so we return an empty array
        const mergedImages = [];

        return { folders: mergedFolders, images: mergedImages };
    }

    @Get('homeDirectory')
    getHomeDirectory(): Promise<string> {
        return this.fileSystemService.getHomeDirectory();
    }

    @Post('folder')
    createByPath(@Body() body: {path: string}): Promise<Folder> {
        return this.folderService.getFolderByPath(decodeURI(body.path), true);
    }

    @Post('image')
    async createImageByPath(@Body() body: {absolutePath: string; name: string; extension: string; }): Promise<Image> {
        const absolutePathParts = body.absolutePath.split(path.sep);
        absolutePathParts.pop();

        const image = new Image();
        image.name = body.name;
        image.originalName = body.name;
        image.extension = body.extension;
        image.parentFolder = await this.folderService.getFolderByPath(absolutePathParts.join(path.sep), true);
        return this.imageService.create(image);
    }

    @Post('relocate/folder')
    async relocateFolder(@Body() body: {oldPath: string, newPath: string}): Promise<Folder> {
        const oldPath: string = decodeURI(body.oldPath);
        const newPath: string = decodeURI(body.newPath);

        const newPathParts: string[] = newPath.split(path.sep);
        const newFolderName = newPathParts.pop();

        let newParent: Folder = null;
        if (newPathParts.length > 0) {
            const newParentPath = newPathParts.join(path.sep);
            newParent = await this.folderService.getFolderByPath(newParentPath, true);
        }

        const oldFolder: Folder = await this.folderService.getFolderByPath(oldPath);
        oldFolder.name = newFolderName;
        oldFolder.parent = newParent;
        await this.folderService.update(oldFolder.id, oldFolder);
        return oldFolder;
    }
}
