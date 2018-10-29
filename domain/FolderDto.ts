import { IFolderDto } from './interface/IFolderDto';
import { IAddedRemovedState } from './interface/IAddedRemovedState';

export class FolderDto implements IFolderDto, IAddedRemovedState {
    id?: number;
    name: string;
    absolutePath: string;
    addedInFs: boolean;
    removedInFs: boolean;

    constructor(name: string, absolutePath: string, addedInFs: boolean, removedInFs: boolean, id?: number) {
        this.name = name;
        this.absolutePath = absolutePath;
        this.addedInFs = addedInFs;
        this.removedInFs = removedInFs;
        this.id = id;
    }
}
