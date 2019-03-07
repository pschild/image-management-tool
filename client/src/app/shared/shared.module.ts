import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog/dialog.component';
import { SafeUrlPipe } from './safe-url/safe-url.pipe';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { FormDialogComponent } from './dialog/form-dialog/form-dialog.component';
import { TableWrapperComponent } from './table-wrapper/table-wrapper.component';

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
    SafeUrlPipe,
    TableWrapperComponent
  ],
  exports: [
    DialogComponent,
    FormDialogComponent,
    SafeUrlPipe,
    TableWrapperComponent
  ]
})
export class SharedModule { }
