import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode } from '@nestjs/common';
import { ImageService } from './image.service';
import { UpdateResult } from 'typeorm';
import { ImageEntityToDtoMapper } from '../mapper/ImageEntityToDto.mapper';
import { IImageEntityDto } from '../../../shared/IImageEntity.dto';
import { PathHelperService } from '../util/path-helper/path-helper.service';
import { FolderService } from '../folder/folder.service';

@Controller('image')
export class ImageController {
    constructor(
        private readonly imageService: ImageService,
        private readonly folderService: FolderService,
        private readonly pathHelperService: PathHelperService,
        private readonly imageEntityToDtoMapper: ImageEntityToDtoMapper
    ) { }

    @Post()
    async create(@Body() data): Promise<IImageEntityDto> {
        return this.imageEntityToDtoMapper.map(await this.imageService.create(data));
    }

    @Post('byPath')
    async createByPath(@Body() body: {absolutePath: string; name: string; extension: string; }): Promise<IImageEntityDto> {
        const parentPathParts = this.pathHelperService.getParentFolderPath(body.absolutePath);
        const parentFolder = await this.folderService.getFolderOrCreateByPath(parentPathParts);

        return this.imageEntityToDtoMapper.map(
            await this.imageService.create({
                name: body.name,
                originalName: body.name,
                extension: body.extension,
                parentFolder: parentFolder
            })
        );
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
    @HttpCode(204)
    async remove(@Param('id') id): Promise<void> {
        await this.imageService.remove(id);
        return;
    }
}
