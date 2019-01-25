import { FileSystemException } from '../../../../shared/exception/file-system.exception';
import { FolderDto } from '../../../../shared/FolderDto';
import { ImageDto } from '../../../../shared/ImageDto';

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

export class CreateImageByPath {
    static readonly type = '[Explorer] CreateImage';
    constructor(public absolutePath: string, public name: string, public extension: string) { }
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

export class RelocateImage {
    static readonly type = '[Explorer] RelocateImage';
    constructor(public oldPath: string, public newPath: string) { }
}

// TODO: move to FolderActions
export class RemoveFolder {
    static readonly type = '[Explorer] RemoveFolder';
    constructor(public folder: FolderDto) { }
}

// TODO: move to ImageActions
export class RemoveImage {
    static readonly type = '[Explorer] RemoveImage';
    constructor(public image: ImageDto) { }
}
