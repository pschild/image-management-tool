/*import { JsonController, Get, Param, Put, Body } from 'routing-controllers';
import { getRepository } from 'typeorm';
import { Folder } from '../entity/Folder';
import * as path from 'path';
import { PathHelper } from '../util/PathHelper';

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
        const pathParts = givenPath.split(path.sep);

        let parent: Folder = null;
        let foundFolder: Folder;
        // analyze the given path from beginning to end: try to find each folder in database by name and parent folder
        // optional: if parameter createIfNotExist is set to true, missing folders will be created automatically
        for (let pathName of pathParts) {
            pathName = PathHelper.getAsName(pathName); // Workaround: ensure we get sth like C: when pathName is drive letter
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
}*/
