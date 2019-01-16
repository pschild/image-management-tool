import { Module } from '@nestjs/common';
import { ExplorerController } from './explorer.controller';
import { FileSystemModule } from '../fileSystem/fileSystem.module';
import { FolderModule } from '../folder/folder.module';
import { ImageModule } from '../image/image.module';
import { ExplorerService } from './explorer.service';

@Module({
    imports: [
        FileSystemModule,
        FolderModule,
        ImageModule
    ],
    controllers: [ExplorerController],
    providers: [ExplorerService]
})
export class ExplorerModule { }
