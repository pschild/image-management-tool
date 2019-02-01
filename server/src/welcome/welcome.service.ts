import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from '../entity/folder.entity';
import { get } from 'request-promise';
import * as path from 'path';
import * as afs from 'async-file';
import { IFolderEntity } from '../interface/IFolderEntity';

@Injectable()
export class WelcomeService {

    constructor(
        @InjectRepository(Folder)
        private readonly repository: Repository<Folder>
    ) { }

    generateGreeting(name: string): string {
        return `Hello, ${name}`;
    }

    async findAllFolders(): Promise<IFolderEntity[]> {
        return this.repository.find();
    }

    downloadImage(url, directory, name) {
        return new Promise<string>(async resolve => {
            await get(url)
                .pipe(afs.createWriteStream(
                    path.join(path.dirname(directory), name)
                ))
                .on('close', () => resolve(path.join(path.dirname(directory), name)));
        });
    }
}
