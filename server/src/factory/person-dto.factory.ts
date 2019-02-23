import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Person } from '../entity/person.entity';
import { PersonDto } from '../dto/Person.dto';
import { ImageDtoFactory } from './image-dto.factory';
import { IDtoFactory } from './IDtoFactory';

@Injectable()
export class PersonDtoFactory implements IDtoFactory<Person, PersonDto>, OnModuleInit {

    private imageDtoFactory: ImageDtoFactory;

    constructor(
        private readonly moduleRef: ModuleRef
    ) {}

    onModuleInit() {
        // this avoids using forwardRef due to circular dependencies between factories
        this.imageDtoFactory = this.moduleRef.get(ImageDtoFactory);
    }

    async toDto(entity: Person): Promise<PersonDto> {
        if (entity) {
            const dto = new PersonDto();
            dto.id = entity.id;
            dto.firstname = entity.firstname;
            dto.lastname = entity.lastname;
            dto.birthday = entity.birthday;
            dto.images = await this.imageDtoFactory.toDtos(entity.images);
            return dto;
        }
    }

    async toDtos(entities: Person[]): Promise<PersonDto[]> {
        if (entities && entities.length) {
            return Promise.all(entities.map(async (person: Person) => await this.toDto(person)));
        }
    }
}
