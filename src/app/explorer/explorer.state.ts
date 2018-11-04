import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { LoadContentByPath, NavigateToFolder, NavigateBack, LoadHomeDirectory, LoadContentFailed, CreateFolderByPath } from './explorer.actions';
import { ExplorerService } from './explorer.service';
import { tap, catchError } from 'rxjs/operators';
import { IFolderContentDto } from '../../../domain/interface/IFolderContentDto';
import { FileSystemError } from '../../../domain/error/FileSystemError';
import { FolderDto } from '../../../domain/FolderDto';

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
                }),
                catchError((error: FileSystemError) => {
                    return dispatch(new LoadContentFailed(error));
                })
            );
    }

    @Action(LoadContentFailed)
    loadContentFailed({ patchState }: StateContext<ExplorerStateModel>, action: LoadContentFailed) {
        patchState({
            error: action.error
        });
    }
}
