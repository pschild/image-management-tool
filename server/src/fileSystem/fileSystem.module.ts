import { Module } from '@nestjs/common';
import { FileSystemService } from './fileSystem.service';
import { UtilModule } from '../util/util.module';

@Module({
    imports: [UtilModule],
    providers: [FileSystemService],
    exports: [FileSystemService]
})
export class FileSystemModule { }
