import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../entity/image.entity';
import { UtilModule } from '../util/util.module';
import { DtoTransformerModule } from '../transformer/dto-transformer.module';
import { FolderModule } from '../../../client/src/app/folder/folder.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Image]),
        UtilModule,
        FolderModule,
        DtoTransformerModule
    ],
    controllers: [ImageController],
    providers: [ImageService],
    exports: [ImageService]
})
export class ImageModule { }
