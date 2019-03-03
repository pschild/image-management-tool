import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode } from '@nestjs/common';
import { ImageService } from './image.service';
import { UpdateResult } from 'typeorm';
import { PathHelperService } from '../util/path-helper/path-helper.service';
import { FolderService } from '../folder/folder.service';
import { ImageDto } from '../dto/Image.dto';
import { Image } from '../entity/image.entity';
import * as path from 'path';
import { DtoTransformerService } from '../transformer/dto-transformer.service';

@Controller('image')
export class ImageController {
    constructor(
        private readonly imageService: ImageService,
        private readonly folderService: FolderService,
        private readonly pathHelperService: PathHelperService,
        private readonly transformer: DtoTransformerService
    ) { }

    @Post()
    async create(@Body() data): Promise<ImageDto> {
        const image: Image = await this.imageService.create(data);
        const dto: ImageDto = this.transformer.transform(image, ImageDto);
        return dto;
    }

    @Post('byPath')
    async createByPath(@Body() body: {absolutePath: string; name: string; extension: string; }): Promise<ImageDto> {
        const parentPathParts = this.pathHelperService.getParentFolderPath(body.absolutePath);
        const parentFolder = await this.folderService.getFolderOrCreateByPath(parentPathParts);
        const image: Image = await this.imageService.create({
            name: body.name,
            originalName: body.name,
            extension: body.extension,
            parentFolder: parentFolder
        });
        const dto: ImageDto = this.transformer.transform(image, ImageDto);
        return dto;
    }

    @Get()
    async findAll(): Promise<ImageDto[]> {
        const images: Image[] = await this.imageService.findAll(true);
        const dtos: ImageDto[] = this.transformer.transformList(images, ImageDto);
        return Promise.all(dtos.map(async (dto: ImageDto) => {
            const parentFolderPath = await this.folderService.buildPathByFolderId(dto.parentFolder.id);
            dto.absolutePath = `${parentFolderPath}${path.sep}${dto.name}.${dto.extension}`;
            return dto;
        }));
    }

    @Get(':id')
    async findOne(@Param('id') id): Promise<ImageDto> {
        const image: Image = await this.imageService.findOne(id, true);
        const dto: ImageDto = this.transformer.transform(image, ImageDto);
        dto.absolutePath = await this.folderService.buildPathByFolderId(image.parentFolder.id);
        return dto;
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
