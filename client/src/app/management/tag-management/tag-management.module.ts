import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagService } from './tag.service';
import { TagChipsComponent } from './tag-chips/tag-chips.component';
import { MaterialModule } from '../../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TagManagementComponent } from './tag-management.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { TagFormComponent } from './tag-form/tag-form.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    TagManagementComponent,
    TagListComponent,
    TagFormComponent,
    TagChipsComponent
  ],
  exports: [
    TagManagementComponent,
    TagListComponent,
    TagFormComponent,
    TagChipsComponent
  ],
  providers: [
    TagService
  ]
})
export class TagManagementModule { }
