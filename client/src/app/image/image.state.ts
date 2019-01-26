import { State, Selector, Action, StateContext } from '@ngxs/store';
import { ImageService } from './image.service';
import { tap } from 'rxjs/operators';
import { ImagesLoaded, ImageCreated, RemoveImage } from './image.actions';
import { RefreshContent } from '../explorer/explorer.actions';
import { ImageDto } from '../../../../shared/ImageDto';
import { IImageDto } from '../../../../shared/interface/IImageDto';

export interface ImageStateModel {
    images: ImageDto[];
}

@State<ImageStateModel>({
    name: 'image',
    defaults: {
        images: []
    }
})
export class ImageState {
    constructor(private imageService: ImageService) { }

    @Selector()
    static images(state: ImageStateModel) {
        return state.images;
    }

    @Action(ImagesLoaded)
    imagesLoaded({ patchState }: StateContext<ImageStateModel>, action: ImagesLoaded) {
        patchState({
            images: action.images
        });
    }

    @Action(ImageCreated)
    imageCreated({ getState, patchState }: StateContext<ImageStateModel>, action: ImageCreated) {
        const state = getState();
        const newImageState: ImageDto[] = state.images.map((image: ImageDto) => {
            if (image.name === action.createdImage.name) {
                image.addedInFs = false;
            }
            return image;
        });
        patchState({
            images: newImageState
        });
    }

    @Action(RemoveImage)
    removeImage({ dispatch }: StateContext<ImageStateModel>, action: RemoveImage) {
        return this.imageService.removeImage(action.image)
            .pipe(
                tap((result: IImageDto) => {
                    return dispatch(new RefreshContent());
                })
            );
    }
}
