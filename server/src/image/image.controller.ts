import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ImageService } from './image.service';
import { UpdateResult } from 'typeorm';
import { ImageEntityToDtoMapper } from '../mapper/ImageEntityToDto.mapper';
import { IImageEntityDto } from '../../../shared/IImageEntity.dto';

@Controller('image')
export class ImageController {
    constructor(
        private readonly imageService: ImageService,
        private readonly imageEntityToDtoMapper: ImageEntityToDtoMapper
    ) { }

    @Post()
    async create(@Body() data): Promise<IImageEntityDto> {
        return this.imageEntityToDtoMapper.map(await this.imageService.create(data));
    }

    @Get()
    async findAll(): Promise<IImageEntityDto[]> {
        return this.imageEntityToDtoMapper.mapAll(await this.imageService.findAll());
    }

    @Get(':id')
    async findOne(@Param('id') id): Promise<IImageEntityDto> {
        return this.imageEntityToDtoMapper.map(await this.imageService.findOne(id));
    }

    @Put(':id')
    update(@Param('id') id, @Body() data): Promise<UpdateResult> {
        return this.imageService.update(id, data);
    }

    @Delete(':id')
    async remove(@Param('id') id): Promise<IImageEntityDto> {
        return this.imageEntityToDtoMapper.map(await this.imageService.remove(id));
    }
}
