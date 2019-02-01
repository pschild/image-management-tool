import { Injectable } from '@nestjs/common';
import { IMapper } from './IMapper';
import { FolderService } from '../folder/folder.service';
import { IImageEntity } from '../../../shared/IImageEntity';
import { IImageEntityDto } from '../../../shared/IImageEntity.dto';
import * as path from 'path';

@Injectable()
export class ImageEntityToDtoMapper implements IMapper<IImageEntity, IImageEntityDto> {

    constructor(private readonly folderService: FolderService) { }

    async map(entity: IImageEntity): Promise<IImageEntityDto> {
        const parentFolderPath = await this.folderService.buildPathByFolderId(entity.parentFolder.id);
        const absolutePath = `${parentFolderPath}${path.sep}${entity.name}.${entity.extension}`;
        return {
            id: entity.id,
            name: entity.name,
            extension: entity.extension,
            absolutePath: absolutePath
        };
    }

    mapAll(entities: IImageEntity[]): Promise<IImageEntityDto[]> {
        const r = entities.map(async (entity: IImageEntity) => await this.map(entity));
        return Promise.all(r);
    }
}
