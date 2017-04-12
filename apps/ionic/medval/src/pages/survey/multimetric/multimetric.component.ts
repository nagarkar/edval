/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {Component, Input} from "@angular/core";
import {NavController, NavParams, AlertController} from "ionic-angular";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {MetricService} from "../../../services/metric/delegator";
import {Metric, MetricValue} from "../../../services/metric/schema";
import {Idle} from "@ng-idle/core";
import {SurveyPage} from "../survey.page";
import {SReplacerDataMap} from "../../../pipes/sreplacer";
import {StaffService} from "../../../services/staff/delegator";

@Component({
  templateUrl: './multimetric.component.html',
})
@RegisterComponent
export class MultimetricComponent extends SurveyPage {

  @Input()
  metricIds: string[];
  @Input()
  rootMetricId: string;
  @Input()
  message: string;
  @Input()
  done: boolean = false;
  @Input()
  displayCount: number = 4;

  displayMetrics: Metric[] = [];
  metricValues: number[] = [];
  dirty: boolean= false;

  sReplacerDataPack: SReplacerDataMap = {}

  constructor(
    idle: Idle,
    utils: Utils,
    navCtrl: NavController,
    alertCtrl: AlertController,
    sessionSvc: SessionService,
    navParams: NavParams,
    tokenProvider: AccessTokenService,
    private staffSvc: StaffService,
    private metricSvc: MetricService,
    ) {

    super(navCtrl, alertCtrl, sessionSvc, idle);

    try {
      this.rootMetricId = navParams.get('rootMetricId');
      this.metricIds    = navParams.get('metricIds');
      this.message      = navParams.get('message')                                || 'Please answer the following questions';
      this.done         = navParams.get('allowSkipIfNoSelectionsInMetricSubject') || this.done;
      this.displayCount = navParams.get('displayCount')                           || this.displayCount;

      this.displayMetrics = this.constructDisplayMetrics(metricSvc);

      this.sReplacerDataPack = this.constructSReplacerData(metricSvc.getCached(this.rootMetricId));
    } catch(err) {
      super.handleErrorAndCancel(err);
    }
  }

  navigateToNext() {
    this.displayMetrics.forEach((metric: Metric, idx: number)=>{
    this.updateMetricInSession(this.metricValues[idx], metric);
    });
    super.navigateToNext();
  }

  setValue(data: any, idx: number) {
    //First time someone's made a change! If you strongly agree with every default (zero), the survey does not move forward.
    if (!this.dirty) {
      setTimeout(()=>{
        this.done = true;
      }, 50)
    }
    this.dirty = true;
  }

  private constructSReplacerData(rootMetric: Metric): SReplacerDataMap {
    let replacerData: SReplacerDataMap = {};
    if (!rootMetric) {
      return replacerData;
    }
    replacerData.metric = rootMetric;
    return replacerData;
  }

  private updateMetricInSession(value: number, metric: Metric) {
    if (this.sessionSvc.hasCurrentSession()) {
      this.sessionSvc.getCurrentSession().addMetricValue(
        metric.subject, new MetricValue(metric.metricId, '' + value));
    }
  }

  private constructDisplayMetrics(metricSvc: MetricService): Metric[] {
    let allMetrics: Metric[];
    if (this.metricIds && Array.isArray(this.metricIds) && this.metricIds.length > 0) {
      allMetrics = [];
      this.metricIds.forEach((metricId: string)=>{
        let metric: Metric = metricSvc.getCached(metricId);
        if (!this.rootMetricId || this.rootMetricId == metric.parentMetricId) {
          allMetrics.push(metric);
        }
      })
    } else if (this.rootMetricId) {
      allMetrics = metricSvc.getCachedNpsDrilldownMetrics(this.rootMetricId);
    } else {
      allMetrics = metricSvc.listCached();
    }
    allMetrics = Utils.shuffle(allMetrics);
    allMetrics.forEach(() => { this.metricValues.push(1);});
    return allMetrics.slice(0, this.displayCount);
  }
}
