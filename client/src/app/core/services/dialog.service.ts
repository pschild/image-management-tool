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

  showOpenFolderDialog(callback: (filePaths: string[], bookmarks: string[]) => void, allowMultiple: boolean = false, defaultPath?: string) {
    const properties = [];
    properties.push('openDirectory');
    if (allowMultiple) {
      properties.push('multiSelections');
    }
    this.showOpenDialog(properties, callback, defaultPath);
  }

  showOpenFileDialog(callback: (filePaths: string[], bookmarks: string[]) => void, allowMultiple: boolean = false, defaultPath?: string) {
    const properties = [];
    properties.push('openFile');
    if (allowMultiple) {
      properties.push('multiSelections');
    }
    this.showOpenDialog(properties, callback, defaultPath);
  }

  private showOpenDialog(properties: any[], callback: (filePaths: string[], bookmarks: string[]) => void, defaultPath?: string) {
    this.electronService.remote.dialog.showOpenDialog(
      { defaultPath, properties, filters: DialogService.FILTERS },
      callback
    );
  }

  showErrorBox(title: string, content: string) {
    this.electronService.remote.dialog.showErrorBox(title, content);
  }

  showMessageBox(
    title: string,
    message: string,
    buttons: {id: number, label: string}[],
    callback?: (response: number, checkboxChecked: boolean) => void
  ) {
    this.electronService.remote.dialog.showMessageBox({ title, message, buttons: buttons.map(b => b.label) }, callback);
  }
}
