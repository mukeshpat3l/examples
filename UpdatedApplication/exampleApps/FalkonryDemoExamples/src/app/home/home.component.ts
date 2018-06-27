import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


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

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  selectExample(example: string){
    console.log(example);
    this.http.post("http://127.0.0.1:8000/example/",   JSON.stringify({example: example}), httpOptions).subscribe();
  }

}
