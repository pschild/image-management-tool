import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { IMapper } from './IMapper';
import { FolderService } from '../folder/folder.service';
import * as path from 'path';
import { FolderEntityToDtoMapper } from './FolderEntityToDto.mapper';
import { PersonEntityToDtoMapper } from './PersonEntityToDto.mapper';
import { TagEntityToDtoMapper } from './TagEntityToDto.mapper';
import { PlaceEntityToDtoMapper } from './PlaceEntityToDto.mapper';
import { ImageDto } from '../dto/Image.dto';
import { Image } from '../entity/image.entity';

@Injectable()
export class ImageEntityToDtoMapper implements IMapper<Image, ImageDto> {

    constructor(
        private readonly folderService: FolderService,
        private readonly folderEntityToDtoMapper: FolderEntityToDtoMapper,
        @Inject(forwardRef(() => PersonEntityToDtoMapper)) // because PersonEntityToDtoMapper needs ImageEntityToDtoMapper
        private readonly personEntityToDtoMapper: PersonEntityToDtoMapper,
        @Inject(forwardRef(() => PlaceEntityToDtoMapper)) // because PlaceEntityToDtoMapper needs ImageEntityToDtoMapper
        private readonly placeEntityToDtoMapper: PlaceEntityToDtoMapper,
        @Inject(forwardRef(() => TagEntityToDtoMapper)) // because TagEntityToDtoMapper needs ImageEntityToDtoMapper
        private readonly tagEntityToDtoMapper: TagEntityToDtoMapper
    ) { }

    async map(entity: Image): Promise<ImageDto> {
        if (entity) {
            if (!entity.parentFolder) {
                throw new Error(`Could not find parentFolder. Did you forget to query with relations?`);
            }
            const parentFolderPath = await this.folderService.buildPathByFolderId(entity.parentFolder.id);
            const absolutePath = `${parentFolderPath}${path.sep}${entity.name}.${entity.extension}`;
            return {
                id: entity.id,
                name: entity.name,
                extension: entity.extension,
                absolutePath: absolutePath,
                description: entity.description,
                originalName: entity.originalName,
                dateAdded: entity.dateAdded,
                dateFrom: entity.dateFrom,
                dateTo: entity.dateTo,
                parentFolder: await this.folderEntityToDtoMapper.map(entity.parentFolder),
                persons: await this.personEntityToDtoMapper.mapAll(entity.persons),
                place: await this.placeEntityToDtoMapper.map(entity.place),
                tags: await this.tagEntityToDtoMapper.mapAll(entity.tags)
            };
        }
    }

    mapAll(entities: Image[]): Promise<ImageDto[]> {
        if (entities && entities.length) {
            const r = entities.map(async (entity: Image) => await this.map(entity));
            return Promise.all(r);
        }
    }
}
