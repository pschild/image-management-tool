import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageEditComponent } from './image-edit/image-edit.component';

const routes: Routes = [
  {
    path: ':absolutePath/:id',
    component: ImageEditComponent
  },
  {
    path: ':absolutePath',
    component: ImageEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageRoutingModule { }
