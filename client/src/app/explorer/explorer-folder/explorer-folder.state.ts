import { State, Selector, Action, StateContext } from '@ngxs/store';
import { FolderService } from '../../folder/folder.service';
import { tap } from 'rxjs/operators';
import { RemoveFolder, FoldersLoaded, CreateFolderByPath, FolderCreated } from './explorer-folder.actions';
import { RefreshContent } from '../explorer.actions';
import { IMergedFolderDto } from '../../../../../shared/dto/IMergedFolder.dto';
import { IFolderDto } from '../../../../../shared/dto/IFolder.dto';

export interface ExplorerFolderStateModel {
    folders: IMergedFolderDto[];
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

    @Action(CreateFolderByPath)
    createFolderByPath({ dispatch }: StateContext<ExplorerFolderStateModel>, action: CreateFolderByPath) {
        return this.folderService.createByPath(action.path)
            .pipe(
                tap((createdFolder: IFolderDto) => {
                    dispatch(new FolderCreated(createdFolder));
                })
            );
    }

    @Action(FolderCreated)
    folderCreated({ dispatch }: StateContext<ExplorerFolderStateModel>, action: FolderCreated) {
        return dispatch(new RefreshContent()); // TODO: patchState instead of refresh whole content
    }

    @Action(RemoveFolder)
    removeFolder({ dispatch }: StateContext<ExplorerFolderStateModel>, action: RemoveFolder) {
        return this.folderService.removeFolder(action.folder)
            .pipe(
                tap((result: void) => {
                    return dispatch(new RefreshContent()); // TODO: patchState instead of refresh whole content
                })
            );
    }
}
