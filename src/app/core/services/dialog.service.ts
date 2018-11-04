import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  static FILTERS = [
    { name: 'Bilddateien', extensions: ['jpg', 'png', 'gif'] },
    { name: 'Alle Dateien', extensions: ['*'] }
  ];

  constructor(private electronService: ElectronService) { }

  showOpenFolderDialog(callback: (filePaths: string[], bookmarks: string[]) => void, allowMultiple: boolean = false) {
    const properties = [];
    properties.push('openDirectory');
    if (allowMultiple) {
      properties.push('multiSelections');
    }
    this.showOpenDialog(properties, callback);
  }

  showOpenFileDialog(callback: (filePaths: string[], bookmarks: string[]) => void, allowMultiple: boolean = false) {
    const properties = [];
    properties.push('openFile');
    if (allowMultiple) {
      properties.push('multiSelections');
    }
    this.showOpenDialog(properties, callback);
  }

  private showOpenDialog(properties, callback: (filePaths: string[], bookmarks: string[]) => void) {
    this.electronService.remote.dialog.showOpenDialog(
      { properties: properties, filters: DialogService.FILTERS },
      callback
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
