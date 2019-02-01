import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode } from '@nestjs/common';
import { FolderService } from './folder.service';
import { UpdateResult } from 'typeorm';
import { IFolderEntityDto } from '../../../shared/dto/IFolderEntity.dto';
import { FolderEntityToDtoMapper } from '../mapper/FolderEntityToDto.mapper';

@Controller('folder')
export class FolderController {
    constructor(
        private readonly folderService: FolderService,
        private readonly folderEntityToDtoMapper: FolderEntityToDtoMapper
    ) { }

    @Post()
    async create(@Body() data): Promise<IFolderEntityDto> {
        return this.folderEntityToDtoMapper.map(await this.folderService.create(data));
    }

    @Post('byPath')
    async createByPath(@Body() body: {path: string}): Promise<IFolderEntityDto> {
        return this.folderEntityToDtoMapper.map(await this.folderService.createFolderByPath(decodeURI(body.path)));
    }

    @Get()
    async findAll(): Promise<IFolderEntityDto[]> {
        return this.folderEntityToDtoMapper.mapAll(await this.folderService.findAll());
    }

    @Get(':id')
    async findOne(@Param('id') id): Promise<IFolderEntityDto> {
        return this.folderEntityToDtoMapper.map(await this.folderService.findOne(id));
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
