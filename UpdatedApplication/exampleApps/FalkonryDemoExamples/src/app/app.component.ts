import { Component, Inject, HostListener } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { DataService } from './services/data.service';

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
  constructor(private http: HttpClient, @Inject(LOCAL_STORAGE) private storage: WebStorageService, private dataService: DataService) {
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async connect() {
    this.storage.set("connected", false);
    if(!this.host.includes("https://"))
      this.finalHost = "https://"+this.host;
    else
      this.finalHost = this.host;
    console.log(this.host);
    console.log(this.token);
    try {
      console.log("inside try");
      this.dataService.getAssesments(this.finalHost, this.token).subscribe(
        (assesments) => {
          console.log("as\n");
          alert("Connected!");
          this.storage.set("connected", true);
          this.http.post("http://127.0.0.1:8000/index/", JSON.stringify({ host: "https://" + this.host, token: this.token }), httpOptions).subscribe();
        },
        (err) => {
          console.log("errrr");
          alert("Couldn't connect with this host and token");
        }
      );
    }
    catch (err) {
    }
  }
}
