import { IImageEntityDto } from '../../../../../shared/IImageEntity.dto';
import { IMergedImageDto } from '../../../../../shared/IMergedImage.dto';

export class ImagesLoaded {
    static readonly type = '[ExplorerImage] ImagesLoaded';
    constructor(public images: IMergedImageDto[]) { }
}

export class CreateImageByPath {
    static readonly type = '[ExplorerImage] CreateImage';
    constructor(public absolutePath: string, public name: string, public extension: string) { }
}

export class ImageCreated {
    static readonly type = '[ExplorerImage] ImageCreated';
    constructor(public createdImage: IImageEntityDto) { }
}

export class RemoveImage {
    static readonly type = '[ExplorerImage] RemoveImage';
    constructor(public image: IMergedImageDto) { }
}
