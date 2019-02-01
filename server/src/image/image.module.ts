import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../entity/image.entity';
import { MapperModule } from '../mapper/mapper.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Image]),
        MapperModule
    ],
    controllers: [ImageController],
    providers: [ImageService],
    exports: [ImageService]
})
export class ImageModule { }
