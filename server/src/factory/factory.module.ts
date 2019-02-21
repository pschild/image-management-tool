import { Module, Global } from '@nestjs/common';
import { FolderDtoFactory } from './folderDto.factory';
import { ImageDtoFactory } from './imageDto.factory';
import { FolderModule } from '../folder/folder.module';

@Global() // Makes the module global-scoped, so that it will be available for all existing modules
@Module({
    imports: [
        FolderModule
    ],
    providers: [
        FolderDtoFactory,
        ImageDtoFactory
    ],
    exports: [
        FolderDtoFactory,
        ImageDtoFactory
    ]
})
export class FactoryModule { }
