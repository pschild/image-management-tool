import { ImageDto } from '../../../../../shared/ImageDto';

export class ImagesLoaded {
    static readonly type = '[ExplorerImage] ImagesLoaded';
    constructor(public images: ImageDto[]) { }
}

export class ImageCreated {
    static readonly type = '[ExplorerImage] ImageCreated';
    constructor(public createdImage: ImageDto) { }
}

export class RemoveImage {
    static readonly type = '[ExplorerImage] RemoveImage';
    constructor(public image: ImageDto) { }
}
