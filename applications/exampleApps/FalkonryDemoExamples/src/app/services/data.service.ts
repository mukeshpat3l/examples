import { Injectable } from '@angular/core';
import{ Http } from '@angular/http';
import {RequestOptions} from '@angular/http';
import {Headers} from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class DataService {
  private headers = new Headers();
  private options:RequestOptions;
  result:any;
  constructor(private http:Http){ console.log("Data service connected");}
  getLiveJSON(){}
  getAssesments( host:string,api_key:string){
    this.headers = new Headers();
    host=host+"/assessment"
    this.headers.set("Authorization", "Bearer ".concat(api_key));
    this.options=new RequestOptions({headers:this.headers});
    return this.http.get(host,this.options).map(result=>this.result=result.json());
    }

  getDatastream( host:string,api_key:string,datastream_id:string){
    this.headers = new Headers();
    host=host+"/datastream/"+datastream_id;
    this.headers.set("Authorization", "Bearer ".concat(api_key));
    this.options=new RequestOptions({headers:this.headers});
    return this.http.get(host,this.options).map(result=>this.result=result.json());
  }
  
  getEntityMeta( host:string,api_key:string,datastream_id:string){
    this.headers = new Headers();
    host=host+"/datastream/" + datastream_id + "/entityMeta";
    this.headers.set("Authorization", "Bearer ".concat(api_key));
    this.options=new RequestOptions({headers:this.headers});
    return this.http.get(host,this.options).map(result=>this.result=result.json());
  }

}
