import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { IMapper } from './IMapper';
import { ImageEntityToDtoMapper } from './ImageEntityToDto.mapper';
import { Place } from '../entity/place.entity';
import { PlaceDto } from '../dto/Place.dto';

@Injectable()
export class PlaceEntityToDtoMapper implements IMapper<Place, PlaceDto> {

    constructor(
        @Inject(forwardRef(() => ImageEntityToDtoMapper)) // because ImageEntityToDtoMapper needs PlaceEntityToDtoMapper
        private readonly imageEntityToDtoMapper: ImageEntityToDtoMapper
    ) { }

    async map(entity: Place): Promise<PlaceDto> {
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

    mapAll(entities: Place[]): Promise<PlaceDto[]> {
        if (entities && entities.length) {
            const r = entities.map(async (entity: Place) => await this.map(entity));
            return Promise.all(r);
        }
    }
}
