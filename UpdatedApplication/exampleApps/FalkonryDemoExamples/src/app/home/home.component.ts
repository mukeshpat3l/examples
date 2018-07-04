import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  host;
  token;
  connected;
  someThing = true;
  constructor(private http: HttpClient, @Inject(LOCAL_STORAGE) private storage: WebStorageService, private router:Router) { }

  ngOnInit() {
  }

  selectExample(example: string){
      this.connected = this.storage.get("connected");
      console.log(this.connected);
      if(this.connected){
        this.http.post("http://127.0.0.1:8000/example/",   JSON.stringify({example: example}), httpOptions).subscribe();
        this.router.navigate(['/example']);
        this.storage.set("connected", false);
      }
      else
        alert("Please Enter a valid host and token");
  }
}
