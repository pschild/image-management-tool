import { Module } from '@nestjs/common';
import { PathHelperService } from './path-helper/path-helper.service';

@Module({
    providers: [PathHelperService],
    exports: [PathHelperService]
})
export class UtilModule { }
