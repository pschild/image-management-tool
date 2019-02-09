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
            return {
                id: entity.id,
                label: entity.label,
                dateAdded: entity.dateAdded,
                images: await this.imageEntityToDtoMapper.mapAll(entity.images)
            };
        }
    }

    mapAll(entities: Tag[]): Promise<TagDto[]> {
        if (entities && entities.length) {
            const r = entities.map(async (entity: Tag) => await this.map(entity));
            return Promise.all(r);
        }
    }
}
