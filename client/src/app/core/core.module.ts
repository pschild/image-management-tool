import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { NavigationComponent } from './navigation/navigation.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    HeaderComponent,
    NavigationComponent
  ],
  exports: [
    HeaderComponent
  ]
})
export class CoreModule { }
