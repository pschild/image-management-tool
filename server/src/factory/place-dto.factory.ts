import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { PlaceDto } from '../dto/Place.dto';
import { Place } from '../entity/place.entity';
import { ImageDtoFactory } from './image-dto.factory';

@Injectable()
export class PlaceDtoFactory implements OnModuleInit {

    private imageDtoFactory: ImageDtoFactory;

    constructor(
        private readonly moduleRef: ModuleRef
    ) {}

    onModuleInit() {
        // this avoids using forawrdRef due to circular dependencies between factories
        this.imageDtoFactory = this.moduleRef.get(ImageDtoFactory);
    }

    async toDto(entity: Place): Promise<PlaceDto> {
        if (entity) {
            const dto = new PlaceDto();
            dto.id = entity.id;
            dto.name = entity.name;
            dto.address = entity.address;
            dto.city = entity.city;
            dto.country = entity.country;
            dto.images = await this.imageDtoFactory.toDtos(entity.images);
            return dto;
        }
    }

    async toDtos(entities: Place[]): Promise<PlaceDto[]> {
        if (entities && entities.length) {
            return Promise.all(entities.map(async (place: Place) => await this.toDto(place)));
        }
    }
}
