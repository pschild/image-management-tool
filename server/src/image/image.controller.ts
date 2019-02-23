import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode } from '@nestjs/common';
import { ImageService } from './image.service';
import { UpdateResult } from 'typeorm';
import { PathHelperService } from '../util/path-helper/path-helper.service';
import { FolderService } from '../folder/folder.service';
import { ImageDto } from '../dto/Image.dto';
import { ImageDtoFactory } from '../factory/image-dto.factory';

@Controller('image')
export class ImageController {
    constructor(
        private readonly imageService: ImageService,
        private readonly folderService: FolderService,
        private readonly pathHelperService: PathHelperService,
        private readonly dtoFactory: ImageDtoFactory
    ) { }

    @Post()
    async create(@Body() data): Promise<ImageDto> {
        return this.dtoFactory.toDto(await this.imageService.create(data));
    }

    @Post('byPath')
    async createByPath(@Body() body: {absolutePath: string; name: string; extension: string; }): Promise<ImageDto> {
        const parentPathParts = this.pathHelperService.getParentFolderPath(body.absolutePath);
        const parentFolder = await this.folderService.getFolderOrCreateByPath(parentPathParts);

        return this.dtoFactory.toDto(
            await this.imageService.create({
                name: body.name,
                originalName: body.name,
                extension: body.extension,
                parentFolder: parentFolder
            })
        );
    }

    @Get()
    async findAll(): Promise<ImageDto[]> {
        return this.dtoFactory.toDtos(await this.imageService.findAll(true));
    }

    @Get(':id')
    async findOne(@Param('id') id): Promise<ImageDto> {
        return this.dtoFactory.toDto(await this.imageService.findOne(id, true));
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
