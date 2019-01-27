import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogComponent } from '../dialog.component';
import { IDialogConfig } from '../dialog-config';

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['../dialog.component.scss', './form-dialog.component.scss']
})
export class FormDialogComponent extends DialogComponent {

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { config: IDialogConfig }
  ) {
    super(dialogRef, data);
  }
}
