import { Module } from '@nestjs/common';
import { ExplorerService } from './explorer.service';
import { ExplorerController } from './explorer.controller';

@Module({
    imports: [],
    controllers: [ExplorerController],
    providers: [ExplorerService]
})
export class ExplorerModule { }
