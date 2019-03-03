import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeepPartial, FindConditions } from 'typeorm';
import { Tag } from '../entity/tag.entity';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        private readonly repository: Repository<Tag>
    ) { }

    findOne(id: number, withRelations: boolean = false): Promise<Tag> {
        return this.repository.findOne(id, { relations: withRelations ? ['images'] : [] });
    }

    findOneByLabel(label: string, withRelations: boolean = false): Promise<Tag> {
        return this.repository.findOne({ label }, { relations: withRelations ? ['images'] : [] });
    }

    findAll(): Promise<Tag[]> {
        return this.repository.find();
    }

    create(folder: DeepPartial<Tag>): Promise<Tag> {
        return this.repository.save(folder);
    }

    update(id: number, folder: DeepPartial<Tag>): Promise<UpdateResult> {
        return this.repository.update(id, folder);
    }

    updateByConditions(conditions: FindConditions<Tag>, folder: DeepPartial<Tag>): Promise<UpdateResult> {
        return this.repository.update(conditions, folder);
    }

    remove(id: number): Promise<Tag> {
        return this.repository.remove(
            this.repository.create({ id })
        );
    }
}
