import { FolderDto } from '../../../../shared/FolderDto';

export class FoldersLoaded {
    static readonly type = '[Folder] FoldersLoaded';
    constructor(public folders: FolderDto[]) { }
}

export class FolderCreated {
    static readonly type = '[Folder] FolderCreated';
    constructor(public createdFolder: FolderDto) { }
}

export class RemoveFolder {
    static readonly type = '[Folder] RemoveFolder';
    constructor(public folder: FolderDto) { }
}
