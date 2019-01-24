import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementComponent } from './management.component';
import { PersonsListComponent } from './persons-list/persons-list.component';

const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    children: [
      {
        path: '',
        redirectTo: 'persons'
      },
      {
        path: 'persons',
        component: PersonsListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
