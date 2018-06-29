import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {
  isCompleted=false;
  dataStreamHidden = true;
  addDataHidden = true;
  learningPatternHidden = true;
  liveMontoringHidden = true;
  data: any = [];

  constructor(private http: HttpClient) { 
    this.getStatus();
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async getStatus(){
    while(true){
      await this.delay(5000);
      this.http.get("http://127.0.0.1:8000/test/").map(res => res).subscribe(response => {
      this.data = response;
      console.log(this.data);
      this.dataStreamHidden = !this.data[0]["datastream"];
      this.addDataHidden = !this.data[0]["addFacts"];
      this.learningPatternHidden = !this.data[0]["modelCreated"];
      this.liveMontoringHidden = !this.data[0]["liveMonitoring"];
    })
    if(!this.dataStreamHidden && !this.addDataHidden && !this.learningPatternHidden && !this.liveMontoringHidden){
      break;
    }
    }
    this.isCompleted = true;
  }

  ngOnInit() {}
}
