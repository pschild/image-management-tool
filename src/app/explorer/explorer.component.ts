import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IFolderContentDto } from '../../../domain/interface/IFolderContentDto';
import { FolderDto } from '../../../domain/FolderDto';
import { ImageDto } from '../../../domain/ImageDto';
import { Store, Select } from '@ngxs/store';
import { NavigateToFolder, NavigateBack, CreateFolderByPath } from './explorer.actions';
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
