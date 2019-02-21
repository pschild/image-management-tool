import { Folder } from '../entity/folder.entity';
import { FolderDto } from '../dto/Folder.dto';
import { ImageDtoFactory } from './imageDto.factory';
import { Injectable } from '@nestjs/common';
import { FolderService } from '../folder/folder.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class FolderDtoFactory {

    private imageDtoFactory: ImageDtoFactory;

    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly folderService: FolderService
    ) {}

    onModuleInit() {
        // this avoids using forawrdRef due to circular dependencies between factories
        this.imageDtoFactory = this.moduleRef.get(ImageDtoFactory);
    }

    async toDto(f: Folder): Promise<FolderDto> {
        if (f) {
            const dto = new FolderDto();
            dto.id = f.id;
            dto.name = f.name;
            dto.absolutePath = await this.buildAbsolutePath(f);
            dto.parent = await this.toDto(f.parent);
            dto.children = await this.toDtos(f.children);
            dto.images = await this.imageDtoFactory.toDtos(f.images);
            return dto;
        }
    }

    async toDtos(f: Folder[]): Promise<FolderDto[]> {
        if (f && f.length) {
            return Promise.all(f.map(async (folder: Folder) => await this.toDto(folder)));
        }
    }

    private async buildAbsolutePath(entity: Folder): Promise<string> {
        return this.folderService.buildPathByFolderId(entity.id);
    }

}
