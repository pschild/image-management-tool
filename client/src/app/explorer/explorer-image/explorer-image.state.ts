import { State, Selector, Action, StateContext } from '@ngxs/store';
import { ImageService } from '../../image/image.service';
import { tap } from 'rxjs/operators';
import { ImagesLoaded, RemoveImage, CreateImageByPath, ImageCreated } from './explorer-image.actions';
import { RefreshContent } from '../explorer.actions';
import { IMergedImageDto } from '../../../../../shared/dto/IMergedImage.dto';
import { IImageDto } from '../../../../../shared/dto/IImage.dto';

export interface ExplorerImageStateModel {
    images: IMergedImageDto[];
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

    @Action(CreateImageByPath)
    createImageByPath({ dispatch }: StateContext<ExplorerImageStateModel>, action: CreateImageByPath) {
        return this.imageService.createByPath(action.absolutePath, action.name, action.extension)
            .pipe(
                tap((createdImage: IImageDto) => {
                    dispatch(new ImageCreated(createdImage));
                })
            );
    }

    @Action(ImageCreated)
    imageCreated({ dispatch }: StateContext<ExplorerImageStateModel>, action: ImageCreated) {
        return dispatch(new RefreshContent()); // TODO: patchState instead of refresh whole content
    }

    @Action(RemoveImage)
    removeImage({ dispatch }: StateContext<ExplorerImageStateModel>, action: RemoveImage) {
        return this.imageService.removeImage(action.image)
            .pipe(
                tap((result: void) => {
                    return dispatch(new RefreshContent()); // TODO: patchState instead of refresh whole content
                })
            );
    }
}
