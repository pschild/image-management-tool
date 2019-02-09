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
            const dto = new FolderDto();
            dto.id = entity.id;
            dto.name = entity.name;
            dto.absolutePath = await this.folderService.buildPathByFolderId(entity.id);
            dto.parent = await this.map(entity.parent);
            dto.children = await this.mapAll(entity.children);
            return dto;
        }
    }

    mapAll(entities: Folder[]): Promise<FolderDto[]> {
        if (entities && entities.length) {
            const r = entities.map(async (entity: Folder) => await this.map(entity));
            return Promise.all(r);
        }
    }
}
