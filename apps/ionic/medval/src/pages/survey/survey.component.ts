import { Component} from '@angular/core';

import {NavController, NavParams, LoadingController} from'ionic-angular';

import {MetricService} from "./metric.service";
import {Metric, MetricValue} from "./metric.schema";
import {MetricIterator} from "./metric.iterator";
import {ThanksComponent} from "./thanks/thanks.component";
import {Utils} from "../../shared/stuff/utils";
import {LoginComponent} from "../login/login.component";


@Component({
  selector: 'survey',
  templateUrl: 'survey.component.html',
  providers: [
    MetricService
  ]
})

export class SurveyComponent {

  private static maxMetrics : number = 5;
  private metricCount: number = 0;

  private metricIterator: MetricIterator;
  public progressBarValue: number = 10;

  public currentMetric: Metric;

  constructor(
    private loadingCtrl: LoadingController,
    private metricService: MetricService,
    private navController: NavController,
    private navParams: NavParams,
    private utils: Utils
  ) {
    this.resetMetrics();
  }

  ngOnInit() { }

  gotoLogin() {
    this.navController.setRoot(LoginComponent);
  }

  onAnswerSelection(metricValue: MetricValue) {
    // setting up answer value to survey object.
    this.utils.showLoading();
    setTimeout(() => {
      this.addMetricValueToSession(metricValue);
      this.goToNextMetricOrEndSession();
    }, 1000);
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
    this.navController.setRoot(ThanksComponent);
    return;
  }

  private addMetricValueToSession(metricValue: MetricValue) {

  }

  private calculateProgressBarValue() {
    let length = SurveyComponent.maxMetrics;
    if (length > 0) {
      this.progressBarValue = this.progressBarValue +  Math.round(80 / length);
    }
  }

  private resetMetrics() {
    this.metricIterator = new MetricIterator(this.metricService);
    this.nextMetric();
  }

  private goToNextMetricOrEndSession() {
    if (!this.nextMetric()) {
      this.resetSurveyAndThankUser();
    }
  }
}
