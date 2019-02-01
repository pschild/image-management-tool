import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { IMapper } from './IMapper';
import { ImageEntityToDtoMapper } from './ImageEntityToDto.mapper';
import { IPlaceEntity } from '../interface/IPlaceEntity';
import { IPlaceEntityDto } from '../../../shared/dto/IPlaceEntity.dto';

@Injectable()
export class PlaceEntityToDtoMapper implements IMapper<IPlaceEntity, IPlaceEntityDto> {

    constructor(
        @Inject(forwardRef(() => ImageEntityToDtoMapper)) // because ImageEntityToDtoMapper needs PlaceEntityToDtoMapper
        private readonly imageEntityToDtoMapper: ImageEntityToDtoMapper
    ) { }

    async map(entity: IPlaceEntity): Promise<IPlaceEntityDto> {
        if (entity) {
            return {
                id: entity.id,
                name: entity.name,
                address: entity.address,
                city: entity.city,
                country: entity.country,
                dateAdded: entity.dateAdded,
                images: await this.imageEntityToDtoMapper.mapAll(entity.images)
            };
        }
    }

    mapAll(entities: IPlaceEntity[]): Promise<IPlaceEntityDto[]> {
        if (entities && entities.length) {
            const r = entities.map(async (entity: IPlaceEntity) => await this.map(entity));
            return Promise.all(r);
        }
    }
}
