/**
 * Created by chinmay on 2/24/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {ModalController, AlertController} from "ionic-angular";
import {StaffService} from "../../../services/staff/delegator";
import {BaseChartComponent} from "../base.chart.component";
import {ChartService, ChartDataResponse} from "../chart.service";
import {Component, Input} from "@angular/core";
import {Utils} from "../../../shared/stuff/utils";
import {Formatters} from "../formatters";
import {QueryUtils} from "../query.utils";
import {PromoterDrilldownComponent} from "./promoter.drilldown.component";
import {AccountService} from "../../../services/account/delegator";
import {MetricAndSubject} from "../metric.subject";

@Component({
  selector: 'subject-summary',
  templateUrl: 'subject.summary.component.html',
})
export class SubjectSummaryComponent extends BaseChartComponent {

  previousRatingAsPercentage: number = 0;
  previousRating: number = 0;
  previousDetractors: number = 0;
  previousPromoters: number = 0;
  previousTotals: number = 1;

  currentRatingAsPercentage: number = 0;
  currentRating: number = 0;
  currentDetractors: number = 0;
  currentPromoters: number = 0;
  currentTotals: number = 0;

  @Input()
  metricAndSubject: MetricAndSubject;

  insufficientData = false;

  constructor(
    alertCtrl: AlertController,
    svc: ChartService,
    private modalCtrl: ModalController,
    staffsvc: StaffService,
    asvc: AccountService) {

    super(alertCtrl, svc, staffsvc, asvc);
  }

  ngOnInit() {
    let millisInMonth = 2629746000;
    let twoMonthsAgo = new Date().getTime() - 2 * millisInMonth;
    let floorDateToMonth = Formatters.floorDateToMonth(twoMonthsAgo);
    function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
    let query = [
      `select datemonth, sum(totalCount), sum(detractorCount), sum(promoterCount), avg(rating) 
        where `,
          /* date condition is reversed due to how date filters work in google charts*/
          QueryUtils.pair('datemonth', '<', floorDateToMonth), ' and ',
          QueryUtils.pair('metricName', '=', this.metricAndSubject.metricName), ' and ',
          QueryUtils.pair('subjecttype', '=', this.metricAndSubject.subjectType), ' and ',
          QueryUtils.pair('subjectvalue', '=', this.metricAndSubject.subjectValue),
      ' group by datemonth order by datemonth desc'].join('');
    this.svc.getData(query, QueryUtils.PROMOTER_COUNTS_REPORT)
      .then((response: ChartDataResponse)=> {
        if (response.isError()) {
          Utils.error("Error for query {0} with reasons: {1}", query, response.getReasons().join("\n"));
        }
        let datatable = response.getDataTable();
        let rows = datatable.getNumberOfRows();
        if (rows == 0) {
          this.insufficientData = true;
          return;
        }
        let currMonthIndex = 0;
        let previousMonthIndex = 1;
        this.currentTotals = datatable.getValue(currMonthIndex, 1);
        this.currentDetractors = datatable.getValue(currMonthIndex, 2);
        this.currentPromoters = datatable.getValue(currMonthIndex, 3);
        this.currentRating = datatable.getValue(currMonthIndex, 4);
        this.currentRatingAsPercentage = this.currentRating * 100;

        this.previousTotals = rows > 1 ? datatable.getValue(previousMonthIndex, 1) : 0;
        this.previousDetractors = rows > 1 ? datatable.getValue(previousMonthIndex, 2): 0;
        this.previousPromoters = rows > 1 ? datatable.getValue(previousMonthIndex, 3) : 0;
        this.previousRating = rows > 1 ? datatable.getValue(previousMonthIndex, 4): 0;
        this.previousRatingAsPercentage = this.previousRating * 100;
      })
      .catch((err)=>{
        Utils.error(err);
      })
  }

  drilldown() {
    this.modalCtrl
      .create(
        PromoterDrilldownComponent,
        {
          'metricAndSubject': this.metricAndSubject
        },
        {
          showBackdrop: false
        }
      )
      .present();
  }

  round(value) {
    return Math.round(value);
  }

  meanTrendingUp() {
    let m1 = this.previousRatingAsPercentage;
    let m2 = this.currentRatingAsPercentage;
    return m2 > m1;
  }

  detractorTrendingUp() {
    let m1 = this.previousDetractors/this.previousTotals;
    let m2 = this.currentDetractors/this.currentTotals;
    return m2 > m1;
  }

  promoterTrendingUp() {
    let m1 = this.previousPromoters/(this.previousTotals == 0 ? 1 : this.previousTotals);
    let m2 = this.currentPromoters/this.currentTotals;
    return m2 > m1;
  }

  private updateSummaryMetrics() {
    this.svc.getData('select *', QueryUtils.PROMOTER_COUNTS_REPORT)
      .then((datatable)=>{

      })
      .catch((err)=> {
        Utils.error(err);
      })
  }
}
