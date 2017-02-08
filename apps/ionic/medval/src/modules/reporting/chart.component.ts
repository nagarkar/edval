/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {Component, ViewChild, Input} from "@angular/core";
import {CampaignService} from "../../services/campaign/delegator";
import {Chart} from "chart.js";
import {Utils} from "../../shared/stuff/utils";
import {NavParams} from "ionic-angular";
import {DailyDataService} from "../../services/reporting/delegator";
import {DailyDataList, DailyData} from "../../services/reporting/schema";

@Component({
  selector: 'rev-chart',
  template: `
    <ion-content class="m-t-8">
      <ion-card>
        <ion-card-header>
          {{header}}
        </ion-card-header>
        <ion-card-content>
          <canvas #barCanvas></canvas>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
})
export class ChartComponent {

  @ViewChild('barCanvas') barCanvas;
  barChart: any;

  @Input()
  header: string;

  @Input()
  chartType: ChartType = ChartType.bar;

  @Input()
  subject: string;

  @Input()
  startTime: number;

  @Input()
  endTime: number;

  static colors: string[] = Utils.shuffle([
    'AliceBlue','AntiqueWhite','Aqua','Aquamarine','Azure','Beige','Bisque','Black','BlanchedAlmond','Blue','BlueViolet','Brown','BurlyWood','CadetBlue','Chartreuse','Chocolate','Coral','CornflowerBlue','Cornsilk','Crimson','Cyan','DarkBlue','DarkCyan','DarkGoldenRod','DarkGray','DarkGrey','DarkGreen','DarkKhaki','DarkMagenta','DarkOliveGreen','DarkOrange','DarkOrchid','DarkRed','DarkSalmon','DarkSeaGreen','DarkSlateBlue','DarkSlateGray','DarkSlateGrey','DarkTurquoise','DarkViolet','DeepPink','DeepSkyBlue','DimGray','DimGrey','DodgerBlue','FireBrick','FloralWhite','ForestGreen','Fuchsia','Gainsboro','GhostWhite','Gold','GoldenRod','Gray','Grey','Green','GreenYellow','HoneyDew','HotPink','IndianRed','Indigo','Ivory','Khaki','Lavender','LavenderBlush','LawnGreen','LemonChiffon','LightBlue','LightCoral','LightCyan','LightGoldenRodYellow','LightGray','LightGrey','LightGreen','LightPink','LightSalmon','LightSeaGreen','LightSkyBlue','LightSlateGray','LightSlateGrey','LightSteelBlue','LightYellow','Lime','LimeGreen','Linen','Magenta','Maroon','MediumAquaMarine','MediumBlue','MediumOrchid','MediumPurple','MediumSeaGreen','MediumSlateBlue','MediumSpringGreen','MediumTurquoise','MediumVioletRed','MidnightBlue','MintCream','MistyRose','Moccasin','NavajoWhite','Navy','OldLace','Olive','OliveDrab','Orange','OrangeRed','Orchid','PaleGoldenRod','PaleGreen','PaleTurquoise','PaleVioletRed','PapayaWhip','PeachPuff','Peru','Plum','PowderBlue','RebeccaPurple','RosyBrown','RoyalBlue','Salmon','SeaGreen','SeaShell','Silver','SkyBlue','SlateBlue','SpringGreen','SteelBlue','Teal','Thistle','Turquoise','Violet','Wheat','WhiteSmoke','Yellow','YellowGreen'
  ])

  constructor(private campaignsvc: CampaignService, navParams: NavParams, private datasvc: DailyDataService) {
    this.chartType = navParams.get('chartType') || this.chartType;
    this.header = navParams.get('header') || this.header;
    this.subject = navParams.get('subject');
    this.startTime = navParams.get('startTime');
    this.endTime = navParams.get('endTime');
  }

  private getDailyDataList(): DailyDataList {
    let list: DailyDataList = new DailyDataList();
    list.subject = this.subject;
    list.endTime = this.endTime;
    list.startTime = this.startTime;
    return list;
  }

  ionViewDidLoad() {
    let dataList: DailyDataList = this.getDailyDataList();
    this.datasvc.get(dataList.id).then((_dataList: DailyDataList)=>{
      dataList.list = _dataList.list;
      this.processDataList(dataList);
    });
  }

  private processDataList(dataList: DailyDataList) {
    let color = ChartComponent.colors[0];
    let data: number[] = [];
    dataList.list.forEach((ddata: DailyData)=>{
      let count = ddata.aggregate.count;
      let sum = ddata.aggregate.sum;
      data.push(sum/count);
    });
    let labels = new Array<string>(dataList.list.length);
    let chartDataSets = {
      type: this.chartType,
      data: {
        labels: labels,
        datasets: []
      }
    }
    let chartData = {
      label: dataList.subject,
      fill: false,
      lineTension: 0.1,
      backgroundColor: color,
      borderColor: color,
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: color,
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointRadius: 1,
      pointHitRadius: 10,
      data: data,
      spanGaps: false,
    }
    chartDataSets.data.datasets.push(chartData);
    this.barChart = new Chart(this.barCanvas.nativeElement, chartDataSets);
  }

  ngOnInit() {
    if (this.campaignsvc.inMockMode()) {
      setTimeout(()=> {
        alert('This is a demonstration page. It is not pulling real data.')
      }, 1000);
    }
  }
}

export enum ChartType {
  bar, line
}
