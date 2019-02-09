import { Injectable } from '@nestjs/common';
import { IMapper } from './IMapper';
import { FolderService } from '../folder/folder.service';
import { Folder } from '../entity/folder.entity';
import { FolderDto } from '../dto/Folder.dto';

@Injectable()
export class FolderEntityToDtoMapper implements IMapper<Folder, FolderDto> {

    constructor(private readonly folderService: FolderService) { }

    async map(entity: Folder): Promise<FolderDto> {
        if (entity) {
            return {
                id: entity.id,
                name: entity.name,
                absolutePath: await this.folderService.buildPathByFolderId(entity.id),
                parent: await this.map(entity.parent),
                children: await this.mapAll(entity.children)
            };
        }
    }

    mapAll(entities: Folder[]): Promise<FolderDto[]> {
        if (entities && entities.length) {
            const r = entities.map(async (entity: Folder) => await this.map(entity));
            return Promise.all(r);
        }
    }
}
