import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-googlechart',
  templateUrl: './googlechart.component.html',
  styleUrls: ['./googlechart.component.css']
})
export class GooglechartComponent implements OnInit {
  pieChartData =  {
    chartType: 'PieChart',
    dataTable: [
      ['Task', 'Hours per Day'],
      ['Work',     11],
      ['Eat',      2],
      ['Commute',  2],
      ['Watch TV', 2],
      ['Sleep',    7]
    ],
    options: {'title': 'Tasks'},
  };
  constructor() { }

  ngOnInit() {
  }

}
