import { Module } from '@nestjs/common';
import { PathHelperService } from './pathHelper.service';

@Module({
    providers: [PathHelperService],
    exports: [PathHelperService]
})
export class UtilModule { }
