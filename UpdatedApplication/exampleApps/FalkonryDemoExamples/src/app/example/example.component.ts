import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {
  isClicked=false;
  dataStreamHidden = true;
  addDataHidden = true;
  learningPatternHidden = true;
  liveMontoringHidden = true;

  changeIsClicked() {
    this.isClicked = !this.isClicked;
  }

  constructor() { }

  ngOnInit() {
  }

  showDatastream(){
    this.dataStreamHidden = false;
  }

  showAddData(){
    this.addDataHidden = false;
  }

  showLearningPattern(){
    this.learningPatternHidden = false;
  }

  showLiveMonitoring(){
    this.liveMontoringHidden = false;
  }

  // showAll(){
  //   this.showDatastream();
  //   this.showAddData();
  //   this.showLearningPattern();
  //   this.showLiveMonitoring();
  // }

}
