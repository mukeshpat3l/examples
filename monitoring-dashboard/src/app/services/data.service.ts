import { Injectable } from '@angular/core';
import{ Http,Response} from '@angular/http';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {RequestOptions} from '@angular/http';
import {Headers} from '@angular/http';
import {EventSourcePolyfill} from 'ng-event-source';
import 'rxjs/add/operator/map';
@Injectable()
export class DataService {
  private headers = new Headers();
  private options:RequestOptions;
  result:any;
  
  
  constructor(private http:Http) 
  { 
    
    console.log("Data service connected");
    var obj;
    
  }
  getLiveJSON()
  {
   
    
    
  }
  getJson(){
    
    let data='[{"time":"1509954840000", "entity": "P123", "value":"1"},'
    +'{"time":"1509954841000", "entity": "P123", "value":"3"},'                                            
    +'{"time":"1509954842000", "entity": "P123", "value":"2"},'
    +'{"time":"1509954843000", "entity": "P123", "value":"2"},'
    +'{"time":"1509954844000", "entity": "P123", "value":"2"},'
    +'{"time":"1509954845000", "entity": "P123", "value":"1"},'
    +'{"time":"1509954846000", "entity": "P123", "value":"2"},'
    +'{"time":"1509954847000", "entity": "P123", "value":"1"},'
    +'{"time":"1509954848000", "entity": "P123", "value":"1"},'
    +'{"time":"1509954849000", "entity": "P123", "value":"2"},'
    +'{"time":"1509954850000", "entity": "P123", "value":"2"},'
    +'{"time":"1509954851000", "entity": "P123", "value":"3"},'
    +'{"time":"1509954852000", "entity": "P123", "value":"3"},'
    +'{"time":"1509954853000", "entity": "P123", "value":"1"},'
    +'{"time":"1509954854000", "entity": "P123", "value":"1"},'
    +'{"time":"1509954855000", "entity": "P123", "value":"2"}'
    +']'
    return data;
  }

  
  getAssesments( host:string,api_key:string){
    this.headers = new Headers();
    host=host+"/assessment"
    this.headers.set("Authorization", "Bearer ".concat(api_key));
    //const headers = new HttpHeaders().set("Authorization", "Bearer jyllg9c76nc4c44k6wvkck7y6pl9b27k");
    //this.options.headers({headers:this.headers});
    //4tbcp67c89rpqp2k2wjygcvtrdtcmlmv
    //https://dev.falkonry.ai/assessment
    //this.headers.append("Authorization", "Bearer jyllg9c76nc4c44k6wvkck7y6pl9b27k");
    this.options=new RequestOptions({headers:this.headers})
    console.log(this.headers.keys());
    console.log(this.http.get(host,this.options).map(result=>this.result=result.json()));
    return this.http.get(host,this.options).map(result=>this.result=result.json());
  
    }
}
