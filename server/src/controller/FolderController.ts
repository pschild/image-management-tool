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
}
