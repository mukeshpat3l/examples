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
  MatOptionModule
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
    MatOptionModule
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
    MatOptionModule
  ]
})
export class MaterialModule {}
