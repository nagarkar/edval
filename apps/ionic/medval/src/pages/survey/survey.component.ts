import { Component} from '@angular/core';

import {NavController, NavParams, LoadingController} from'ionic-angular';

import {MetricService} from "../../services/metric/metric.service";
import {Metric, MetricValue} from "../../services/metric/schema";
import {MetricIterator} from "../../services/metric/metric.iterator";
import {ThanksComponent} from "./thanks/thanks.component";
import {Utils} from "../../shared/stuff/utils";
import {LoginComponent} from "../login/login.component";
import {SessionService} from "../../services/session/delegator";
import {MedvalComponent} from "../../shared/stuff/medval.component";
import {AccessTokenService} from "../../shared/aws/access.token.service";


@Component({
  selector: 'survey',
  templateUrl: 'survey.component.html',
  providers: [
    MetricService
  ]
})

export class SurveyComponent extends MedvalComponent {

  private static maxMetrics : number = 5;
  private metricCount: number = 0;

  private metricIterator: MetricIterator;
  public progressBarValue: number = 10;

  public currentMetric: Metric;

  constructor(
    private metricService: MetricService,
    private sessionService: SessionService,
    tokenProvider: AccessTokenService,
    navController: NavController,
    utils: Utils
  ) {
    super(tokenProvider, navController, utils)
  }

  ngOnInit() {
    super.ngOnInit();
    this.resetMetrics();
  }

  onAnswerSelection(metricValue: MetricValue) {
    // setting up answer value to survey object.
    //this.utils.showLoading();
    //setTimeout(() => {
      this.addMetricValue(metricValue);
      this.goToNextMetricOrEndSession();
    //}, 1000);
  }

  /** Returns true if there is a next metric, otherwise false. */
  nextMetric() : boolean {
    let result : IteratorResult<Metric> = this.metricIterator.next();

    if (result.done || SurveyComponent.maxMetrics == this.metricCount) {
      return false;
    }
    this.metricCount++;
    this.currentMetric = result.value;
    this.utils.log("In survey currentMetric set to " + this.currentMetric);
    this.calculateProgressBarValue();
    return true;
  }

  private resetSurveyAndThankUser() {
    this.resetMetrics();
    this.utils.setRoot(this.navCtrl, ThanksComponent);
    return;
  }

  private addMetricValue(metricValue: MetricValue) {
    //TODO Uncomment this once we fix sessions.
    //this.sessionService.addToCurrentSession(metricValue);
    this.metricIterator.updateAnswer(metricValue);
  }

  private calculateProgressBarValue() {
    let length = SurveyComponent.maxMetrics;
    if (length > 0) {
      this.progressBarValue = this.progressBarValue +  Math.round(80 / length);
    }
  }

  private resetMetrics() {
    // TODO: Make sure we actually get usernames here and pass them.
    //let usernames : Array<string> = this.sessionService.getCurrentSession().properties.selectedStaffUserNames;
    this.metricIterator = new MetricIterator(this.utils, this.metricService, ['adelg']);
    this.nextMetric();
  }

  private goToNextMetricOrEndSession() {
    if (!this.nextMetric()) {
      this.resetSurveyAndThankUser();
    }
  }
}
