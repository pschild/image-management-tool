import { State, Selector, Action, StateContext } from '@ngxs/store';
import { FolderService } from '../../folder/folder.service';
import { tap } from 'rxjs/operators';
import { FolderDto } from '../../../../../shared/FolderDto';
import { RemoveFolder, FoldersLoaded, FolderCreated } from './explorer-folder.actions';
import { IFolderDto } from '../../../../../shared/interface/IFolderDto';
import { RefreshContent } from '../explorer.actions';

export interface ExplorerFolderStateModel {
    folders: FolderDto[];
}

@State<ExplorerFolderStateModel>({
    name: 'folder',
    defaults: {
        folders: []
    }
})
export class ExplorerFolderState {
    constructor(private folderService: FolderService) { }

    @Selector()
    static folders(state: ExplorerFolderStateModel) {
        return state.folders;
    }

    @Action(FoldersLoaded)
    foldersLoaded({ patchState }: StateContext<ExplorerFolderStateModel>, action: FoldersLoaded) {
        patchState({
            folders: action.folders
        });
    }

    @Action(FolderCreated)
    folderCreated({ getState, patchState }: StateContext<ExplorerFolderStateModel>, action: FolderCreated) {
        const state = getState();
        const newFolderState: FolderDto[] = state.folders.map((folder: FolderDto) => {
            if (folder.name === action.createdFolder.name) {
                folder.addedInFs = false;
            }
            return folder;
        });
        patchState({
            folders: newFolderState
        });
    }

    @Action(RemoveFolder)
    removeFolder({ dispatch }: StateContext<ExplorerFolderStateModel>, action: RemoveFolder) {
        return this.folderService.removeFolder(action.folder)
            .pipe(
                tap((result: IFolderDto) => {
                    return dispatch(new RefreshContent());
                })
            );
    }
}
