import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { IMapper } from './IMapper';
import { ImageEntityToDtoMapper } from './ImageEntityToDto.mapper';
import { Person } from '../entity/person.entity';
import { PersonDto } from '../dto/Person.dto';

@Injectable()
export class PersonEntityToDtoMapper implements IMapper<Person, PersonDto> {

    constructor(
        @Inject(forwardRef(() => ImageEntityToDtoMapper)) // because ImageEntityToDtoMapper needs PersonEntityToDtoMapper
        private readonly imageEntityToDtoMapper: ImageEntityToDtoMapper
    ) { }

    async map(entity: Person): Promise<PersonDto> {
        if (entity) {
            const dto = new PersonDto();
            dto.id = entity.id;
            dto.firstname = entity.firstname;
            dto.lastname = entity.lastname;
            dto.birthday = entity.birthday;
            dto.dateAdded = entity.dateAdded;
            dto.images = await this.imageEntityToDtoMapper.mapAll(entity.images);
            return dto;
        }
    }

    mapAll(entities: Person[]): Promise<PersonDto[]> {
        if (entities && entities.length) {
            const r = entities.map(async (entity: Person) => await this.map(entity));
            return Promise.all(r);
        }
    }
}
