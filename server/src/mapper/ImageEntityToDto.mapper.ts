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
                throw new Error(`Could not find parentFolder. Did you forget to query with relations or disabled eager loading?`);
            }
            const parentFolderPath = await this.folderService.buildPathByFolderId(entity.parentFolder.id);
            const absolutePath = `${parentFolderPath}${path.sep}${entity.name}.${entity.extension}`;

            const dto = new ImageDto();
            dto.id = entity.id;
            dto.name = entity.name;
            dto.extension = entity.extension;
            dto.absolutePath = absolutePath;
            dto.description = entity.description;
            dto.originalName = entity.originalName;
            dto.dateAdded = entity.dateAdded;
            dto.dateFrom = entity.dateFrom;
            dto.dateTo = entity.dateTo;
            dto.parentFolder = await this.folderEntityToDtoMapper.map(entity.parentFolder);
            dto.persons = await this.personEntityToDtoMapper.mapAll(entity.persons);
            dto.place = await this.placeEntityToDtoMapper.map(entity.place);
            dto.tags = await this.tagEntityToDtoMapper.mapAll(entity.tags);
            return dto;
        }
    }

    mapAll(entities: Image[]): Promise<ImageDto[]> {
        if (entities && entities.length) {
            const r = entities.map(async (entity: Image) => await this.map(entity));
            return Promise.all(r);
        }
    }
}
