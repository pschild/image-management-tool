import { Module } from '@nestjs/common';
import { ExplorerModule } from './explorer/explorer.module';
import { WelcomeModule } from './welcome/welcome.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        /*TypeOrmModule.forRoot(),*/
        WelcomeModule,
        ExplorerModule
    ]
})
export class AppModule { }
