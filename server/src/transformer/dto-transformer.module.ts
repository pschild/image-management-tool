import { Module } from '@nestjs/common';
import { DtoTransformerService } from './dto-transformer.service';

@Module({
    imports: [],
    providers: [DtoTransformerService],
    exports: [DtoTransformerService]
})
export class DtoTransformerModule { }
