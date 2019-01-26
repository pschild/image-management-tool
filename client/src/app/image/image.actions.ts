import { ImageDto } from '../../../../shared/ImageDto';

export class ImagesLoaded {
    static readonly type = '[Image] ImagesLoaded';
    constructor(public images: ImageDto[]) { }
}

export class ImageCreated {
    static readonly type = '[Image] ImageCreated';
    constructor(public createdImage: ImageDto) { }
}

export class RemoveImage {
    static readonly type = '[Image] RemoveImage';
    constructor(public image: ImageDto) { }
}
