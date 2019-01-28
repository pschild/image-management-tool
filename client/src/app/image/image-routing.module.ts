import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageEditComponent } from './image-edit/image-edit.component';

const routes: Routes = [
  {
    path: 'id/:currentFolderPath/:id',
    component: ImageEditComponent
  },
  {
    path: 'path/:path',
    component: ImageEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageRoutingModule { }
