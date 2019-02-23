import { Image } from '../entity/image.entity';
import { ImageDto } from '../dto/Image.dto';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { FolderService } from '../folder/folder.service';
import * as path from 'path';
import { FolderDtoFactory } from './folder-dto.factory';
import { TagDtoFactory } from './tag-dto.factory';
import { PlaceDtoFactory } from './place-dto.factory';
import { PersonDtoFactory } from './person-dto.factory';
import { IDtoFactory } from './IDtoFactory';

@Injectable()
export class ImageDtoFactory implements IDtoFactory<Image, ImageDto>, OnModuleInit {

    private folderDtoFactory: FolderDtoFactory;
    private tagDtoFactory: TagDtoFactory;
    private placeDtoFactory: PlaceDtoFactory;
    private personDtoFactory: PersonDtoFactory;

    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly folderService: FolderService
    ) {}

    onModuleInit() {
        // this avoids using forwardRef due to circular dependencies between factories
        this.folderDtoFactory = this.moduleRef.get(FolderDtoFactory);
        this.tagDtoFactory = this.moduleRef.get(TagDtoFactory);
        this.personDtoFactory = this.moduleRef.get(PersonDtoFactory);
        this.placeDtoFactory = this.moduleRef.get(PlaceDtoFactory);
    }

    async toDto(entity: Image): Promise<ImageDto> {
        if (entity) {
            const dto = new ImageDto();
            dto.id = entity.id;
            dto.name = entity.name;
            dto.extension = entity.extension;
            dto.description = entity.description;
            dto.dateFrom = entity.dateFrom;
            dto.dateTo = entity.dateTo;
            dto.absolutePath = await this.buildAbsolutePath(entity);
            dto.parentFolder = await this.folderDtoFactory.toDto(entity.parentFolder);
            dto.tags = await this.tagDtoFactory.toDtos(entity.tags);
            dto.place = await this.placeDtoFactory.toDto(entity.place);
            dto.persons = await this.personDtoFactory.toDtos(entity.persons);
            return dto;
        }
    }

    async toDtos(entities: Image[]): Promise<ImageDto[]> {
        if (entities && entities.length) {
            return Promise.all(entities.map(async (image: Image) => await this.toDto(image)));
        }
    }

    private async buildAbsolutePath(entity: Image): Promise<string> {
        const parentFolderPath = await this.folderService.buildPathByFolderId(entity.parentFolder.id);
        return `${parentFolderPath}${path.sep}${entity.name}.${entity.extension}`;
    }

}
