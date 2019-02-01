import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { IMapper } from './IMapper';
import { FolderService } from '../folder/folder.service';
import { IImageEntity } from '../../../shared/IImageEntity';
import { IImageEntityDto } from '../../../shared/IImageEntity.dto';
import * as path from 'path';
import { FolderEntityToDtoMapper } from './FolderEntityToDto.mapper';
import { PersonEntityToDtoMapper } from './PersonEntityToDto.mapper';
import { TagEntityToDtoMapper } from './TagEntityToDto.mapper';
import { PlaceEntityToDtoMapper } from './PlaceEntityToDto.mapper';

@Injectable()
export class ImageEntityToDtoMapper implements IMapper<IImageEntity, IImageEntityDto> {

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

    async map(entity: IImageEntity): Promise<IImageEntityDto> {
        if (entity) {
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

    mapAll(entities: IImageEntity[]): Promise<IImageEntityDto[]> {
        const r = entities.map(async (entity: IImageEntity) => await this.map(entity));
        return Promise.all(r);
    }
}
