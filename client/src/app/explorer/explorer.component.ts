import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, Select } from '@ngxs/store';
import { NavigateToFolder, NavigateBack, CreateFolderByPath, RelocateFolder, CreateImageByPath } from './explorer.actions';
import { ExplorerState } from './explorer.state';
import { DialogService } from '../core/services/dialog.service';
import { FolderDto } from '../../../../shared/FolderDto';
import { ImageDto } from '../../../../shared/ImageDto';
import { IFolderContentDto } from '../../../../shared/interface/IFolderContentDto';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements OnInit {

  @Select(ExplorerState.currentPath) currentPath$: Observable<string[]>;
  @Select(ExplorerState.content) content$: Observable<IFolderContentDto>;

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
    // C:\Users\Philippe\Desktop\2017-12-16 zweiter Geburtstag Ella\2017-12-16 zweiter Geburtstag Ella (01).JPG
    console.log(`handleUntrackedImage: ${image.absolutePath}`);
    this.store.dispatch(new CreateImageByPath(image.absolutePath, image.name, image.extension));
  }

}
