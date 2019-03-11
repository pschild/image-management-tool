import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatListModule, MatMenuModule, MatIconModule, MatDividerModule, MatFormFieldModule, MatChipsModule, MatAutocompleteModule, MatOptionModule, MatInputModule, MatSliderModule, MatProgressBarModule, MatDialogModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatTableModule, MatSortModule, MatPaginatorModule, MatPaginatorIntl, MAT_DATE_LOCALE } from '@angular/material';
import { MatPaginatorIntlCustom } from './material-custom-paginator';

@NgModule({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
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
    MatProgressBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
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
    MatProgressBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCustom },
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' }
  ]
})
export class MaterialModule { }
