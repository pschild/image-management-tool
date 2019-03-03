import { Module } from '@nestjs/common';
import { ExplorerController } from './explorer.controller';
import { FileSystemModule } from '../fileSystem/file-system.module';
import { FolderModule } from '../folder/folder.module';
import { ImageModule } from '../image/image.module';
import { ExplorerService } from './explorer.service';
import { DtoTransformerModule } from '../transformer/dto-transformer.module';

@Module({
    imports: [
        FileSystemModule,
        FolderModule,
        ImageModule,
        DtoTransformerModule
    ],
    controllers: [ExplorerController],
    providers: [ExplorerService]
})
export class ExplorerModule { }
