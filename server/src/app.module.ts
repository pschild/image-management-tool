import { DynamicModule } from '@nestjs/common';
import { ExplorerModule } from './explorer/explorer.module';
import { WelcomeModule } from './welcome/welcome.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { IAppConfig } from './config/IAppConfig';

export class AppModule {
    static forRoot(config: IAppConfig): DynamicModule {
        return {
            module: AppModule,
            imports: [
                ConfigModule.forRoot(config),
                DatabaseModule,
                WelcomeModule,
                ExplorerModule
            ]
        };
    }
}
