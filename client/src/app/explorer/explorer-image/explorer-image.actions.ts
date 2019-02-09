import { IMergedImageDto } from '../../../../../shared/dto/IMergedImage.dto';
import { IImageDto } from '../../../../../shared/dto/IImage.dto';

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
    constructor(public createdImage: IImageDto) { }
}

export class RemoveImage {
    static readonly type = '[ExplorerImage] RemoveImage';
    constructor(public image: IMergedImageDto) { }
}
