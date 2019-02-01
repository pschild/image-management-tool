import { IMergedFolderDto } from '../../../../../shared/dto/IMergedFolder.dto';
import { IFolderEntityDto } from '../../../../../shared/dto/IFolderEntity.dto';

export class FoldersLoaded {
    static readonly type = '[ExplorerFolder] FoldersLoaded';
    constructor(public folders: IMergedFolderDto[]) { }
}

export class CreateFolderByPath {
    static readonly type = '[ExplorerFolder] CreateFolder';
    constructor(public path: string) { }
}

export class FolderCreated {
    static readonly type = '[ExplorerFolder] FolderCreated';
    constructor(public createdFolder: IFolderEntityDto) { }
}

export class RemoveFolder {
    static readonly type = '[ExplorerFolder] RemoveFolder';
    constructor(public folder: IMergedFolderDto) { }
}
