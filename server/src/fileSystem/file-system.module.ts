import { Module } from '@nestjs/common';
import { FileSystemService } from './file-system.service';
import { UtilModule } from '../util/util.module';

@Module({
    imports: [UtilModule],
    providers: [FileSystemService],
    exports: [FileSystemService]
})
export class FileSystemModule { }
