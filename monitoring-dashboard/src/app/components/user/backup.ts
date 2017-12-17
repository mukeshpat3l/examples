import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {EventSourcePolyfill} from 'ng-event-source';
import{EventSourceInit} from 'ng-event-source';
import {ViewChild} from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})


export class UserComponent implements OnInit 
{ 
  @ViewChild('cchart') cchart;
  assesments:Assesment[];
  assessment_id:string;
  host:string;
  api_key:string;
  data_table_timeline=new Array();
  URL:string;
  output=[];
  values:any[];
  pairs:any=new Array();
  entity:string;
  fetched_assessments:any = [];
  selectedValue:any= null;
 
  columnChartData =  {
    chartType: 'ColumnChart',
    dataTable: [['Label', 'Frequency',{ role: 'style' }]],
    options: {'title': 'Assesment',
                'height':300,'width':300,
                'titleTextStyle':{fontName:"Calibri",fontSize:17},
                legend:{position:"none"}},
  };
  timelineChartData2:any =  {
    chartType: 'Timeline',
    groupByRowLabel:false,
    
    dataTable: [
      ['Label','Name', 'From', 'To'],
      [ 'Condition','Washington', new Date(1509954840000), new Date(1509954843000) ],
      [ 'Condition','Washington', new Date(1509954843000), new Date(1509954847000) ],
      [ 'Condition','Jefferson',  new Date(1509954847000) ,  new Date(1509954857000)]
    ],
    options:{
      timeline:{showRowLabels: false},
    }
 };

 timelineChartData={
    chartType:'Timeline',
    dataTable:[],
    options:{
      timelines:{showRowLabels: false} ,
      title:'Timeline',
      groupByRowLabel: false ,
      height:300,width:700
    },
  };
  constructor(private dataService:DataService) 
  {
   
    
  }
  
  Filter(value:any)
  { 
    this.cchart.wrapper.getDataTable().addColumn('string',"Type");
    this.cchart.wrapper.getDataTable().addColumn('string',"Class");
    this.cchart.wrapper.getDataTable().addColumn('date',"Start");
    this.cchart.wrapper.getDataTable().addColumn('date',"End");
    alert(value.slice(2));
    this.assessment_id=value.slice(3);
    this.getLiveData();
    
  }
  public changeData2():void {
    /*
    if(this.cchart.wrapper.getChart()!= null)
    { 
      this.cchart.wrapper.getChart().clearChart();
      console.log("Data Table",this.cchart.wrapper.getDataTable())
      
    }
    console.log("New Table",this.data_table_timeline);
    this.cchart.wrapper.setDataTable(this.data_table_timeline);*/
    //this.cchart.wrapper.getDataTable(this.timelineChartData.dataTable);
    console.log("Chart Data",this.cchart.wrapper.getDataTable());
    this.cchart.wrapper.draw();
  }
  
  
  getLiveData()
  {
    var eventSourceInitDict={headers:{Authorization:"Bearer ".concat(this.api_key)}};
    this.URL=this.host+"/"+this.assessment_id+"/output";
    const output=new EventSourcePolyfill(this.URL,eventSourceInitDict);
    var counter=0
    output.onmessage=evt=>{

      const data=evt.data;
      console.log("Raw",data);
      console.log("JSONify",JSON.parse(data));
      var json_data=JSON.parse(data);
      this.output.push(json_data);
      this.assesments=this.output;
      console.log("Final",this.output);
      counter=counter+1;
      if(counter%5==0)
      {
        this.update_TimeLineChart(this.assesments);
        console.log("TimeLine Chart Data",this.timelineChartData.dataTable);
        console.log("TimeLine Chart Data",this.timelineChartData2.dataTable);
        this.changeData2();
      }


    }
  }
  onSubmit(value:any)
  {
    //console.log(value);
    this.host=value.host;
    this.api_key=value.api;
    this.dataService.getAssesments(this.host,this.api_key).subscribe((assesments)=>{
      
      assesments.forEach(element => {
        //console.log("From Falkonry server",element);
        
        this.fetched_assessments.push(element);
        //console.log("Assessments",this.fetched_assessments)
      });
    });
  }
  update_TimeLineChart(assessments)
  {
    console.log("Inside Chart",assessments);
    var episodes=[];
    //var colors=["#0288D1","#F44336","#FFD740"];
    var len=assessments.length-1;
    
    var used_colors=[];
    
    
    this.entity=assessments[0]["entity"];
    var index=0;
  
    //console.log(new Date(1509954847000));
    //convert output array into episodes
    //len=assessments.length-1;
    while(index<len) {
      var start_time=parseInt(assessments[index]["time"]);
      start_time=start_time/1000;
      var value=assessments[index]["value"];
      var i=index;
      var x=assessments[i]["value"];
      var y= assessments[index]["value"];
      while(assessments[i]["value"]===assessments[index]["value"] && i<len)
      {
        i=i+1;
      
      }
      index=i;
      var end_time=parseInt(assessments[index]["time"]);
      end_time=end_time/1000;
      //console.log("endtime",end_time);
      episodes.push(["Condition",value,new Date(start_time),new Date(end_time)]);
      //console.log("Episodes",episodes);
    }
    index=0;
    let num=this.cchart.wrapper.getDataTable().getNumberOfRows();
    console.log("Number of rows before",num);
    this.cchart.wrapper.getDataTable().removeRows(0,num);
    console.log("Number of rows after",this.cchart.wrapper.getDataTable().getNumberOfRows());
    episodes.forEach(element => {
      this.cchart.wrapper.getDataTable().addRow(element);

    });
  }
  update_ColumnChart(assessments)
  {
    var colors=["#0288D1","#F44336","#FFD740"];
    var values=new Array();
    var color_len=colors.length;
    var rand=Math.round(Math.random()*color_len) + 1;
    var len=assessments.length;
    for (var index = 0; index < len; index++) {
      
        values.push(assessments[index]["value"]);
      
    }
    var counts={};
    //set operation on values
    var set=(Array.from(new Set(values)));
    //make initial count of each element zero
    set.forEach(element => {
      counts[element]=0;
    });
    //count frequency of each element
    set.forEach(element => {
      values.forEach(element2 => {
        if(element==element2)
        {
          counts[element]=counts[element]+1;
        }
      });
    });
    var counter=0;
    //find final percentage
    set.forEach(element => {
      var flag=0;
      
      rand=Math.floor(Math.random()*color_len);
      //console.log("Random",rand);
      this.columnChartData.dataTable.push([element,counts[element]/len,colors[counter]])
      counter=counter+1;
      
    });
    //console.log("Final",this.columnChartData.dataTable);
  }
  ngOnInit() 
  {
    //var colors=["red","pink","purple","deep-purple","indigo","blue","light-blue","teal","green","lime","yellow","orange","deep-orange","brown","blue-grey"]
    
    //this.update_TimeLineChart(this.assesments);
    //this.update_ColumnChart(this.assesments);
    
    
    

    }
   
    
    
 
   
  }
  

interface Assesment{
  time:string,
  entity:string,
  value:number

}



 