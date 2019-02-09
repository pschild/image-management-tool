import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeepPartial, FindConditions } from 'typeorm';
import { Image } from '../entity/image.entity';

@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(Image)
        private readonly repository: Repository<Image>
    ) { }

    findOne(id: number, withRelations: boolean = false): Promise<Image> {
        return this.repository.findOne(id, { relations: withRelations ? ['parentFolder', 'tags', 'persons', 'place'] : [] });
    }

    findAll(withRelations: boolean = false): Promise<Image[]> {
        return this.repository.find({ relations: withRelations ? ['parentFolder', 'tags', 'persons', 'place'] : [] });
    }

    findAllByFolderId(folderId: number): Promise<Image[]> {
        return this.repository
            .createQueryBuilder('image')
            .innerJoinAndSelect('image.parentFolder', 'folder', 'folder.id = :folderId', { folderId })
            .getMany();
    }

    findOneByConditions(conditions: FindConditions<Image>): Promise<Image> {
        return this.repository.findOne(conditions);
    }

    create(image: DeepPartial<Image>): Promise<Image> {
        return this.repository.save(image);
    }

    update(id: number, image: DeepPartial<Image>): Promise<UpdateResult> {
        return this.repository.update(id, image);
    }

    updateByConditions(conditions: FindConditions<Image>, image: DeepPartial<Image>): Promise<UpdateResult> {
        return this.repository.update(conditions, image);
    }

    remove(id: number): Promise<Image> {
        return this.repository.remove(
            this.repository.create({ id })
        );
    }
}
