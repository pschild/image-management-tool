import { Module, Global } from '@nestjs/common';
import { FolderModule } from '../folder/folder.module';
import { FolderDtoFactory } from './folder-dto.factory';
import { ImageDtoFactory } from './image-dto.factory';
import { TagDtoFactory } from './tag-dto.factory';
import { PlaceDtoFactory } from './place-dto.factory';
import { PersonDtoFactory } from './person-dto.factory';

@Global() // Makes the module global-scoped, so that it will be available for all existing modules
@Module({
    imports: [
        FolderModule
    ],
    providers: [
        FolderDtoFactory,
        ImageDtoFactory,
        TagDtoFactory,
        PlaceDtoFactory,
        PersonDtoFactory
    ],
    exports: [
        FolderDtoFactory,
        ImageDtoFactory,
        TagDtoFactory,
        PlaceDtoFactory,
        PersonDtoFactory
    ]
})
export class FactoryModule { }
