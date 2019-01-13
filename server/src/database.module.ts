import { Global, DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormOptions } from './typeOrmConfig';
import { ConfigService } from './config.service';

@Global()
export class DatabaseModule {
    public static forRoot(): DynamicModule {
        return {
            module: DatabaseModule,
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
        };
    }
}
