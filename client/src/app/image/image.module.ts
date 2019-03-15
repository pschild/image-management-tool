import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from './image.service';
import { ImageEditComponent } from './image-edit/image-edit.component';
import { ImageRoutingModule } from './image-routing.module';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { ImageFormComponent } from './image-form/image-form.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TagManagementModule } from '../management/tag-management/tag-management.module';
import { MarkerDirective } from './marker.directive';
import { ImageMarkerComponent } from './image-marker.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ImageRoutingModule,
    TagManagementModule
  ],
  declarations: [
    ImageEditComponent,
    ImagePreviewComponent,
    ImageFormComponent,
    ImageMarkerComponent,
    MarkerDirective
  ],
  entryComponents: [ImageMarkerComponent],
  exports: [],
  providers: [
    ImageService
  ]
})
export class ImageModule { }
