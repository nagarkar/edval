/**
 * Created by chinmay on 2/25/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component, ViewChild, ElementRef} from "@angular/core";
import {ChartService} from "../chart.service";
import {BaseChartComponent} from "../base.chart.component";
import {NavParams, AlertController} from "ionic-angular";
import {Filters} from "../filters";
import {QueryUtils} from "../query.utils";
import {AccountService} from "../../../services/account/delegator";
import {StaffService} from "../../../services/staff/delegator";
import {MetricAndSubject} from "../metric.subject";
import {Formatters} from "../formatters";

declare let google;

@Component({
  selector: 'promoterchart',
  template: `
    <div class="border-around-text" style="background-color:aliceblue" padding>      
      <div #dashboard>
        <div #metricSelector></div>
        <div #promoterdetractorchart></div>
      </div>
      <div #dashboard2 padding>
        <div #metricSelector2></div>
        <div #metricValueChart></div>
      </div>
      <div #errorDiv></div>
      <button ion-button small (tap)="emailChartDataReportDetails()">Email Source Data</button>      
    </div>
  `
})
export class PromoterDrilldownComponent extends BaseChartComponent {

  metricAndSubject: MetricAndSubject;

  subjectMetricValues: Array<MetricAndSubject> = [];

  @ViewChild('metricSelector')
  metricSelectorDivRef: ElementRef;

  @ViewChild('metricSelector2')
  metricSelectorDivRef2: ElementRef;

  @ViewChild('promoterdetractorchart')
  chartDivRef: ElementRef;

  @ViewChild('metricValueChart')
  chartDivRef2: ElementRef;

  @ViewChild('dashboard')
  dashboardDivRef: ElementRef;

  @ViewChild('dashboard2')
  dashboardDivRef2: ElementRef;

  @ViewChild('errorDiv')
  errorDiv: ElementRef;

  constructor(alertCtrl: AlertController, svc: ChartService, asvc: AccountService, ssvc: StaffService, navParams: NavParams) {
    super(alertCtrl, svc, ssvc, asvc);
    this.metricAndSubject = navParams.get('metricAndSubject');
  }

  ngOnInit() {
    this.getMetricAndSubjectValues()
      .then((values)=>{
        this.subjectMetricValues = values;
        this.createPromoterDetractorDashboard();
        this.createRatingDashboard();
      })

  }

  private createPromoterDetractorDashboard() {
    let columnsGenerator = Filters.getColumnGeneratorWithDateAsFirstMonthAndRemainingColumns();

    let chartOptionsGenerator = Formatters.getChartOptionsGeneratorFromDefaults({
      vAxes: {
        0: {title: 'Percentage', format: 'percent'},
        1: {title: 'Survey Count', format:'#'},
      },
      title: ['# of Surveys, Percentage of Promoters & Detractors'].join(' '),
      legend: 'bottom',
      seriesType: 'bars',
      series: {
        2: {type: 'line', curveType: 'function', targetAxisIndex:1}
      },
      pointSize: 20,
    });

    let monthYearFilter = Filters.createMonthYearFilter(this.metricSelectorDivRef.nativeElement, 0 /* columnIndex */);

    let chartGen = super.createDefaultChartGenerator(
      'ComboChart',
      this.chartDivRef.nativeElement,
      columnsGenerator,
      chartOptionsGenerator);

    this.renderDashboard(
      QueryUtils.PROMOTER_DETRACTOR_QUERY(this.metricAndSubject),
      chartGen,
      monthYearFilter,
      this.dashboardDivRef.nativeElement, this.errorDiv.nativeElement)
  }

  private createRatingDashboard() {
    this.renderTimeVsRatingDashboard(
      this.chartDivRef2.nativeElement,
      this.dashboardDivRef2.nativeElement,
      this.metricSelectorDivRef2.nativeElement,
      this.errorDiv.nativeElement,
      QueryUtils.METRIC_RATING_QUERY(this.metricAndSubject),
      [this.metricAndSubject.getHeading(), this.metricAndSubject.getSubHeading()].join(" "), // Title
    );
  }
}
