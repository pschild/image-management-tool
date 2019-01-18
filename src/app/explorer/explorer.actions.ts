import { FileSystemException } from '../../../domain/exception/file-system.exception';

export class LoadHomeDirectory {
    static readonly type = '[Explorer] LoadHomeDirectory';
}

export class LoadContentByPath {
    static readonly type = '[Explorer] LoadContentByPath';
    constructor(public path: string[]) { }
}

export class CreateFolderByPath {
    static readonly type = '[Explorer] CreateFolder';
    constructor(public path: string) { }
}

export class NavigateToFolder {
    static readonly type = '[Explorer] NavigateToFolder';
    constructor(public folderName: string) { }
}

export class NavigateBack {
    static readonly type = '[Explorer] NavigateBack';
}

export class RefreshContent {
    static readonly type = '[Explorer] RefreshContent';
}

export class LoadContentFailed {
    static readonly type = '[Explorer] LoadContentFailed';
    constructor(public error: FileSystemException) { }
}

export class RelocateFolder {
    static readonly type = '[Explorer] RelocateFolder';
    constructor(public oldPath: string, public newPath: string) { }
}
