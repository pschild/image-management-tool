import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IFolderContentDto } from '../../../domain/interface/IFolderContentDto';
import { FolderDto } from '../../../domain/FolderDto';
import { ImageDto } from '../../../domain/ImageDto';
import { Store, Select } from '@ngxs/store';
import { NavigateToFolder, NavigateUp, RefreshContent, LoadHomeDirectory } from './explorer.actions';
import { ExplorerState } from './explorer.state';
import { FolderService } from '../core/services/folder.service';
import { FileSystemError } from '../../../domain/error/FileSystemError';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements OnInit {

  @Select(ExplorerState.currentPath) currentPath$: Observable<string[]>;
  @Select(ExplorerState.content) content$: Observable<IFolderContentDto>;
  @Select(ExplorerState.error) error$: Observable<FileSystemError>;

  constructor(private folderService: FolderService, private store: Store) { }

  ngOnInit() {
    this.error$
      .pipe(
        filter((error: FileSystemError) => error !== null)
      )
      .subscribe((error: FileSystemError) => {
        alert(`
            Der Inhalt für das Verzeichnis konnte nicht geladen werden.
            \n\n
            Code: ${error.errorCode}\nFehlermeldung: ${error.message}
        `);
      });
  }

  refresh() {
    this.store.dispatch(new RefreshContent());
  }

  openFolder(folder: FolderDto) {
    this.store.dispatch(new NavigateToFolder(folder.name));
  }

  navigateBack() {
    this.store.dispatch(new NavigateUp());
  }

  handleRemovedFolder(folder: FolderDto) {
    console.log(`handleRemovedFolder: ${folder.absolutePath}`);
  }

  handleUntrackedFolder(folder: FolderDto) {
    console.log(`handleUntrackedFolder: ${folder.absolutePath}`);
    this.folderService.createByPath(folder.absolutePath).subscribe(res => this.refresh());
  }

  handleRemovedImage(image: ImageDto) {
    console.log(`handleRemovedImage: ${image.absolutePath}`);
  }

  handleUntrackedImage(image: ImageDto) {
    console.log(`handleUntrackedImage: ${image.absolutePath}`);
  }

}
