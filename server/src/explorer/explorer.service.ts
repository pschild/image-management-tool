import { Injectable } from '@nestjs/common';

@Injectable()
export class ExplorerService {
    getHello(): string {
        return 'Hello World!';
    }
}
