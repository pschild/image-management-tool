import { Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from '../entity/Folder';
import { UtilModule } from '../util/util.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Folder]),
        UtilModule
    ],
    controllers: [FolderController],
    providers: [FolderService],
    exports: [FolderService]
})
export class FolderModule { }
