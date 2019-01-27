import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, Select } from '@ngxs/store';
import { NavigateToFolder, NavigateBack, CreateFolderByPath, RelocateFolder, CreateImageByPath, RelocateImage } from './explorer.actions';
import { ExplorerState } from './explorer.state';
import { DialogService } from '../core/services/dialog.service';
import { FolderDto } from '../../../../shared/FolderDto';
import { ImageDto } from '../../../../shared/ImageDto';
import { RemoveFolder } from '../folder/folder.actions';
import { FolderState } from '../folder/folder.state';
import { IFolderDto } from '../../../../shared/interface/IFolderDto';
import { ImageState } from '../image/image.state';
import { IImageDto } from '../../../../shared/interface/IImageDto';
import { RemoveImage } from '../image/image.actions';
import { IDialogResult } from '../shared/dialog/dialog-config';
import { DialogResult } from '../shared/dialog/dialog.enum';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements OnInit {

  @Select(ExplorerState.currentPath) currentPath$: Observable<string[]>;
  @Select(FolderState.folders) folders$: Observable<IFolderDto>;
  @Select(ImageState.images) images$: Observable<IImageDto>;

  constructor(private store: Store, private dialogService: DialogService) { }

  ngOnInit() {
  }

  openFolder(folder: FolderDto) {
    this.store.dispatch(new NavigateToFolder(folder.name));
  }

  navigateBack() {
    this.store.dispatch(new NavigateBack());
  }

  handleRemovedFolder(folder: FolderDto) {
    this.dialogService.showRelocationDialog({
      title: 'Ordner suchen',
      message: `Der Ordner ${folder.name} wurde nicht mehr im System gefunden.
        Falls er verschoben wurde, können Sie einen neuen Ort bestimmen \
        Falls er entfernt wurde, können Sie ihn aus der Datenbank entfernen.`
    }).subscribe((dialogResult: IDialogResult) => {
      if (dialogResult.result === DialogResult.RELOCATION_SEARCH) {
        this.dialogService.showOpenFolderDialog((filePaths: string[], bookmarks: string[]) => {
          if (filePaths && filePaths.length) {
            const newFilePath = filePaths[0];
            this.store.dispatch(new RelocateFolder(folder.absolutePath, newFilePath));
          }
        }, false, folder.absolutePath);
      } else if (dialogResult.result === DialogResult.RELOCATION_REMOVE) {
        this.store.dispatch(new RemoveFolder(folder));
      }
    });
  }

  handleUntrackedFolder(folder: FolderDto) {
    this.store.dispatch(new CreateFolderByPath(folder.absolutePath));
  }

  handleRemovedImage(image: ImageDto) {
    this.dialogService.showRelocationDialog({
      title: 'Bild suchen',
      message: `Das Bild ${image.absolutePath} wurde nicht mehr im System gefunden.
      Falls es verschoben wurde, können Sie einen neuen Ort bestimmen.
      Falls es entfernt wurde, können Sie es aus der Datenbank entfernen.`
    }).subscribe((dialogResult: IDialogResult) => {
      if (dialogResult.result === DialogResult.RELOCATION_SEARCH) {
        this.dialogService.showOpenFileDialog((filePaths: string[], bookmarks: string[]) => {
          if (filePaths && filePaths.length) {
            const newFilePath = filePaths[0];
            this.store.dispatch(new RelocateImage(image.absolutePath, newFilePath));
          }
        }, false, image.absolutePath);
      } else if (dialogResult.result === DialogResult.RELOCATION_REMOVE) {
        this.store.dispatch(new RemoveImage(image));
      }
    });
  }

  handleUntrackedImage(image: ImageDto) {
    this.store.dispatch(new CreateImageByPath(image.absolutePath, image.name, image.extension));
  }

}
