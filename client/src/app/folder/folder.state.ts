import { State, Selector, Action, StateContext } from '@ngxs/store';
import { FolderService } from './folder.service';
import { tap } from 'rxjs/operators';
import { FolderDto } from '../../../../shared/FolderDto';
import { RemoveFolder, FoldersLoaded, FolderCreated } from './folder.actions';
import { IFolderDto } from '../../../../shared/interface/IFolderDto';
import { RefreshContent } from '../explorer/explorer.actions';

export interface FolderStateModel {
    folders: FolderDto[];
}

@State<FolderStateModel>({
    name: 'folder',
    defaults: {
        folders: []
    }
})
export class FolderState {
    constructor(private folderService: FolderService) { }

    @Selector()
    static folders(state: FolderStateModel) {
        return state.folders;
    }

    @Action(FoldersLoaded)
    foldersLoaded({ patchState }: StateContext<FolderStateModel>, action: FoldersLoaded) {
        patchState({
            folders: action.folders
        });
    }

    @Action(FolderCreated)
    folderCreated({ getState, patchState }: StateContext<FolderStateModel>, action: FolderCreated) {
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
    removeFolder({ dispatch }: StateContext<FolderStateModel>, action: RemoveFolder) {
        return this.folderService.removeFolder(action.folder)
            .pipe(
                tap((result: IFolderDto) => {
                    return dispatch(new RefreshContent());
                })
            );
    }
}
