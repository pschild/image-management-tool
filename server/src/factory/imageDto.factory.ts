import { Image } from '../entity/image.entity';
import { ImageDto } from '../dto/Image.dto';
import { FolderDtoFactory } from './folderDto.factory';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { FolderService } from '../folder/folder.service';
import * as path from 'path';

@Injectable()
export class ImageDtoFactory implements OnModuleInit {

    private folderDtoFactory: FolderDtoFactory;

    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly folderService: FolderService
    ) {}

    onModuleInit() {
        // this avoids using forawrdRef due to circular dependencies between factories
        this.folderDtoFactory = this.moduleRef.get(FolderDtoFactory);
    }

    async toDto(i: Image): Promise<ImageDto> {
        if (i) {
            const dto = new ImageDto();
            dto.id = i.id;
            dto.name = i.name;
            dto.absolutePath = await this.buildAbsolutePath(i);
            dto.parentFolder = await this.folderDtoFactory.toDto(i.parentFolder);
            return dto;
        }
    }

    async toDtos(i: Image[]): Promise<ImageDto[]> {
        if (i && i.length) {
            return Promise.all(i.map(async (image: Image) => await this.toDto(image)));
        }
    }

    private async buildAbsolutePath(entity: Image): Promise<string> {
        const parentFolderPath = await this.folderService.buildPathByFolderId(entity.parentFolder.id);
        return `${parentFolderPath}${path.sep}${entity.name}.${entity.extension}`;
    }

}
