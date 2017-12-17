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
  timelineChartData_dummy={
    chartType:'Timeline',
    dataTable:[[{type:'string',id:"Name"},{type:'date',id:"Start"},{type:'date',id:"End"}],
    [ 'object1', new Date(1379916757000), new Date(1379923942000) ],
    [ 'object1', new Date(1379924457000), new Date(1379931125000) ],
    [ 'object1', new Date(1379934696000), new Date(1379937382000) ],
    [ 'object1', new Date(1379938725000), new Date(1379942554000) ],
    [ 'object1', new Date(1379995625000), new Date(1380001120000) ],
    [ 'object1', new Date(1380001500000), new Date(1380006472000) ],
    [ 'object1', new Date(1380007500000), new Date(1380013540000) ],
    [ 'object1', new Date(1380024577000), new Date(1380029148000) ],
    [ 'object1', new Date(1380081020000), new Date(1380082024000) ],
    [ 'object1', new Date(1380082164000), new Date(1380096738000) ],
    [ 'object1', new Date(1380097117000), new Date(1380101617000) ],
    [ 'object1', new Date(1380103046000), new Date(1380103291000) ],
    [ 'object1', new Date(1380106830000), new Date(1380107262000) ],
    [ 'object2', new Date(1379918755000), new Date(1379919343000) ],
    [ 'object2', new Date(1379919910000), new Date(1379921128000) ],
    [ 'object2', new Date(1379922700000), new Date(1379923315000) ],
    [ 'object2', new Date(1379930896000), new Date(1379932157000) ],
    [ 'object2', new Date(1379939296000), new Date(1379940439000) ],
    [ 'object2', new Date(1379940692000), new Date(1379942011000) ],
    [ 'object2', new Date(1379998917000), new Date(1380002753000) ],
    [ 'object2', new Date(1380003852000), new Date(1380010496000) ],
    [ 'object2', new Date(1380010741000), new Date(1380016891000) ],
    [ 'object2', new Date(1380024750000), new Date(1380028089000) ],
    [ 'object2', new Date(1380028713000), new Date(1380029507000) ],
    [ 'object2', new Date(1380083078000), new Date(1380085672000) ],
    [ 'object2', new Date(1380090546000), new Date(1380096792000) ],
    [ 'object2', new Date(1380100067000), new Date(1380100365000) ],
    [ 'object2', new Date(1380100946000), new Date(1380101557000) ],
    [ 'object3', new Date(1379919119000), new Date(1379919700000) ],
    [ 'object3', new Date(1379920713000), new Date(1379922406000) ],
    [ 'object3', new Date(1379923170000), new Date(1379923924000) ],
    [ 'object3', new Date(1379940029000), new Date(1379941614000) ],
    [ 'object3', new Date(1380002191000), new Date(1380004319000) ],
    [ 'object3', new Date(1380007848000), new Date(1380008123000) ],
    [ 'object3', new Date(1380013504000), new Date(1380014096000) ],
    [ 'object3', new Date(1380024753000), new Date(1380027257000) ],
    [ 'object3', new Date(1380090624000), new Date(1380092432000) ],
    [ 'object3', new Date(1380094124000), new Date(1380102392000) ]],
    options:{
      width: 900,
      height: 500,
      legend: {position: 'none'},
      enableInteractivity: false,
      chartArea: {
        width: '85%'
      },
      hAxis: {
        viewWindow: {
          min: new Date(2013, 9, 13),
          max: new Date(2015, 0, 3, 1)
        },
        gridlines: {
          count: -1,
          units: {
            days: {format: ['dd.MM.yyyy']},
            hours: {format: ['HH:mm', 'hh']},
            minutes: {format: ['HH:mm', ':mm']}
          }
        },
        minorGridlines: {
          units: {
            days: {format: ['dd.MM.yyyy']},
            hours: {format: ['hh:mm:ss', 'hh']},
            minutes: {format: ['HH:mm', ':mm']}
          }
        }
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




 