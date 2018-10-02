import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  selectedFilePaths = new Subject();

  private filters = [
    { name: 'Bilddateien', extensions: ['jpg', 'png', 'gif'] },
    { name: 'Alle Dateien', extensions: ['*'] }
  ];

  constructor(private electronService: ElectronService) { }

  showOpenFolderDialog(allowMultiple: boolean = false) {
    const properties = [];
    properties.push('openDirectory');
    if (allowMultiple) {
      properties.push('multiSelections');
    }
    this.showOpenDialog(properties);
  }

  showOpenFileDialog(allowMultiple: boolean = false) {
    const properties = [];
    properties.push('openFile');
    if (allowMultiple) {
      properties.push('multiSelections');
    }
    this.showOpenDialog(properties);
  }

  private showOpenDialog(properties) {
    this.electronService.remote.dialog.showOpenDialog(
      {properties: properties, filters: this.filters},
      (filePaths) => this.selectedFilePaths.next(filePaths)
    );
  }

  showErrorBox(title: string, content: string) {
    this.electronService.remote.dialog.showErrorBox(title, content);
  }

  showMessageBox(message: string) {
    this.electronService.remote.dialog.showMessageBox({
      message: message
    });
  }
}
