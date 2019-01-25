import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { LoadContentByPath, NavigateToFolder, NavigateBack, LoadHomeDirectory, CreateFolderByPath, RelocateFolder, RefreshContent, CreateImageByPath, RemoveFolder, RemoveImage, RelocateImage } from './explorer.actions';
import { ExplorerService } from './explorer.service';
import { tap } from 'rxjs/operators';
import { IFolderContentDto } from '../../../../shared/interface/IFolderContentDto';
import { FolderDto } from '../../../../shared/FolderDto';
import { ImageDto } from '../../../../shared/ImageDto';
import { IFolderDto } from '../../../../shared/interface/IFolderDto';
import { IImageDto } from '../../../../shared/interface/IImageDto';

export interface ExplorerStateModel {
    currentPath: string[];
    content: IFolderContentDto;
}

@State<ExplorerStateModel>({
    name: 'explorer',
    defaults: {
        currentPath: [],
        content: {
            folders: [],
            images: []
        }
    }
})
export class ExplorerState implements NgxsOnInit {
    constructor(private explorerService: ExplorerService) { }

    @Selector()
    static currentPath(state: ExplorerStateModel) {
        return state.currentPath;
    }

    @Selector()
    static content(state: ExplorerStateModel) {
        return state.content;
    }

    ngxsOnInit({ dispatch }: StateContext<ExplorerStateModel>) {
        dispatch(new LoadHomeDirectory());
    }

    @Action(LoadHomeDirectory)
    loadHomeDirectory({ dispatch }: StateContext<ExplorerStateModel>) {
        return this.explorerService.getHomeDirectory()
            .pipe(
                tap((homeDirectory: string[]) => {
                    return dispatch(new LoadContentByPath(homeDirectory));
                })
            );
    }

    @Action(CreateFolderByPath)
    createFolderByPath({ getState, patchState }: StateContext<ExplorerStateModel>, action: CreateFolderByPath) {
        return this.explorerService.createFolderByPath(action.path)
            .pipe(
                tap((createdFolder: FolderDto) => {
                    const state = getState();
                    const newFolderState: FolderDto[] = state.content.folders.map((folder: FolderDto) => {
                        if (folder.name === createdFolder.name) {
                            folder.addedInFs = false;
                        }
                        return folder;
                    });
                    patchState({
                        content: {
                            folders: newFolderState,
                            images: state.content.images
                        }
                    });
                })
            );
    }

    @Action(CreateImageByPath)
    createImageByPath({ getState, patchState }: StateContext<ExplorerStateModel>, action: CreateImageByPath) {
        return this.explorerService.createImageByPath(action.absolutePath, action.name, action.extension)
            .pipe(
                tap((createdImage: ImageDto) => {
                    const state = getState();
                    const newImageState: ImageDto[] = state.content.images.map((image: ImageDto) => {
                        if (image.name === createdImage.name) {
                            image.addedInFs = false;
                        }
                        return image;
                    });
                    patchState({
                        content: {
                            folders: state.content.folders,
                            images: newImageState
                        }
                    });
                })
            );
    }

    @Action(NavigateToFolder)
    navigateToFolder({ getState, dispatch }: StateContext<ExplorerStateModel>, action: NavigateToFolder) {
        const state = getState();
        dispatch(new LoadContentByPath([...state.currentPath, action.folderName]));
    }

    @Action(NavigateBack)
    navigateBack({ getState, dispatch }: StateContext<ExplorerStateModel>) {
        const state = getState();
        state.currentPath.pop();
        dispatch(new LoadContentByPath(state.currentPath));
    }

    @Action(RefreshContent)
    refreshContent({ getState, dispatch }: StateContext<ExplorerStateModel>) {
        dispatch(new LoadContentByPath(getState().currentPath));
    }

    @Action(LoadContentByPath)
    loadContent({ patchState, dispatch }: StateContext<ExplorerStateModel>, action: LoadContentByPath) {
        return this.explorerService.getContentByPath(action.path)
            .pipe(
                tap((loadedContent: IFolderContentDto) => {
                    patchState({
                        content: {
                            folders: loadedContent.folders,
                            images: loadedContent.images
                        },
                        currentPath: action.path // currentPath is set only when loading content is successful
                    });
                })
            );
    }

    @Action(RelocateFolder)
    relocateFolder({ dispatch }: StateContext<ExplorerStateModel>, action: RelocateFolder) {
        return this.explorerService.relocateFolder(action.oldPath, action.newPath)
            .pipe(
                tap((result: IFolderDto) => {
                    alert(`Success`); // TODO: dispatch RelocateFolderSuccess
                    return dispatch(new RefreshContent());
                })
            );
    }

    @Action(RelocateImage)
    relocateImage({ dispatch }: StateContext<ExplorerStateModel>, action: RelocateImage) {
        return this.explorerService.relocateImage(action.oldPath, action.newPath)
            .pipe(
                tap((result: IImageDto) => {
                    alert(`Success`); // TODO: dispatch RelocateImageSuccess
                    return dispatch(new RefreshContent());
                })
            );
    }

    // TODO: move to FolderState
    @Action(RemoveFolder)
    removeFolder({ dispatch }: StateContext<ExplorerStateModel>, action: RemoveFolder) {
        return this.explorerService.removeFolder(action.folder)
            .pipe(
                tap((result: IFolderDto) => {
                    return dispatch(new RefreshContent());
                })
            );
    }

    // TODO: move to ImageState
    @Action(RemoveImage)
    removeImage({ dispatch }: StateContext<ExplorerStateModel>, action: RemoveImage) {
        return this.explorerService.removeImage(action.image)
            .pipe(
                tap((result: IImageDto) => {
                    return dispatch(new RefreshContent());
                })
            );
    }
}
