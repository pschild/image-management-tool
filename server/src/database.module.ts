import { Global, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormOptions } from './typeOrmConfig';

@Global()
export class DatabaseModule {
    public static forRoot(config: any): DynamicModule { // TODO: interface for config
        return {
            module: DatabaseModule,
            imports: [
                TypeOrmModule.forRootAsync({
                    useFactory: async () => {
                        return ormOptions(config);
                    }
                })
            ]
        };
    }
}
