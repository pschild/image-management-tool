import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { IMapper } from './IMapper';
import { ImageEntityToDtoMapper } from './ImageEntityToDto.mapper';
import { ITagEntity } from '../../../shared/ITagEntity';
import { ITagEntityDto } from '../../../shared/ITagEntity.dto';

@Injectable()
export class TagEntityToDtoMapper implements IMapper<ITagEntity, ITagEntityDto> {

    constructor(
        @Inject(forwardRef(() => ImageEntityToDtoMapper)) // because ImageEntityToDtoMapper needs TagEntityToDtoMapper
        private readonly imageEntityToDtoMapper: ImageEntityToDtoMapper
    ) { }

    async map(entity: ITagEntity): Promise<ITagEntityDto> {
        if (entity) {
            return {
                id: entity.id,
                label: entity.label,
                dateAdded: entity.dateAdded,
                images: await this.imageEntityToDtoMapper.mapAll(entity.images)
            };
        }
    }

    mapAll(entities: ITagEntity[]): Promise<ITagEntityDto[]> {
        const r = entities.map(async (entity: ITagEntity) => await this.map(entity));
        return Promise.all(r);
    }
}
