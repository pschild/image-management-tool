import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from '../../shared/notification/error-dialog/error-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  static FILTERS = [
    { name: 'Bilddateien', extensions: ['jpg', 'png', 'gif'] },
    { name: 'Alle Dateien', extensions: ['*'] }
  ];

  constructor(
    private electronService: ElectronService,
    private dialog: MatDialog
  ) { }

  showErrorDialog(configuration) {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '50%',
      data: configuration
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

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
    buttons: { id: number, label: string }[],
    callback?: (response: number, checkboxChecked: boolean) => void
  ) {
    this.electronService.remote.dialog.showMessageBox({ title, message, buttons: buttons.map(b => b.label) }, callback);
  }
}
