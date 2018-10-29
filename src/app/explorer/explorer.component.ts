import { Component, OnInit } from '@angular/core';
import { ExplorerService } from './explorer.service';
import { IFolderContentDto } from '../../../domain/interface/IFolderContentDto';
import { FileSystemError } from '../../../domain/error/FileSystemError';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements OnInit {

  currentPath = ['C:', 'Users', 'schild', 'Desktop'];
  content: IFolderContentDto;

  constructor(private explorerService: ExplorerService) { }

  ngOnInit() {
    this.loadContent(this.currentPath);
  }

  loadContent(path: string[]) {
    this.explorerService.getContentByPath(path).subscribe(
      (res: IFolderContentDto) => {
        this.currentPath = path;
        this.content = res;
      },
      (err: FileSystemError) => alert(err.message)
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
