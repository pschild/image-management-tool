import { Controller, Get, Param } from '@nestjs/common';
import { WelcomeService } from './welcome.service';
import { Folder } from '../entity/Folder';
import { getManager } from 'typeorm';
import { Person } from '../entity/Person';
import { Place } from '../entity/Place';
import { Image } from '../entity/Image';
import { Tag } from '../entity/Tag';

@Controller('welcome')
export class WelcomeController {
    constructor(private readonly welcomeService: WelcomeService) { }

    @Get('greet/:name')
    greet(@Param('name') name: string): string {
        return this.welcomeService.generateGreeting(name);
    }

    @Get('dbtest')
    async test() {
        return this.welcomeService.findAllFolders();
    }
}
