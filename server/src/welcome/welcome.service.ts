import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from '../entity/Folder';

@Injectable()
export class WelcomeService {

    constructor(
        @InjectRepository(Folder)
        private readonly repository: Repository<Folder>
    ) { }

    generateGreeting(name: string): any {
        return {
            greets: `Hello, ${name}`
        };
    }

    async findAllFolders(): Promise<Folder[]> {
        return this.repository.find();
    }
}
