import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeepPartial } from 'typeorm';
import { Image } from '../entity/Image';

@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(Image)
        private readonly repository: Repository<Image>
    ) { }

    findOne(id: number): Promise<Image> {
        return this.repository.findOne(id);
    }

    findAll(): Promise<Image[]> {
        return this.repository.find();
    }

    findAllByFolderId(folderId: number) {
        return this.repository
            .createQueryBuilder('image')
            .innerJoinAndSelect('image.parentFolder', 'folder', 'folder.id = :folderId', { folderId })
            .getMany();
    }

    create(image: DeepPartial<Image>): Promise<Image> {
        return this.repository.save(image);
    }

    update(id: number, image: DeepPartial<Image>): Promise<UpdateResult> {
        return this.repository.update(id, image);
    }

    remove(id: number): Promise<Image> {
        return this.repository.remove(
            this.repository.create({ id })
        );
    }
}
