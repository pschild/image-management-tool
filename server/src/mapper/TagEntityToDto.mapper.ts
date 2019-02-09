import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { IMapper } from './IMapper';
import { ImageEntityToDtoMapper } from './ImageEntityToDto.mapper';
import { Tag } from '../entity/tag.entity';
import { TagDto } from '../dto/Tag.dto';

@Injectable()
export class TagEntityToDtoMapper implements IMapper<Tag, TagDto> {

    constructor(
        @Inject(forwardRef(() => ImageEntityToDtoMapper)) // because ImageEntityToDtoMapper needs TagEntityToDtoMapper
        private readonly imageEntityToDtoMapper: ImageEntityToDtoMapper
    ) { }

    async map(entity: Tag): Promise<TagDto> {
        if (entity) {
            const dto = new TagDto();
            dto.id = entity.id;
            dto.label = entity.label;
            dto.dateAdded = entity.dateAdded;
            dto.images = await this.imageEntityToDtoMapper.mapAll(entity.images);
            return dto;
        }
    }

    mapAll(entities: Tag[]): Promise<TagDto[]> {
        if (entities && entities.length) {
            const r = entities.map(async (entity: Tag) => await this.map(entity));
            return Promise.all(r);
        }
    }
}
