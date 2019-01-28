import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from './image.service';
import { ImageEditComponent } from './image-edit/image-edit.component';
import { ImageRoutingModule } from './image-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ImageRoutingModule
  ],
  declarations: [
    ImageEditComponent
  ],
  exports: [],
  providers: [
    ImageService
  ]
})
export class ImageModule { }
