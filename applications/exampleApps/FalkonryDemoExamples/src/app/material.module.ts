import {NgModule} from '@angular/core';

import {
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatListModule,
  MatButtonModule,
  MatCardModule,
  MatMenuModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatSelectModule,
  MatOptionModule,
  MatProgressSpinnerModule,
  MatDialogModule
} from '@angular/material';

@NgModule({
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatInputModule,
    MatRippleModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  exports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatInputModule,
    MatRippleModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ]
})
export class MaterialModule {}

