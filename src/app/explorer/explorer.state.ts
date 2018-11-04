import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { LoadContentByPath, NavigateToFolder, NavigateUp, RefreshContent, LoadHomeDirectory, LoadContentFailed } from './explorer.actions';
import { ExplorerService } from './explorer.service';
import { tap, catchError } from 'rxjs/operators';
import { IFolderContentDto } from '../../../domain/interface/IFolderContentDto';
import { FileSystemError } from '../../../domain/error/FileSystemError';

export interface ExplorerStateModel {
    currentPath: string[];
    content: IFolderContentDto;
    error: FileSystemError;
}

@State<ExplorerStateModel>({
    name: 'explorer',
    defaults: {
        currentPath: [],
        content: {
            folders: [],
            images: []
        },
        error: null
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

    @Selector()
    static error(state: ExplorerStateModel) {
        return state.error;
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

    @Action(NavigateUp)
    navigateUp({ getState, dispatch }: StateContext<ExplorerStateModel>) {
        const state = getState();
        state.currentPath.pop();
        dispatch(new LoadContentByPath(state.currentPath));
    }

    @Action(RefreshContent)
    refreshContent({ getState, dispatch }: StateContext<ExplorerStateModel>) {
        const state = getState();
        dispatch(new LoadContentByPath(state.currentPath));
    }

    @Action(LoadContentByPath)
    loadContent({ getState, setState, dispatch }: StateContext<ExplorerStateModel>, action: LoadContentByPath) {
        return this.explorerService.getContentByPath(action.path)
            .pipe(
                tap((loadedContent: IFolderContentDto) => {
                    const state = getState();
                    setState({
                        ...state,
                        content: {
                            folders: loadedContent.folders,
                            images: loadedContent.images
                        },
                        currentPath: action.path // currentPath is set only when loading content is successful
                    });
                }),
                catchError((error: FileSystemError) => {
                    return dispatch(new LoadContentFailed(error));
                })
            );
    }

    @Action(LoadContentFailed)
    loadContentFailed({ getState, setState }: StateContext<ExplorerStateModel>, action: LoadContentFailed) {
        const state = getState();
        setState({
            ...state,
            error: action.error
        });
    }
}
