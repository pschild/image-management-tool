import { Global, DynamicModule } from '@nestjs/common';
import { ConfigService } from './config.service';
import { IAppConfig } from './IAppConfig';

@Global()
export class ConfigModule {
    public static forRoot(config: IAppConfig): DynamicModule {
        return {
            module: ConfigModule,
            providers: [
                {
                    provide: ConfigService,
                    useValue: new ConfigService(config)
                }
            ],
            exports: [ConfigService]
        };
    }
}
