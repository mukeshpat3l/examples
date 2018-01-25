import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {EventSourcePolyfill} from 'ng-event-source';
import{EventSourceInit} from 'ng-event-source';
import {ViewChild} from '@angular/core';
import { ChartErrorEvent } from 'ng2-google-charts';
declare var require:any;
declare var $:any;
var randomColor = require('randomcolor');

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})


export class UserComponent implements OnInit 
{ 
  @ViewChild('cchart') cchart;
  @ViewChild('ctchart') column_chart;
  assesments:Assessment[];
  html='<table style="width:100%;border:1px solid #ddd;"><tr style="background-color:beige"><td style="border-bottom: 1px solid #ddd;padding:5px">Label</td><td style="border-bottom: 1px solid #ddd;padding:5px">Unlabeled 1</td> </tr><tr ><td style="border-bottom: 1px solid #ddd;padding:5px">Start</td><td style="border-bottom: 1px solid #ddd;padding:5px">6/12/2017grttrbrtbybytb</td> </tr><tr><td style="padding:5px;">End</td><td style="padding:5px;">7/12/2017</td> </tr></table>'
  assessment_for_selected_entity:Assessment[];
  assessment_id:string;
  colors:any={};
  assessment_dict={};
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
  list_of_entities=[];
  selectedEntity:any=null;
  selected_entity:string;
  
  columnChartData =  {
    chartType: 'ColumnChart',
    dataTable:[[{type:'string',id:"Label"}, {type:'number',id:"Frequency"},{ role: 'style' }]],
    options: {'title': 'Percentage Distribution of Assessments',
                'height':window.screen.availHeight*0.4,'width':window.screen.availWidth*0.4,
                'vAxis':{maxValue:110,minValue:0},
                'titleTextStyle':{fontName:"Calibri",fontSize:17},
                legend:{position:"none"}},
  };


 timelineChartData={
    chartType:'Timeline',
    dataTable:[[{type:'string',id:"Type"},{type:'string',id:"Class",label:""},{ type: 'string', role: 'tooltip','p': {'html': true}},{type:'datetime',id:"Start"},{type:'datetime',id:"End"}],
    ["Condition","Label X",this.generate_custom_HTML("Unlabeled X",new Date(Date.now()),new Date(Date.now())),Date.now(),new Date(Date.now()+14400000)]],
    groupByRowLabel:false,
    options:{
      timelines:{showRowLabels: false},
      title:'Timeline',
      colors:["white"],
      groupByRowLabel: false ,
      height:300,width:window.screen.availWidth*0.9,
      timeline:{showBarLabels: false},
      tooltip: { isHtml: true },
      hAxis:{
        format:'M/d/yy HH:mm:ss',
        viewWindow: {
          min: new Date(Date.now()),
          max: new Date(Date.now()+24400000)
        },
        /*
        gridlines:{
          count:10,
          units:{
            days:{format:['dd/MM/yyy','dd/MM']},
            hours:{format:['dd/MM/yyyy HH:mm:ss',"HH"]},
            minutes:{format:['mm','mm:ss']},
            seconds:{format:['ss:SSS']}
          }
        },
        minorGridlines: {
          count:-1,
          units: {
            hours: {format: ['hh:mm:ss a', 'ha']},
            minutes: {format: ['HH:mm a Z', ':mm']}
          }
        }*/
      }
      
    }
  };
  constructor(private dataService:DataService) 
  {
   
    
  }
  
  Filter_Assessment(value:any)
  { 
    
    
   
    this.assessment_id=value.slice(3);
    this.getLiveData();
    
  }
  Filter_Entity(value:any)
  {  
    this.colors={};
    this.draw_charts_for_selected_entity(value.slice(3));
  }
  public changeData2():void 
  {
    this.cchart.wrapper.draw();
    this.column_chart.wrapper.draw();
  }
  
  getLiveData()
  {
    var eventSourceInitDict={headers:{Authorization:"Bearer ".concat(this.api_key)}};
    this.URL=this.host+"/assessment"+"/"+this.assessment_id+"/output";
    const output=new EventSourcePolyfill(this.URL,eventSourceInitDict);
    var counter=0
    
    output.onmessage=evt=>{
      const data=evt.data;
      var json_data=JSON.parse(data);
      console.log("JSON",json_data);
      
      if(!this.list_of_entities.includes(json_data["entity"]))
      {
        this.list_of_entities.push(json_data["entity"]);
        this.assessment_dict[json_data["entity"]]=[];
      
      }
      
      let entity=json_data["entity"];
      let flag_for_duplicate=0;
      this.assessment_dict[entity].forEach(element => {
        if(element["time"]==json_data["time"])
        {
          flag_for_duplicate=1;
        }
      });
      if(flag_for_duplicate==0)
      { 
        
        this.assessment_dict[entity].push(json_data);
        counter=counter+1;
      }
      console.log("Assessment dict",this.assessment_dict[entity])
      if(counter%5==0)
      { 
        this.update_color_list(this.assessment_dict[this.selected_entity]);
        this.update_ColumnChart(this.assessment_dict[this.selected_entity]);
        this.update_TimeLineChart(this.assessment_dict[this.selected_entity]);
        this.timelineChartData.options.colors=[];
        Object.values(this.colors).forEach(element => {
          this.timelineChartData.options.colors.push(element);
        });
        
        this.changeData2();
      }


    }
  }
  getLiveData_with_cahce_cleaning()
  {
    var eventSourceInitDict={headers:{Authorization:"Bearer ".concat(this.api_key)}};
    this.URL=this.host+"/assessment"+"/"+this.assessment_id+"/output";
    const output=new EventSourcePolyfill(this.URL,eventSourceInitDict);
    var counter=0
    
    output.onmessage=evt=>{
      const data=evt.data;
      var json_data=JSON.parse(data);
      if(!this.list_of_entities.includes(json_data["entity"]))
      {
        this.list_of_entities.push(json_data["entity"]);
        this.assessment_dict[json_data["entity"]]=[];
        
      }
      let entity=json_data["entity"];
      let flag_for_duplicate=0;
      this.assessment_dict[entity].forEach(element => {
        if(element["time"]==json_data["time"])
        {
          flag_for_duplicate=1;
        }
      });

      if(flag_for_duplicate==0)
      { 
        
        this.assessment_dict[entity].push(json_data);
        counter=counter+1;
      }
      let len_of_assessments=(this.assessment_dict[entity]).length-1;
      console.log("Time difference",(this.assessment_dict[entity][len_of_assessments]["time"]/1000)-(this.assessment_dict[entity][0]["time"]/1000))
      while((this.assessment_dict[entity][len_of_assessments]["time"]/1000)-(this.assessment_dict[entity][0]["time"]/1000)>=10000)
      { 
        
        this.assessment_dict[entity].splice(0,1);
        len_of_assessments=(this.assessment_dict[entity]).length-1
        console.log("The time window increasred more than 60 secs",this.assessment_dict[entity])
        console.log("Time difference",this.assessment_dict[entity][len_of_assessments]["time"]/1000-this.assessment_dict[entity][0]["time"]/1000)
      }
      console.log("Assessment dict",this.assessment_dict[entity])
      if(counter%5==0)
      { 
        this.update_color_list(this.assessment_dict[this.selected_entity]);
        this.update_ColumnChart(this.assessment_dict[this.selected_entity]);
        this.update_TimeLineChart(this.assessment_dict[this.selected_entity]);
        this.timelineChartData.options.colors=[];
        Object.values(this.colors).forEach(element => {
          this.timelineChartData.options.colors.push(element);
        });
        
        this.changeData2();
      }


    }
  }
  draw_charts_for_selected_entity(entity)
  {
    this.selected_entity=entity;
    this.list_of_entities.forEach(element => {
      this.assessment_dict[element]=[];
    });
    this.update_color_list(this.assessment_dict[this.selected_entity]);
    this.update_ColumnChart(this.assessment_dict[this.selected_entity]);
    this.update_TimeLineChart(this.assessment_dict[this.selected_entity]);
    this.timelineChartData.options.colors=[];
    Object.values(this.colors).forEach(element => {
      this.timelineChartData.options.colors.push(element);
    });
    
    this.changeData2();
  }
  onSubmit(value:any)
  {
    this.host=value.host;
    this.api_key=value.api;
    this.dataService.getAssesments(this.host,this.api_key).subscribe((assesments)=>{
      
      assesments.forEach(element => {
        this.fetched_assessments.push(element);
      });
    });
  }

  update_TimeLineChart(assessments)
  {
    
    var episodes=[];
    var len=assessments.length-1;
    this.entity=assessments[0]["entity"];
    var index=0;
    while(index<=len) {
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
      //if(start_time==end_time)
      //{
        //end_time=start_time+10000;
      //}
      var tooltip_text:string= (value+" Start:"+start_time.toString()+" End:"+end_time.toString());
      episodes.push(["Condition",value,this.generate_custom_HTML(value,new Date(start_time),new Date(end_time)),new Date(start_time),new Date(end_time)]);
      if(index==len)
      {  
        episodes.push(["Condition",assessments[index]["value"],this.generate_custom_HTML(assessments[index]["value"],new Date(end_time),new Date(end_time+1000)),new Date(end_time),new Date(end_time+1000)]);
        index++;
      }
    }
    index=0;
    let num=this.cchart.wrapper.getDataTable().getNumberOfRows();
    this.cchart.wrapper.getDataTable().removeRows(0,num);  
    //console.log("Episodes",assessments,episodes,);
    episodes.forEach(element => {
      //console.log("Entered");
      this.cchart.wrapper.getDataTable().addRow(element);

    });

  }
  
  update_color_list(assessments)
  {
    var values=[];
    assessments.forEach(element => {
      values.push(element["value"]);
    });
    var set=(Array.from(new Set(values)));
    var conditions=Object.keys(this.colors);
    set.forEach(element => {
      if(conditions.includes(element)==false)
      {   var new_color=randomColor();
          while(Object.values(this.colors).includes(new_color))
          {
            new_color=randomColor();
          }
          this.colors[element]=new_color;
      }
    });

  }
   
   remove(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
}
  update_ColumnChart(assessments)
  {
    
    var colors=this.colors;
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
    //find final percentage
    let num=this.column_chart.wrapper.getDataTable().getNumberOfRows();
    this.column_chart.wrapper.getDataTable().removeRows(0,num);
    set.forEach(element => {
      var new_row=[element,(counts[element]/len*100),colors[element]];
      this.column_chart.wrapper.getDataTable().addRow(new_row);
     
    });
  }
  
  public error_column(event: ChartErrorEvent) {
   
    console.log("Error",event.id,event.message,event.options)

  }
  public error_timeline(event: ChartErrorEvent) {
  
    console.log("Error",event.id,event.message,event.detailedMessage,event.options)
   
    
  }
  ngOnInit() 
  { 
  
    

  }
  generate_custom_HTML(value,Start,End){
    return '<table style="width:100%;border:1px solid #ddd;">'+
    '<tr style="background-color:beige">'+
        '<td style="border-bottom: 1px solid #ddd;padding:5px">Label</td>'+
       '<td style="border-bottom: 1px solid #ddd;padding:5px">'+value+'</td>' +
    '</tr>'+
    '<tr >'+
       ' <td style="border-bottom: 1px solid #ddd;padding:5px">Start</td>'+
        '<td style="border-bottom: 1px solid #ddd;padding:5px">'+Start+'</td> '+
    '</tr>'+
    '<tr>'+
       '<td style="padding:5px;">End</td>'+
       '<td style="padding:5px;">'+End+'</td>' +
    '</tr>'+
   ' </table>';
  }
    
    
 
   
  }
  

interface Assessment{
  time:string,
  entity:string,
  value:number

}




 