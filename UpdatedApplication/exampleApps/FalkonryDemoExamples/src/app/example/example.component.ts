import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Inject} from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

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
  dataStreamHidden = true;
  addDataHidden = true;
  learningPatternHidden = true;
  liveMontoringHidden = true;
  data: any = [];

  constructor(private http: HttpClient, private router: Router,public dialog: MatDialog) { 
    this.getStatus();
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
  goToExample(){
    this.router.navigate(['/example']);
  }
  
  deleteClicked() {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: "You sure to delete the datastream?"
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    this.http.post("http://127.0.0.1:8000/delete/", JSON.stringify({"delete": "true"}), httpOptions).subscribe();
    this.router.navigate(['/']);
  }

  ngOnInit() {}
}

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
