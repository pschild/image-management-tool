import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog/dialog.component';
import { SafeUrlPipe } from './safe-url/safe-url.pipe';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { FormDialogComponent } from './dialog/form-dialog/form-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  entryComponents: [
    DialogComponent,
    FormDialogComponent
  ],
  declarations: [
    DialogComponent,
    FormDialogComponent,
    SafeUrlPipe
  ],
  exports: [
    DialogComponent,
    FormDialogComponent,
    SafeUrlPipe
  ]
})
export class SharedModule { }
