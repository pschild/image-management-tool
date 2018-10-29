import { IImageDto } from './IImageDto';
import { IAddedRemovedState } from './IAddedRemovedState';

export class ImageDto implements IImageDto, IAddedRemovedState {
    id?: number;
    name: string;
    absolutePath: string;
    extension: string;
    addedInFs: boolean;
    removedInFs: boolean;

    constructor(name: string, absolutePath: string, extension: string, addedInFs: boolean, removedInFs: boolean, id?: number) {
        this.name = name;
        this.absolutePath = absolutePath;
        this.extension = extension;
        this.addedInFs = addedInFs;
        this.removedInFs = removedInFs;
        this.id = id;
    }
}
