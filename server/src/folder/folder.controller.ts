import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { FolderService } from './folder.service';
import { UpdateResult } from 'typeorm';
import { IFolderEntityDto } from '../../../shared/IFolderEntity.dto';
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
    async remove(@Param('id') id): Promise<IFolderEntityDto> {
        return this.folderEntityToDtoMapper.map(await this.folderService.remove(id));
    }
}
