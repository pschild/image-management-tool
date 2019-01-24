import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatListModule, MatMenuModule, MatIconModule, MatDividerModule, MatFormFieldModule, MatChipsModule, MatAutocompleteModule, MatOptionModule, MatInputModule, MatSliderModule, MatProgressBarModule } from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatInputModule,
    MatSliderModule,
    MatProgressBarModule
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatInputModule,
    MatSliderModule,
    MatProgressBarModule
  ]
})
export class MaterialModule { }
