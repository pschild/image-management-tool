import { Controller, Get, Param, Post, Body, UseFilters } from '@nestjs/common';
import { FileSystemService } from '../fileSystem/file-system.service';
import { FolderService } from '../folder/folder.service';
import { ImageService } from '../image/image.service';
import { ExplorerService } from './explorer.service';
import * as path from 'path';
import { FileSystemException } from '../../../shared/exception/file-system.exception';
import { FileSystemExceptionFilter } from '../filter/file-system-exception.filter';
import { DuplicateFileExceptionFilter } from '../filter/duplicate-file-exception.filter';
import { FileNotFoundException } from '../../../shared/exception/file-not-found.exception';
import { RelocationException } from '../../../shared/exception/relocation.exception';
import { RelocationExceptionFilter } from '../filter/relocation-exception.filter';
import { FileNotFoundExceptionFilter } from '../filter/file-not-found-exception.filter';
import { Image } from '../entity/image.entity';
import { IExplorerContentDto } from '../../../shared/IExplorerContent.dto';
import { IFsFile } from '../../../shared/IFsFile';
import { IFolderEntity } from '../../../shared/IFolderEntity';
import { IImageEntity } from '../../../shared/IImageEntity';
import { IMergedFolderDto } from '../../../shared/IMergedFolder.dto';
import { IMergedImageDto } from '../../../shared/IMergedImage.dto';
import { IFolderEntityDto } from '../../../shared/IFolderEntity.dto';
import { IImageEntityDto } from '../../../shared/IImageEntity.dto';
import { FolderEntityToDtoMapper } from '../mapper/FolderEntityToDto.mapper';
import { ImageEntityToDtoMapper } from '../mapper/ImageEntityToDto.mapper';

@Controller('explorer')
export class ExplorerController {
    constructor(
        private readonly explorerService: ExplorerService,
        private readonly fileSystemService: FileSystemService,
        private readonly folderService: FolderService,
        private readonly imageService: ImageService,
        private readonly folderEntityToDtoMapper: FolderEntityToDtoMapper,
        private readonly imageEntityToDtoMapper: ImageEntityToDtoMapper
    ) { }

    @Get('id/:folderId')
    async getContentByFolderId(@Param('folderId') folderId: number): Promise<IExplorerContentDto | FileSystemException> {
        const folderPath = await this.folderService.buildPathByFolderId(folderId);
        return this.getContentByFolderPath(folderPath);
    }

    @Get('path/:folderPath')
    @UseFilters(FileSystemExceptionFilter, DuplicateFileExceptionFilter)
    async getContentByFolderPath(@Param('folderPath') folderPath: string): Promise<IExplorerContentDto | FileSystemException> {
        const fsFiles: IFsFile[] = await this.fileSystemService.getFilesByPath(folderPath).catch(error => {
            throw new FileSystemException({
                userMessage: `Could not get files of path ${folderPath}`,
                errno: error.code,
                technicalMessage: error.message
            });
        });

        const fsFolders: IFsFile[] = this.fileSystemService.filterByFolder(fsFiles);
        const fsImages: IFsFile[] = this.fileSystemService.filterByImage(fsFiles);

        const folderFromDb: IFolderEntity = await this.folderService.getFolderByPath(folderPath);

        let dbFolders: IFolderEntity[] = [];
        let dbImages: IImageEntity[] = [];
        if (folderFromDb) {
            dbFolders = await this.folderService.findDirectDescendantsByFolder(folderFromDb);
            dbImages = await this.imageService.findAllByFolderId(folderFromDb.id);
        }

        const mergedFolders: IMergedFolderDto[] = await this.explorerService.getMergedFolderList(fsFolders, dbFolders);
        const mergedImages: IMergedImageDto[] = await this.explorerService.getMergedImageList(fsImages, dbImages);

        return { folders: mergedFolders, images: mergedImages };
    }

    @Get('systemDrives')
    @UseFilters(FileSystemExceptionFilter, DuplicateFileExceptionFilter)
    async getSystemDrives(): Promise<IExplorerContentDto | FileSystemException> {
        const fsFolders: IFsFile[] = await this.fileSystemService.getSystemDrives();
        const dbFolders: IFolderEntity[] = await this.folderService.findRootFolders();

        let mergedFolders: IMergedFolderDto[];
        mergedFolders = await this.explorerService.getMergedFolderList(fsFolders, dbFolders).catch(error => {
            throw new FileSystemException({
                userMessage: `An error occured: ${error.message}`,
                errno: error.code,
                technicalMessage: error.message
            });
        });

        // it's not possible that images are placed beside the system drives, so we return an empty array
        const mergedImages: IMergedImageDto[] = [];

        return { folders: mergedFolders, images: mergedImages };
    }

    @Get('homeDirectory')
    getHomeDirectory(): string {
        return this.fileSystemService.getHomeDirectory();
    }

    @Post('folder')
    async createByPath(@Body() body: {path: string}): Promise<IFolderEntityDto> {
        return this.folderEntityToDtoMapper.map(await this.folderService.createFolderByPath(decodeURI(body.path)));
    }

    @Post('image')
    async createImageByPath(@Body() body: {absolutePath: string; name: string; extension: string; }): Promise<IImageEntityDto> {
        const absolutePathParts = body.absolutePath.split(path.sep);
        const parentFolderPathParts = absolutePathParts.slice(0, -1);
        const parentFolder = await this.folderService.getFolderOrCreateByPath(parentFolderPathParts.join(path.sep));

        const image = new Image();
        image.name = body.name;
        image.originalName = body.name;
        image.extension = body.extension;
        image.parentFolder = parentFolder;
        return this.imageEntityToDtoMapper.map(await this.imageService.create(image));
    }

    @Post('relocate/folder')
    @UseFilters(RelocationExceptionFilter)
    async relocateFolder(@Body() body: {oldPath: string, newPath: string}): Promise<IFolderEntityDto> {
        const sourcePath: string = decodeURI(body.oldPath);
        const targetPath: string = decodeURI(body.newPath);

        const sourceFolder: IFolderEntity = await this.folderService.getFolderByPath(sourcePath);
        const targetFolder: IFolderEntity = await this.folderService.getFolderByPath(targetPath);

        // if the target folder exists in db, use it as parent for the source folder's children (folders and images)
        if (targetFolder) {
            await this.folderService.updateByConditions({ parent: sourceFolder }, { parent: targetFolder });
            await this.imageService.updateByConditions({ parentFolder: sourceFolder }, { parentFolder: targetFolder });
            await this.folderService.remove(sourceFolder.id);
            return this.folderEntityToDtoMapper.map(targetFolder);
        }

        // if the target folder doesn't exist in db, get/create the target folder's parent and set it as the source folder's parent
        const targetPathParts: string[] = targetPath.split(path.sep);
        const targetFolderName = targetPathParts.pop();
        let targetParent: IFolderEntity = null;
        if (targetPathParts.length > 0) {
            const targetParentPath = targetPathParts.join(path.sep);
            targetParent = await this.folderService.getFolderOrCreateByPath(targetParentPath);
        }
        sourceFolder.parent = targetParent;

        // the target folder may be renamed, so set the source folder's name to the target folder's name
        sourceFolder.name = targetFolderName;

        // update db
        await this.folderService.update(sourceFolder.id, sourceFolder);
        return this.folderEntityToDtoMapper.map(sourceFolder);
    }

    @Post('relocate/image')
    @UseFilters(RelocationExceptionFilter, FileNotFoundExceptionFilter)
    async relocateImage(@Body() body: {oldPath: string, newPath: string}): Promise<IImageEntityDto> {
        const sourcePath: string = decodeURI(body.oldPath);
        const targetPath: string = decodeURI(body.newPath);

        const sourcePathParts: string[] = sourcePath.split(path.sep);
        const targetPathParts: string[] = targetPath.split(path.sep);

        const sourceFolderPath: string = sourcePathParts.slice(0, -1).join(path.sep);
        const targetFolderPath: string = targetPathParts.slice(0, -1).join(path.sep);

        const sourceImageExtension: string = path.extname(sourcePath).substring(1); // remove . at the beginning
        const targetImageExtension: string = path.extname(targetPath).substring(1); // remove . at the beginning

        const sourceImageName: string = path.basename(sourcePath, '.' + sourceImageExtension);
        const targetImageName: string = path.basename(targetPath, '.' + targetImageExtension);

        const sourceFolder: IFolderEntity = await this.folderService.getFolderByPath(sourceFolderPath);
        const targetFolder: IFolderEntity = await this.folderService.getFolderByPath(targetFolderPath);

        const sourceImage: IImageEntity = await this.imageService.findOneByConditions({
            parentFolder: sourceFolder,
            name: sourceImageName,
            extension: sourceImageExtension
        });

        if (!sourceImage) {
            throw new FileNotFoundException(`Could not find file ${sourcePath} in the database`);
        }

        if (targetFolder) {
            const targetImage: IImageEntity = await this.imageService.findOneByConditions({
                parentFolder: targetFolder,
                name: targetImageName,
                extension: targetImageExtension
            });
            if (targetImage) {
                throw new RelocationException(
                    `The chosen image ${targetPath} already exists in the database. Therefore, it cannot be set for ${sourcePath}`
                );
            }
        }

        sourceImage.parentFolder = await this.folderService.getFolderOrCreateByPath(targetFolderPath);
        sourceImage.name = targetImageName;
        sourceImage.extension = targetImageExtension;

        await this.imageService.update(sourceImage.id, sourceImage);
        return this.imageEntityToDtoMapper.map(sourceImage);
    }
}
