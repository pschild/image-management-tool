import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeepPartial, FindConditions } from 'typeorm';
import { Image } from '../entity/image.entity';
import { IImageEntity } from '../interface/IImageEntity';

@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(Image)
        private readonly repository: Repository<Image>
    ) { }

    findOne(id: number, withRelations: boolean = false): Promise<IImageEntity> {
        return this.repository.findOne(id, { relations: withRelations ? ['parentFolder', 'tags', 'persons', 'place'] : [] });
    }

    findAll(withRelations: boolean = false): Promise<IImageEntity[]> {
        return this.repository.find({ relations: withRelations ? ['parentFolder', 'tags', 'persons', 'place'] : [] });
    }

    findAllByFolderId(folderId: number): Promise<IImageEntity[]> {
        return this.repository
            .createQueryBuilder('image')
            .innerJoinAndSelect('image.parentFolder', 'folder', 'folder.id = :folderId', { folderId })
            .getMany();
    }

    findOneByConditions(conditions: FindConditions<IImageEntity>): Promise<IImageEntity> {
        return this.repository.findOne(conditions);
    }

    create(image: DeepPartial<IImageEntity>): Promise<IImageEntity> {
        return this.repository.save(image);
    }

    update(id: number, image: DeepPartial<IImageEntity>): Promise<UpdateResult> {
        return this.repository.update(id, image);
    }

    updateByConditions(conditions: FindConditions<IImageEntity>, image: DeepPartial<IImageEntity>): Promise<UpdateResult> {
        return this.repository.update(conditions, image);
    }

    remove(id: number): Promise<IImageEntity> {
        return this.repository.remove(
            this.repository.create({ id })
        );
    }
}
