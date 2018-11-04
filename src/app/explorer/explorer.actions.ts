import { FileSystemError } from '../../../domain/error/FileSystemError';

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

export class LoadContentFailed {
    static readonly type = '[Explorer] LoadContentFailed';
    constructor(public error: FileSystemError) { }
}
