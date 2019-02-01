import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import {
    LoadContentByPath,
    NavigateToFolder,
    NavigateBack,
    LoadHomeDirectory,
    RelocateFolder,
    RefreshContent,
    RelocateImage
} from './explorer.actions';
import { ExplorerService } from './explorer.service';
import { tap } from 'rxjs/operators';
import { ExplorerFolderState } from './explorer-folder/explorer-folder.state';
import { FoldersLoaded } from './explorer-folder/explorer-folder.actions';
import { ImagesLoaded } from './explorer-image/explorer-image.actions';
import { ExplorerImageState } from './explorer-image/explorer-image.state';
import { IFolderEntityDto } from '../../../../shared/IFolderEntity.dto';
import { IImageEntityDto } from '../../../../shared/IImageEntity.dto';
import { IExplorerContentDto } from '../../../../shared/IExplorerContent.dto';

export interface ExplorerStateModel {
    currentPath: string[];
}

@State<ExplorerStateModel>({
    name: 'explorer',
    defaults: {
        currentPath: []
    },
    children: [ExplorerFolderState, ExplorerImageState]
})
export class ExplorerState implements NgxsOnInit {
    constructor(private explorerService: ExplorerService) { }

    @Selector()
    static currentPath(state: ExplorerStateModel) {
        return state.currentPath;
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
                tap((loadedContent: IExplorerContentDto) => {
                    patchState({
                        currentPath: action.path // currentPath is set only when loading content is successful
                    });
                    dispatch(new FoldersLoaded(loadedContent.folders)); // delegate to child state
                    dispatch(new ImagesLoaded(loadedContent.images)); // delegate to child state
                })
            );
    }

    @Action(RelocateFolder)
    relocateFolder({ dispatch }: StateContext<ExplorerStateModel>, action: RelocateFolder) {
        return this.explorerService.relocateFolder(action.oldPath, action.newPath)
            .pipe(
                tap((result: IFolderEntityDto) => {
                    alert(`Success`); // TODO: dispatch RelocateFolderSuccess
                    return dispatch(new RefreshContent());
                })
            );
    }

    @Action(RelocateImage)
    relocateImage({ dispatch }: StateContext<ExplorerStateModel>, action: RelocateImage) {
        return this.explorerService.relocateImage(action.oldPath, action.newPath)
            .pipe(
                tap((result: IImageEntityDto) => {
                    alert(`Success`); // TODO: dispatch RelocateImageSuccess
                    return dispatch(new RefreshContent());
                })
            );
    }
}
