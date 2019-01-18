import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ImageService } from './image.service';
import { Image } from '../entity/image.entity';
import { UpdateResult } from 'typeorm';

@Controller('image')
export class ImageController {
    constructor(private readonly imageService: ImageService) { }

    @Post()
    create(@Body() data): Promise<Image> {
        return this.imageService.create(data);
    }

    @Get()
    findAll(): Promise<Image[]> {
        return this.imageService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id): Promise<Image> {
        return this.imageService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id, @Body() data): Promise<UpdateResult> {
        return this.imageService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id): Promise<Image> {
        return this.imageService.remove(id);
    }
}
