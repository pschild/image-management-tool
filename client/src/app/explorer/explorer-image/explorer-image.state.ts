import { State, Selector, Action, StateContext } from '@ngxs/store';
import { ImageService } from '../../image/image.service';
import { tap } from 'rxjs/operators';
import { ImagesLoaded, ImageCreated, RemoveImage } from './explorer-image.actions';
import { RefreshContent } from '../explorer.actions';
import { ImageDto } from '../../../../../shared/ImageDto';
import { IImageDto } from '../../../../../shared/interface/IImageDto';

export interface ExplorerImageStateModel {
    images: ImageDto[];
}

@State<ExplorerImageStateModel>({
    name: 'image',
    defaults: {
        images: []
    }
})
export class ExplorerImageState {
    constructor(private imageService: ImageService) { }

    @Selector()
    static images(state: ExplorerImageStateModel) {
        return state.images;
    }

    @Action(ImagesLoaded)
    imagesLoaded({ patchState }: StateContext<ExplorerImageStateModel>, action: ImagesLoaded) {
        patchState({
            images: action.images
        });
    }

    @Action(ImageCreated)
    imageCreated({ getState, patchState }: StateContext<ExplorerImageStateModel>, action: ImageCreated) {
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
    removeImage({ dispatch }: StateContext<ExplorerImageStateModel>, action: RemoveImage) {
        return this.imageService.removeImage(action.image)
            .pipe(
                tap((result: IImageDto) => {
                    return dispatch(new RefreshContent());
                })
            );
    }
}
