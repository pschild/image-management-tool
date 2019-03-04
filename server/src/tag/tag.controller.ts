import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, UseFilters } from '@nestjs/common';
import { TagService } from './tag.service';
import { UpdateResult } from 'typeorm';
import { DtoTransformerService } from '../transformer/dto-transformer.service';
import { TagDto } from '../dto/Tag.dto';
import { Tag } from '../entity/tag.entity';
import { UniqueConstraintViolationException } from '../../../shared/exception/unique-constraint-violation.exception';
import { SqLiteException } from '../../../shared/exception/sqlite.exception';
import { SqLiteExceptionFilter } from '../filter/sqlite-exception.filter';

@Controller('tag')
export class TagController {
    constructor(
        private readonly tagService: TagService,
        private readonly transformer: DtoTransformerService
    ) { }

    @Post()
    @UseFilters(SqLiteExceptionFilter)
    async create(@Body() data): Promise<TagDto> {
        const tag: Tag = await this.tagService.create(data).catch(error => {
            if (error.code === 'SQLITE_CONSTRAINT') {
                throw new UniqueConstraintViolationException(`Der Tag "${data.label}" existiert bereits.`);
            }
            throw new SqLiteException({status: 500, userMessage: error.message, technicalMessage: error.message});
        });
        return this.transformer.transform(tag, TagDto);
    }

    @Get()
    async findAll(): Promise<TagDto[]> {
        const tags: Tag[] = await this.tagService.findAll();
        return this.transformer.transformList(tags, TagDto);
    }

    @Get(':id')
    async findOne(@Param('id') id): Promise<TagDto> {
        const tag: Tag = await this.tagService.findOne(id, true);
        return this.transformer.transform(tag, TagDto);
    }

    @Put(':id')
    update(@Param('id') id, @Body() data): Promise<UpdateResult> {
        return this.tagService.update(id, data);
    }

    @Delete(':id')
    @HttpCode(204)
    async remove(@Param('id') id): Promise<void> {
        await this.tagService.remove(id);
        return;
    }
}
