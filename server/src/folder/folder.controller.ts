import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { FolderService } from './folder.service';
import { Folder } from '../entity/folder.entity';
import { UpdateResult } from 'typeorm';

@Controller('folder')
export class FolderController {
    constructor(private readonly folderService: FolderService) { }

    @Post()
    create(@Body() data): Promise<Folder> {
        return this.folderService.create(data);
    }

    @Get()
    findAll(): Promise<Folder[]> {
        return this.folderService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id): Promise<Folder> {
        return this.folderService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id, @Body() data): Promise<UpdateResult> {
        return this.folderService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id): Promise<Folder> {
        return this.folderService.remove(id);
    }
}
