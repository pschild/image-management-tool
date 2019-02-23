import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode } from '@nestjs/common';
import { FolderService } from './folder.service';
import { UpdateResult } from 'typeorm';
import { FolderDto } from '../dto/Folder.dto';
import { FolderDtoFactory } from '../factory/folder-dto.factory';

@Controller('folder')
export class FolderController {
    constructor(
        private readonly folderService: FolderService,
        private readonly dtoFactory: FolderDtoFactory
    ) { }

    @Post()
    async create(@Body() data): Promise<FolderDto> {
        return this.dtoFactory.toDto(await this.folderService.create(data));
    }

    @Post('byPath')
    async createByPath(@Body() body: {path: string}): Promise<FolderDto> {
        return this.dtoFactory.toDto(await this.folderService.createFolderByPath(decodeURI(body.path)));
    }

    @Get()
    async findAll(): Promise<FolderDto[]> {
        return this.dtoFactory.toDtos(await this.folderService.findAll());
    }

    @Get(':id')
    async findOne(@Param('id') id): Promise<FolderDto> {
        return this.dtoFactory.toDto(await this.folderService.findOne(id, true));
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
