import { FileSystemError } from '../../../domain/error/FileSystemError';

export class LoadHomeDirectory {
    static readonly type = '[Explorer] LoadHomeDirectory';
}

export class LoadContentByPath {
    static readonly type = '[Explorer] LoadContentByPath';
    constructor(public path: string[]) { }
}

export class NavigateToFolder {
    static readonly type = '[Explorer] NavigateToFolder';
    constructor(public folderName: string) { }
}

export class NavigateUp {
    static readonly type = '[Explorer] NavigateUp';
}

export class RefreshContent {
    static readonly type = '[Explorer] RefreshContent';
}

export class LoadContentFailed {
    static readonly type = '[Explorer] LoadContentFailed';
    constructor(public error: FileSystemError) { }
}
