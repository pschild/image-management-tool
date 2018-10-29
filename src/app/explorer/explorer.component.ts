import { Component, OnInit } from '@angular/core';
import { ExplorerService } from './explorer.service';
import { FileSystemError } from '../../../domain/error/FileSystemError';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements OnInit {

  currentPath = ['C:', 'Users', 'schild', 'Desktop'];
  content$: Observable<any>;

  constructor(private explorerService: ExplorerService) { }

  ngOnInit() {
    this.loadContent(this.currentPath);
  }

  loadContent(path: string[]) {
    this.content$ = this.explorerService.getContentByPath(path)
      .pipe(
        tap(loadedContent => {
          this.currentPath = path;
          return loadedContent;
        }),
        catchError((error: FileSystemError) => {
          alert(`Der Inhalt für das Verzeichnis konnte nicht geladen werden.\n\nCode: ${error.errorCode}\nFehlermeldung: ${error.message}`);
          return of();
        })
      );
  }

  openFolder(folder) {
    const newPath = this.currentPath.slice(0);
    newPath.push(folder.name);
    this.loadContent(newPath);
  }

  navigateBack() {
    const newPath = this.currentPath.slice(0);
    newPath.pop();
    this.loadContent(newPath);
  }

}
