import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { IMapper } from './IMapper';
import { IPersonEntity } from '../../../shared/IPersonEntity';
import { IPersonEntityDto } from '../../../shared/IPersonEntity.dto';
import { ImageEntityToDtoMapper } from './ImageEntityToDto.mapper';

@Injectable()
export class PersonEntityToDtoMapper implements IMapper<IPersonEntity, IPersonEntityDto> {

    constructor(
        @Inject(forwardRef(() => ImageEntityToDtoMapper)) // because ImageEntityToDtoMapper needs PersonEntityToDtoMapper
        private readonly imageEntityToDtoMapper: ImageEntityToDtoMapper
    ) { }

    async map(entity: IPersonEntity): Promise<IPersonEntityDto> {
        if (entity) {
            return {
                id: entity.id,
                firstname: entity.firstname,
                lastname: entity.lastname,
                birthday: entity.birthday,
                dateAdded: entity.dateAdded,
                images: await this.imageEntityToDtoMapper.mapAll(entity.images)
            };
        }
    }

    mapAll(entities: IPersonEntity[]): Promise<IPersonEntityDto[]> {
        const r = entities.map(async (entity: IPersonEntity) => await this.map(entity));
        return Promise.all(r);
    }
}
