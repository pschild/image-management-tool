import { State, Action, StateContext, Selector } from '@ngxs/store';
import { LoadContentByPath, NavigateToFolder, NavigateUp, RefreshContent, LoadHomeDirectory } from './explorer.actions';
import { ExplorerService } from './explorer.service';
import { tap, catchError } from 'rxjs/operators';
import { IFolderContentDto } from '../../../domain/interface/IFolderContentDto';
import { FileSystemError } from '../../../domain/error/FileSystemError';
import { of } from 'rxjs';

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
export class ExplorerState {
    constructor(private explorerService: ExplorerService) { }

    @Selector()
    static currentPath(state: ExplorerStateModel) {
        return state.currentPath;
    }

    @Selector()
    static content(state: ExplorerStateModel) {
        return state.content;
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
    loadContent({ getState, setState }: StateContext<ExplorerStateModel>, action: LoadContentByPath) {
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
                    // TODO: dispatch ErrorAction and subscribe to that in component => Style Guide?
                    alert(`
                        Der Inhalt für das Verzeichnis konnte nicht geladen werden.
                        \n\n
                        Code: ${error.errorCode}\nFehlermeldung: ${error.message}
                    `);
                    return of(error);
                })
            );
    }
}
