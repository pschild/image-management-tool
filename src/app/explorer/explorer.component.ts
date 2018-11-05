import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IFolderContentDto } from '../../../domain/interface/IFolderContentDto';
import { FolderDto } from '../../../domain/FolderDto';
import { ImageDto } from '../../../domain/ImageDto';
import { Store, Select } from '@ngxs/store';
import { NavigateToFolder, NavigateBack, CreateFolderByPath, RelocateFolder } from './explorer.actions';
import { ExplorerState } from './explorer.state';
import { FileSystemError } from '../../../domain/error/FileSystemError';
import { filter } from 'rxjs/operators';
import { DialogService } from '../core/services/dialog.service';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements OnInit {

  @Select(ExplorerState.currentPath) currentPath$: Observable<string[]>;
  @Select(ExplorerState.content) content$: Observable<IFolderContentDto>;
  @Select(ExplorerState.error) error$: Observable<FileSystemError>;

  constructor(private store: Store, private dialogService: DialogService) { }

  ngOnInit() {
    this.error$
      .pipe(
        filter((error: FileSystemError) => error !== null)
      )
      .subscribe((error: FileSystemError) => {
        this.dialogService.showErrorBox(
          'Es ist ein Fehler aufgetreten',
          `Der Inhalt für das Verzeichnis konnte nicht geladen werden.\nCode: ${error.errorCode}\nFehlermeldung: ${error.message}`
        );
      });
  }

  openFolder(folder: FolderDto) {
    this.store.dispatch(new NavigateToFolder(folder.name));
  }

  navigateBack() {
    this.store.dispatch(new NavigateBack());
  }

  handleRemovedFolder(folder: FolderDto) {
    console.log(`handleRemovedFolder: ${folder.absolutePath}`);
    this.dialogService.showMessageBox(
      `Ordner suchen`,
      `Der Ordner ${folder.name} wurde nicht mehr im System gefunden.
      Falls er verschoben wurde, können Sie einen neuen Ort bestimmen.
      Falls er entfernt wurde, können Sie aus der Datenbank entfernen.`,
      [
        { id: 0, label: 'Suchen' },
        { id: 1, label: 'Löschen' },
        { id: 2, label: 'Abbrechen' }
      ],
      (response: number) => {
        if (response === 0) {
          this.dialogService.showOpenFolderDialog((filePaths: string[], bookmarks: string[]) => {
            if (filePaths && filePaths.length) {
              const newFilePath = filePaths[0];
              this.store.dispatch(new RelocateFolder(folder.absolutePath, newFilePath));
            }
          });
        } else if (response === 1) {
          console.log('Ordner löschen');
        }
      }
    );
  }

  handleUntrackedFolder(folder: FolderDto) {
    console.log(`handleUntrackedFolder: ${folder.absolutePath}`);
    this.store.dispatch(new CreateFolderByPath(folder.absolutePath));
  }

  handleRemovedImage(image: ImageDto) {
    console.log(`handleRemovedImage: ${image.absolutePath}`);
  }

  handleUntrackedImage(image: ImageDto) {
    console.log(`handleUntrackedImage: ${image.absolutePath}`);
  }

}
