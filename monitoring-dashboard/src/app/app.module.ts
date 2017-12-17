import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import {GoogleChart} from 'angular2-google-chart/directives/angular2-google-chart.directive';
import { UserComponent } from './components/user/user.component';
import {DataService } from './services/data.service';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import { D3Service } from 'd3-ng2-service'; 
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { GooglechartComponent } from './components/googlechart/googlechart.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    GooglechartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    Ng2GoogleChartsModule
  ],
  providers: [DataService,D3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
