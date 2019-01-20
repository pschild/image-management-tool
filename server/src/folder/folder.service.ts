import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeepPartial } from 'typeorm';
import { Folder } from '../entity/folder.entity';
import * as path from 'path';
import { PathHelperService } from '../util/path-helper/path-helper.service';

@Injectable()
export class FolderService {
    constructor(
        @InjectRepository(Folder)
        private readonly repository: Repository<Folder>,
        private readonly pathHelperService: PathHelperService
    ) { }

    findOne(id: number, withRelations: boolean = false): Promise<Folder> {
        return this.repository.findOne(id, { relations: withRelations ? ['parent', 'children', 'images'] : [] });
    }

    findOneByName(name: string, withRelations: boolean = false): Promise<Folder> {
        return this.repository.findOne({ name }, { relations: withRelations ? ['parent', 'children', 'images'] : [] });
    }

    findDirectDescendantsByFolder(folder: Folder): Promise<Folder[]> {
        return this.repository.find({ where: { parent: folder } });
    }

    async findDirectDescendantsByFolderId(folderId: number): Promise<Folder[]> {
        const folder = await this.repository.findOne(folderId);
        return this.findDirectDescendantsByFolder(folder);
    }

    findRootFolders(): Promise<Folder[]> {
        return this.repository.find({ where: { parent: null } });
    }

    findAll(): Promise<Folder[]> {
        return this.repository.find();
    }

    create(folder: DeepPartial<Folder>): Promise<Folder> {
        return this.repository.save(folder);
    }

    update(id: number, folder: DeepPartial<Folder>): Promise<UpdateResult> {
        return this.repository.update(id, folder);
    }

    remove(id: number): Promise<Folder> {
        return this.repository.remove(
            this.repository.create({ id })
        );
    }

    async buildPathByFolderId(folderId: number): Promise<string> {
        const pathParts = [];

        let stop = false;
        let folder;
        let idToLoad = folderId;
        while (!stop) {
            folder = await this.repository.findOne(idToLoad, { relations: ['parent'] });
            if (!folder) {
                stop = true;
                return undefined;
            }

            pathParts.push(folder.name);
            if (folder.parent === null) {
                stop = true;
            } else {
                idToLoad = folder.parent.id;
            }
        }

        return pathParts.reverse().join(path.sep);
    }

    async createFolderByPath(givenPath: string): Promise<Folder> {
        const pathParts = givenPath.split(path.sep);

        let parent: Folder = null;
        let foundFolder: Folder;
        // Analyze the given path from beginning to end: try to find each folder in database by name and parent folder
        // Missing folders will be created automatically
        for (let pathName of pathParts) {
            pathName = this.pathHelperService.getAsName(pathName); // Workaround: ensure we get sth like C: when pathName is drive letter
            foundFolder = await this.repository.findOne({ name: pathName, parent: parent });
            if (foundFolder) {
                parent = foundFolder;
            } else {
                const newFolder = new Folder();
                newFolder.name = pathName;
                newFolder.parent = parent;
                foundFolder = await this.repository.save(newFolder);
                parent = foundFolder;
            }
        }
        return foundFolder;
    }

    async getFolderByPath(givenPath: string): Promise<Folder> {
        const pathParts = givenPath.split(path.sep);

        let parent: Folder = null;
        let foundFolder: Folder;
        // Analyze the given path from beginning to end: try to find each folder in database by name and parent folder
        for (let pathName of pathParts) {
            pathName = this.pathHelperService.getAsName(pathName); // Workaround: ensure we get sth like C: when pathName is drive letter
            foundFolder = await this.repository.findOne({ name: pathName, parent: parent });
            if (foundFolder) {
                parent = foundFolder;
            } else {
                return undefined;
            }
        }
        return foundFolder;
    }

    async getFolderOrCreateByPath(givenPath: string): Promise<Folder> {
        let folder = this.getFolderByPath(givenPath);
        if (!folder) {
            folder = this.createFolderByPath(givenPath);
        }
        return folder;
    }
}
