import { Component, OnInit } from '@angular/core';
import { ExplorerService } from './explorer.service';
import { FileSystemError } from '../../../domain/error/FileSystemError';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IFolderContentDto } from '../../../domain/interface/IFolderContentDto';
import { FolderDto } from '../../../domain/FolderDto';
import { ImageDto } from '../../../domain/ImageDto';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements OnInit {

  currentPath$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  content$: Observable<IFolderContentDto | FileSystemError>;

  constructor(private explorerService: ExplorerService) { }

  ngOnInit() {
    this.explorerService.getHomeDirectory().subscribe((homeDirectory: string[]) => {
      this.currentPath$.next(homeDirectory);
      this.loadContent(homeDirectory);
    });
  }

  loadContent(path: string[]) {
    this.content$ = this.explorerService.getContentByPath(path)
      .pipe(
        tap((loadedContent: IFolderContentDto) => {
          this.currentPath$.next(path);
          return loadedContent;
        }),
        catchError((error: FileSystemError) => {
          alert(`Der Inhalt für das Verzeichnis konnte nicht geladen werden.\n\nCode: ${error.errorCode}\nFehlermeldung: ${error.message}`);
          return of(error);
        })
      );
  }

  openFolder(folder: FolderDto) {
    const newPath = this.currentPath$.getValue().slice(0);
    newPath.push(folder.name);
    this.loadContent(newPath);
  }

  navigateBack() {
    const newPath = this.currentPath$.getValue().slice(0);
    newPath.pop();
    this.loadContent(newPath);
  }

  handleRemovedFolder(folder: FolderDto) {
    console.log(`handleRemovedFolder: ${folder.absolutePath}`);
  }

  handleUntrackedFolder(folder: FolderDto) {
    console.log(`handleUntrackedFolder: ${folder.absolutePath}`);
  }

  handleRemovedImage(image: ImageDto) {
    console.log(`handleRemovedImage: ${image.absolutePath}`);
  }

  handleUntrackedImage(image: ImageDto) {
    console.log(`handleUntrackedImage: ${image.absolutePath}`);
  }

}
