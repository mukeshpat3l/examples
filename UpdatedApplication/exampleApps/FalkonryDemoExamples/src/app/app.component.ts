import { Component } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  myData: Array<Response>;
  host;
  token;

  constructor(private http:HttpClient) {
  }

  connect(){
    console.log(this.host)
    console.log(this.token)
    this.http.post("http://127.0.0.1:8000/index/",   JSON.stringify({host: "https://"+this.host, token: this.token}), httpOptions).subscribe();
  }
}
