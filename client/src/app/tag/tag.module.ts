import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { TagChipsComponent } from './tag-chips/tag-chips.component';
import { TagService } from './tag.service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    TagChipsComponent
  ],
  exports: [
      TagChipsComponent
  ],
  providers: [
    TagService
  ]
})
export class TagModule { }
