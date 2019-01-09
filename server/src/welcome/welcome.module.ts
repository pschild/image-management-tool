import { Module } from '@nestjs/common';
import { WelcomeController } from './welcome.controller';
import { WelcomeService } from './welcome.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from '../entity/Folder';

@Module({
    imports: [TypeOrmModule.forFeature([Folder])],
    controllers: [WelcomeController],
    providers: [WelcomeService]
})
export class WelcomeModule { }
