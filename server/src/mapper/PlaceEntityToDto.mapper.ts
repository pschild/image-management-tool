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
            const dto = new PlaceDto();
            dto.id = entity.id;
            dto.name = entity.name;
            dto.address = entity.address;
            dto.city = entity.city;
            dto.country = entity.country;
            dto.dateAdded = entity.dateAdded;
            dto.images = await this.imageEntityToDtoMapper.mapAll(entity.images);
            return dto;
        }
    }

    mapAll(entities: Place[]): Promise<PlaceDto[]> {
        if (entities && entities.length) {
            const r = entities.map(async (entity: Place) => await this.map(entity));
            return Promise.all(r);
        }
    }
}
