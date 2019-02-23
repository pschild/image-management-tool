import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Tag } from '../entity/tag.entity';
import { TagDto } from '../dto/Tag.dto';
import { ImageDtoFactory } from './image-dto.factory';

@Injectable()
export class TagDtoFactory implements OnModuleInit {

    private imageDtoFactory: ImageDtoFactory;

    constructor(
        private readonly moduleRef: ModuleRef
    ) {}

    onModuleInit() {
        // this avoids using forawrdRef due to circular dependencies between factories
        this.imageDtoFactory = this.moduleRef.get(ImageDtoFactory);
    }

    async toDto(entity: Tag): Promise<TagDto> {
        if (entity) {
            const dto = new TagDto();
            dto.id = entity.id;
            dto.label = entity.label;
            dto.images = await this.imageDtoFactory.toDtos(entity.images);
            return dto;
        }
    }

    async toDtos(entities: Tag[]): Promise<TagDto[]> {
        if (entities && entities.length) {
            return Promise.all(entities.map(async (tag: Tag) => await this.toDto(tag)));
        }
    }
}
