import { Injectable } from '@nestjs/common';
import { IMapper } from './IMapper';
import { IFolderEntity } from '../interface/IFolderEntity';
import { IFolderEntityDto } from '../../../shared/dto/IFolderEntity.dto';
import { FolderService } from '../folder/folder.service';

@Injectable()
export class FolderEntityToDtoMapper implements IMapper<IFolderEntity, IFolderEntityDto> {

    constructor(private readonly folderService: FolderService) { }

    async map(entity: IFolderEntity): Promise<IFolderEntityDto> {
        if (entity) {
            return {
                id: entity.id,
                name: entity.name,
                absolutePath: await this.folderService.buildPathByFolderId(entity.id)
            };
        }
    }

    mapAll(entities: IFolderEntity[]): Promise<IFolderEntityDto[]> {
        if (entities && entities.length) {
            const r = entities.map(async (entity: IFolderEntity) => await this.map(entity));
            return Promise.all(r);
        }
    }
}
