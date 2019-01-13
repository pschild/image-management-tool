import { DynamicModule } from '@nestjs/common';
import { ExplorerModule } from './explorer/explorer.module';
import { WelcomeModule } from './welcome/welcome.module';
import { DatabaseModule } from './database.module';
import { ConfigModule } from './config.module';
import { IAppConfig } from './IAppConfig';

export class AppModule {
    static forRoot(config: IAppConfig): DynamicModule {
        return {
            module: AppModule,
            imports: [
                ConfigModule.forRoot(config),
                DatabaseModule.forRoot(),
                WelcomeModule,
                ExplorerModule
            ]
        };
    }
}
