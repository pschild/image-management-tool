import { Module } from '@nestjs/common';
import { WelcomeController } from './welcome.controller';
import { WelcomeService } from './welcome.service';
import { Image } from '../entity/Image';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [/*TypeOrmModule.forFeature([Image])*/],
    controllers: [WelcomeController],
    providers: [WelcomeService]
})
export class WelcomeModule { }
