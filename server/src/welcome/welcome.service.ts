import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { Folder } from '../entity/Folder';

@Injectable()
export class WelcomeService {

    private r = getRepository(Folder);

    constructor(
        /*@InjectRepository(Folder) private readonly folderRepository: Repository<Folder>*/
    ) { }

    genereateGreeting(name: string): string {
        return `Hello, ${name}`;
    }

    async findAllFolders(): Promise<Folder[]> {
        return this.r.find();
    }
}
