import { DynamicModule } from '@nestjs/common';
import { ExplorerModule } from './explorer/explorer.module';
import { WelcomeModule } from './welcome/welcome.module';
import { DatabaseModule } from './database.module';

export class AppModule {
    static forRoot(config: any): DynamicModule { // TODO: interface for config
        return {
            module: AppModule,
            imports: [
                DatabaseModule.forRoot(config),
                WelcomeModule,
                ExplorerModule
            ]
        };
    }
}
