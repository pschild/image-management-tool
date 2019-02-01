import { Module, forwardRef } from '@nestjs/common';
import { FolderEntityToDtoMapper } from './FolderEntityToDto.mapper';
import { FolderModule } from '../folder/folder.module';
import { ImageEntityToDtoMapper } from './ImageEntityToDto.mapper';
import { PersonEntityToDtoMapper } from './PersonEntityToDto.mapper';
import { PlaceEntityToDtoMapper } from './PlaceEntityToDto.mapper';
import { TagEntityToDtoMapper } from './TagEntityToDto.mapper';

@Module({
    imports: [
        // because FolderModule needs FolderEntityToDtoMapper
        forwardRef(() => FolderModule)
    ],
    providers: [
        FolderEntityToDtoMapper,
        ImageEntityToDtoMapper,
        PersonEntityToDtoMapper,
        PlaceEntityToDtoMapper,
        TagEntityToDtoMapper
    ],
    exports: [
        FolderEntityToDtoMapper,
        ImageEntityToDtoMapper,
        PersonEntityToDtoMapper,
        PlaceEntityToDtoMapper,
        TagEntityToDtoMapper
    ]
})
export class MapperModule { }
