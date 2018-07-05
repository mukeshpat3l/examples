import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

export interface DialogData {
}

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})

export class ExampleComponent implements OnInit {
  isCompleted=false;
  dataStreamCompleted = false;
  addDataCompleted = false;
  learningPatternCompleted = false;
  liveMonitoringCompleted = false;
  dataStreamSpinner = true;
  addDataSpinner = false;
  learningPatternSpinner = false;
  liveMonitoringSpinner = false;
  data: any = [];

  constructor(private http: HttpClient, private router: Router, @Inject(LOCAL_STORAGE) private storage: WebStorageService) {
    if(this.storage.get("connected")){
      this.getStatus();
      this.storage.set("connected", false);
    }
    else
      this.router.navigate(['/']);
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async getStatus(){
    while(true){
      await this.delay(5000);
      this.http.get("http://127.0.0.1:8000/status/").map(res => res).subscribe(response => {
      this.data = response;
      console.log(this.data);
      this.dataStreamCompleted = this.data[0]["datastream"];
      this.addDataCompleted = this.data[0]["addFacts"];
      this.learningPatternCompleted = this.data[0]["modelCreated"];
      this.liveMonitoringCompleted = this.data[0]["liveMonitoring"];

      if(this.liveMonitoringCompleted)
        this.disableAllSpinners()
      else if(this.learningPatternCompleted)
        this.setLiveMonitoringSpinner();
      else if(this.addDataCompleted)
        this.setLearningPatternSpinner();
      else if(this.dataStreamCompleted)
        this.setAddDataSpinner();
    })
    if(this.liveMonitoringCompleted){
      break;
    }
    }
    this.isCompleted = true;
  }

  disableAllSpinners(){
     this.dataStreamSpinner = this.addDataSpinner = this.learningPatternSpinner = this.liveMonitoringSpinner = false;
  }

  setAddDataSpinner(){
    this.addDataSpinner = true;
    this.dataStreamSpinner = this.learningPatternSpinner = this.liveMonitoringSpinner = false;
  }

  setLearningPatternSpinner(){
    this.learningPatternSpinner = true;
    this.addDataSpinner = this.dataStreamSpinner = this.liveMonitoringSpinner = false;
  }

  setLiveMonitoringSpinner(){
    this.liveMonitoringSpinner = true;
    this.addDataSpinner = this.learningPatternSpinner = this.dataStreamSpinner = false;
  }

  deleteClicked() {
    this.http.post("http://127.0.0.1:8000/delete/", JSON.stringify({"delete": "true"}), httpOptions).subscribe();
    this.router.navigate(['/']);
  }

  ngOnInit() {}
}

