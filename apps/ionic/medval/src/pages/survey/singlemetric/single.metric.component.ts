/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component, ViewChild} from "@angular/core";
import {Metric, MetricValue} from "../../../services/metric/schema";
import {Utils} from "../../../shared/stuff/utils";
import {RatingComponent} from "../../../shared/components/rating/rating.component";
import {StaffService} from "../../../services/staff/delegator";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {NavParams, NavController} from "ionic-angular";
import {MetricService} from "../../../services/metric/delegator";
import {SessionService} from "../../../services/session/delegator";
import {Idle} from "@ng-idle/core";
import {SurveyPage} from "../survey.page";

@Component({
  selector: 'single-metric',
  templateUrl: './single.metric.component.html',
  //providers: [Idle]
})

@RegisterComponent
export class SingleMetricComponent extends SurveyPage {

  currentMetric: Metric;

  @ViewChild(RatingComponent) inputComponent: RatingComponent;

  constructor(
    idle: Idle,
    utils: Utils,
    navCtrl: NavController,
    sessionSvc: SessionService,
    params: NavParams,
    private staffSvc: StaffService,
    private metricSvc: MetricService
  ) {

    super(navCtrl, sessionSvc, idle);
    try {
      this.getMetricById(params.get("metricId"));
    } catch (err) {
      super.handleErrorAndCancel(err);
    }
  }

  private getMetricById(metricId: string) {
    Utils.throwIfNull(metricId);
    this.currentMetric = this.metricSvc.getCached(metricId);
    if (!this.currentMetric) {
      this.metricSvc.get(metricId).then((value: Metric) => {
        this.currentMetric = value;
      })
    }
  }

  public onSelection(data: string): void {
    this.sessionSvc.getCurrentSession().addMetricValue(
      this.currentMetric.subject, new MetricValue(this.currentMetric.metricId, data));
    super.navigateToNext(false /*dontAnimate */, true /* Force Navigate */);
  }
}
