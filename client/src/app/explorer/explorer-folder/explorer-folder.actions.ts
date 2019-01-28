import { FolderDto } from '../../../../../shared/FolderDto';

export class FoldersLoaded {
    static readonly type = '[ExplorerFolder] FoldersLoaded';
    constructor(public folders: FolderDto[]) { }
}

export class FolderCreated {
    static readonly type = '[ExplorerFolder] FolderCreated';
    constructor(public createdFolder: FolderDto) { }
}

export class RemoveFolder {
    static readonly type = '[ExplorerFolder] RemoveFolder';
    constructor(public folder: FolderDto) { }
}
