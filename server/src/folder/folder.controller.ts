import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode } from '@nestjs/common';
import { FolderService } from './folder.service';
import { UpdateResult } from 'typeorm';
import { FolderDto } from '../dto/Folder.dto';
import { Folder } from '../entity/folder.entity';
import { DtoTransformerService } from '../transformer/dto-transformer.service';

@Controller('folder')
export class FolderController {
    constructor(
        private readonly folderService: FolderService,
        private readonly transformer: DtoTransformerService
    ) { }

    @Post()
    async create(@Body() data): Promise<FolderDto> {
        const folder: Folder = await this.folderService.create(data);
        const dto: FolderDto = this.transformer.transform(folder, FolderDto);
        dto.absolutePath = await this.folderService.buildPathByFolderId(folder.id);
        return dto;
    }

    @Post('byPath')
    async createByPath(@Body() body: {path: string}): Promise<FolderDto> {
        const folder: Folder = await this.folderService.createFolderByPath(decodeURI(body.path));
        const dto: FolderDto = this.transformer.transform(folder, FolderDto);
        dto.absolutePath = await this.folderService.buildPathByFolderId(folder.id);
        return dto;
    }

    @Get()
    async findAll(): Promise<FolderDto[]> {
        const folders: Folder[] = await this.folderService.findAll();
        const dtos: FolderDto[] = this.transformer.transformList(folders, FolderDto);
        return Promise.all(dtos.map(async (dto: FolderDto) => {
            dto.absolutePath = await this.folderService.buildPathByFolderId(dto.id);
            return dto;
        }));
    }

    @Get(':id')
    async findOne(@Param('id') id): Promise<FolderDto> {
        const folder: Folder = await this.folderService.findOne(id, true);
        const dto: FolderDto = this.transformer.transform(folder, FolderDto);
        dto.absolutePath = await this.folderService.buildPathByFolderId(dto.id);
        return dto;
    }

    @Put(':id')
    update(@Param('id') id, @Body() data): Promise<UpdateResult> {
        return this.folderService.update(id, data);
    }

    @Delete(':id')
    @HttpCode(204)
    async remove(@Param('id') id): Promise<void> {
        await this.folderService.remove(id);
        return;
    }
}
