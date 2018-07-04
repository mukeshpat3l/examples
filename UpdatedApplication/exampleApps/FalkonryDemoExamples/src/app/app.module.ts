import { MaterialModule } from './material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout'
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { ExampleComponent } from './example/example.component';
import { ChartsModule } from 'ng2-charts';
import {GoogleChart} from 'angular2-google-chart/directives/angular2-google-chart.directive';
import {DataService } from './services/data.service';
import { D3Service } from 'd3-ng2-service';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { UserComponent } from './user/user.component';
import { StorageServiceModule} from 'angular-webstorage-service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ExampleComponent,
    UserComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpModule,
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    Ng2GoogleChartsModule,
    StorageServiceModule,
    Ng4LoadingSpinnerModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponent},
      {path: 'example', component: ExampleComponent},
      {path: 'user', component: UserComponent}
    ])
  ],
  providers: [DataService,D3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
