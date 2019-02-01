import { Module, forwardRef } from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from '../entity/folder.entity';
import { UtilModule } from '../util/util.module';
import { MapperModule } from '../mapper/mapper.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Folder]),
        UtilModule,
        // because MapperModule needs FolderService
        forwardRef(() => MapperModule)
    ],
    controllers: [FolderController],
    providers: [FolderService],
    exports: [FolderService]
})
export class FolderModule { }
