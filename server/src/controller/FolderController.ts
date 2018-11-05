import { JsonController, Get, Param, Put, Body } from 'routing-controllers';
import { getRepository } from 'typeorm';
import { Folder } from '../entity/Folder';
import * as path from 'path';

@JsonController()
export class FolderController {

    private repository = getRepository(Folder);

    @Get('/folder')
    all() {
        return this.repository.find();
    }

    @Get('/folder/:id')
    one(@Param('id') id: number) {
        return this.repository.findOne(id);
    }

    @Put('/folder/:id')
    updateById(@Param('id') id: number, @Body() body: any) {
        return this.repository.update(id, body);
    }

    update(folder: Folder) {
        return this.repository.save(folder);
    }

    oneByName(name: string) {
        return this.repository.findOne({ name });
    }

    async findDirectDescendantsByFolder(folder: Folder): Promise<Folder[]> {
        return await this.repository.find({ where: { parent: folder } });
    }

    async findDirectDescendantsByFolderId(folderId: number): Promise<Folder[]> {
        const folder = await this.repository.findOne(folderId);
        return this.findDirectDescendantsByFolder(folder);
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

    async getFolderByPath(givenPath: string, createIfNotExist: boolean = false): Promise<Folder> {
        let pathParts = givenPath.split(path.sep);
        pathParts = this.removeDotFromSystemDriveLetter(pathParts);

        let parent: Folder = null;
        let foundFolder: Folder;
        // analyze the given path from beginning to end: try to find each folder in database by name and parent folder
        // optional: if parameter createIfNotExist is set to true, missing folders will be created automatically
        for (const pathName of pathParts) {
            foundFolder = await this.repository.findOne({ name: pathName, parent: parent });
            if (foundFolder) {
                parent = foundFolder;
            } else {
                if (createIfNotExist) {
                    const newFolder = new Folder();
                    newFolder.name = pathName;
                    newFolder.parent = parent;
                    foundFolder = await this.repository.save(newFolder);
                    parent = foundFolder;
                } else {
                    return undefined;
                }
            }
        }
        return foundFolder;
    }

    async findRootFolders(): Promise<Folder[]> {
        return await this.repository.find({ where: { parent: null } });
    }

    removeDotFromSystemDriveLetter(pathParts: string[]): string[] {
        // Workaround: check if we have only a system drive letter, e.g. C: or D:
        // In those cases, path.join() returns the drive letter with a dot: path.join('C:') === 'C:.'
        // Because this name cannot be found in database, remove the dot.
        // https://github.com/nodejs/node/issues/14405
        if (pathParts.length && pathParts[0].match(/^[A-Z]{1}:\.$/) !== null) {
            pathParts[0] = pathParts[0].substr(0, 2); // C:. => C:
        }
        return pathParts;
    }
}
