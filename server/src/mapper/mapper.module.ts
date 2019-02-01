import { Module, forwardRef } from '@nestjs/common';
import { FolderEntityToDtoMapper } from './FolderEntityToDto.mapper';
import { FolderModule } from '../folder/folder.module';
import { ImageEntityToDtoMapper } from './ImageEntityToDto.mapper';

@Module({
    imports: [
        // because FolderModule needs FolderEntityToDtoMapper
        forwardRef(() => FolderModule)
    ],
    providers: [
        FolderEntityToDtoMapper,
        ImageEntityToDtoMapper
    ],
    exports: [
        FolderEntityToDtoMapper,
        ImageEntityToDtoMapper
    ]
})
export class MapperModule { }
