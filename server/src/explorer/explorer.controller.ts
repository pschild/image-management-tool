import { Controller, Get } from '@nestjs/common';
import { ExplorerService } from './explorer.service';

@Controller('explorer')
export class ExplorerController {
    constructor(private readonly explorerService: ExplorerService) { }

    @Get()
    getHello(): string {
        return this.explorerService.getHello();
    }
}
