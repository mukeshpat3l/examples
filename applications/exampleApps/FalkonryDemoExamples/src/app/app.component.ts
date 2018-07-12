import { Component, Inject, HostListener, OnDestroy, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';import { DataService } from './services/data.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent {
  host;
  finalHost;
  token;
  connected;
  validHostAndToken = false;
  constructor(private http: HttpClient, private dataService: DataService) {
    
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async connect() {
    if(this.host != null && !this.host.includes("https://"))
      this.finalHost = "https://"+this.host;
    else
      this.finalHost = this.host;
    sessionStorage.setItem("host", this.finalHost);
    sessionStorage.setItem("token", this.token);
    try {
      this.dataService.getAssesments(this.finalHost, this.token).subscribe(
        (assesments) => {
          alert("Connected!");
          sessionStorage.setItem("connected", JSON.stringify(true));
          this.http.post("/index/", JSON.stringify({ host: this.finalHost, token: this.token }), httpOptions).subscribe();
        },
        (err) => {
          alert("Couldn't connect with this host and token");
        }
      );
    }
    catch (err) {
    }
  }
}
