import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, Select, Actions, ofActionSuccessful } from '@ngxs/store';
import { NavigateToFolder, NavigateBack, CreateFolderByPath, RelocateFolder, CreateImageByPath, RelocateImage } from './explorer.actions';
import { ExplorerState } from './explorer.state';
import { DialogService } from '../core/services/dialog.service';
import { FolderDto } from '../../../../shared/FolderDto';
import { ImageDto } from '../../../../shared/ImageDto';
import { RemoveFolder, FolderCreated } from './explorer-folder/explorer-folder.actions';
import { ExplorerFolderState } from './explorer-folder/explorer-folder.state';
import { IFolderDto } from '../../../../shared/interface/IFolderDto';
import { ExplorerImageState } from './explorer-image/explorer-image.state';
import { IImageDto } from '../../../../shared/interface/IImageDto';
import { RemoveImage, ImageCreated } from './explorer-image/explorer-image.actions';
import { IDialogResult } from '../shared/dialog/dialog-config';
import { DialogResult } from '../shared/dialog/dialog.enum';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements OnInit {

  @Select(ExplorerState.currentPath) currentPath$: Observable<string[]>;
  @Select(ExplorerFolderState.folders) folders$: Observable<IFolderDto>;
  @Select(ExplorerImageState.images) images$: Observable<IImageDto>;

  constructor(
    private store: Store,
    private router: Router,
    private dialogService: DialogService,
    private toastr: ToastrService,
    private actions$: Actions
  ) { }

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
    this.actions$.pipe(
      ofActionSuccessful(FolderCreated),
      first()
    ).subscribe((action: FolderCreated) => {
      this.toastr.success(`Ordner "${action.createdFolder.name}" hinzugefügt`);
    });
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
    this.actions$.pipe(
      ofActionSuccessful(ImageCreated),
      first()
    ).subscribe((action: ImageCreated) => {
      this.toastr.success(`Bild "${action.createdImage.name}.${action.createdImage.extension}" hinzugefügt`);
    });
  }

  handleImageClicked(image: ImageDto) {
    if (image.removedInFs) {
      return;
    } else if (image.addedInFs) {
      this.router.navigateByUrl(`image/path/${image.absolutePath}`);
    } else {
      this.currentPath$.pipe(
        first()
      ).subscribe(path => {
        const currentPath = encodeURIComponent(path.join('/'));
        this.router.navigateByUrl(`image/id/${currentPath}/${image.id}`);
      });
    }
  }

}
