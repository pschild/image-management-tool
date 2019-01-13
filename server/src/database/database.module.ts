import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormOptions } from './typeOrmConfig';
import { ConfigService } from '../config/config.service';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return ormOptions(
                    configService.get('DB_NAME'),
                    configService.getAppHomeDirPath(),
                    configService.getElectronAppPath()
                );
            }
        })
    ]
})
export class DatabaseModule { }
