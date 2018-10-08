import { JsonController, Get, Param } from 'routing-controllers';
import { getTreeRepository } from 'typeorm';
import { Folder } from '../entity/Folder';
import * as path from 'path';

@JsonController()
export class FolderController {

    private repository = getTreeRepository(Folder);

    @Get('/folders')
    all() {
        return this.repository.find();
    }

    @Get('/folders/:id')
    one(@Param('id') id: number) {
        return this.repository.findOne(id);
    }

    oneByName(name: string) {
        return this.repository.findOne({ name });
    }

    async findDirectDescendants(folderId: number) {
        const startFolder = await this.repository.findOne(folderId);
        const descendantsTree = await this.repository.findDescendantsTree(startFolder);
        return descendantsTree.children;
    }

    async buildPathByFolderId(folderId: number): Promise<string> {
        const pathParts = [];

        const startFolder = await this.repository.findOne(folderId);
        const parentsTree = await this.repository.findAncestorsTree(startFolder);

        let folder = parentsTree;
        let stop = false;
        while (!stop) {
            pathParts.push(folder.name);
            if (!folder.parent) {
                stop = true;
            } else {
                folder = folder.parent;
            }
        }

        return path.join(...pathParts.reverse());
    }

    async getFolderByPath(givenPath: string): Promise<Folder> {
        let pathParts = givenPath.split(path.sep);
        pathParts = this.removeDotFromSystemDriveLetter(pathParts);

        let parentFolder = null;
        let foundFolder;
        for (const part of pathParts) {
            foundFolder = await this.repository.findOne({ name: part, parent: parentFolder });
            if (foundFolder) {
                parentFolder = foundFolder;
            } else {
                return undefined;
            }
        }
        return foundFolder;
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
