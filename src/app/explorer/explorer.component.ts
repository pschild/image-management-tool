import { Component, OnInit } from '@angular/core';
import { ExplorerService } from './explorer.service';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements OnInit {

  currentPath = ['C:', 'Users', 'schild', 'Desktop'];
  content: { folders: any[], images: any[] }; // TODO: put to interface

  constructor(private explorerService: ExplorerService) { }

  ngOnInit() {
    this.loadContent();
  }

  loadContent() {
    this.explorerService.getContentByPath(this.currentPath).subscribe((res) => {
      this.content = res;
    });
  }

  openFolder(folder) {
    this.currentPath.push(folder.name);
    this.loadContent();
  }

  navigateBack() {
    this.currentPath.pop();
    this.loadContent();
  }

}
