import { Folder } from '../entity/folder.entity';
import { FolderDto } from '../dto/Folder.dto';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { FolderService } from '../folder/folder.service';
import { ModuleRef } from '@nestjs/core';
import { ImageDtoFactory } from './image-dto.factory';
import { IDtoFactory } from './IDtoFactory';

@Injectable()
export class FolderDtoFactory implements IDtoFactory<Folder, FolderDto>, OnModuleInit {

    private imageDtoFactory: ImageDtoFactory;

    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly folderService: FolderService
    ) {}

    onModuleInit() {
        // this avoids using forwardRef due to circular dependencies between factories
        this.imageDtoFactory = this.moduleRef.get(ImageDtoFactory);
    }

    async toDto(entity: Folder): Promise<FolderDto> {
        if (entity) {
            const dto = new FolderDto();
            dto.id = entity.id;
            dto.name = entity.name;
            dto.absolutePath = await this.buildAbsolutePath(entity);
            dto.parent = await this.toDto(entity.parent);
            dto.children = await this.toDtos(entity.children);
            dto.images = await this.imageDtoFactory.toDtos(entity.images);
            return dto;
        }
    }

    async toDtos(entities: Folder[]): Promise<FolderDto[]> {
        if (entities && entities.length) {
            return Promise.all(entities.map(async (folder: Folder) => await this.toDto(folder)));
        }
    }

    private async buildAbsolutePath(entity: Folder): Promise<string> {
        return this.folderService.buildPathByFolderId(entity.id);
    }

}
