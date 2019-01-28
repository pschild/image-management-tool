import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from './image.service';
import { ImageEditComponent } from './image-edit/image-edit.component';
import { ImageRoutingModule } from './image-routing.module';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { ImageFormComponent } from './image-form/image-form.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ImageRoutingModule
  ],
  declarations: [
    ImageEditComponent,
    ImagePreviewComponent,
    ImageFormComponent
  ],
  exports: [],
  providers: [
    ImageService
  ]
})
export class ImageModule { }