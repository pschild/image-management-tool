import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DtoTransformerModule } from '../transformer/dto-transformer.module';
import { TagController } from './tag.controller';
import { Tag } from '../entity/tag.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Tag]),
        DtoTransformerModule
    ],
    controllers: [TagController],
    providers: [TagService]
})
export class TagModule { }
