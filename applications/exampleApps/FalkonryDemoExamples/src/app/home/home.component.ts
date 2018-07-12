import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  constructor(private http: HttpClient, private router:Router) { 
  }

  ngOnInit() {
  }

  selectExample(example: string){
      this.connected = sessionStorage.getItem("connected");
      if(this.connected){
        sessionStorage.setItem("start", JSON.stringify(true));
        if(example == "Machine"){
          this.http.post("/example/",   JSON.stringify({example: 1}), httpOptions).subscribe();
        } else if(example == "Weather"){
          this.http.post("/example/",   JSON.stringify({example: 2}), httpOptions).subscribe();
        }
        sessionStorage.setItem("example", example);
        this.router.navigate(['example']);
      }
      else
        alert("Please Enter a valid host and token");
  }
}
