import {
  Component,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';

import {NavController, NavParams, LoadingController} from'ionic-angular';

import {Metric, MetricValue} from "../../services/metric/schema";
import {MetricIterator} from "../../services/metric/metric.iterator";
import {ThanksComponent} from "./thanks/thanks.component";
import {Utils} from "../../shared/stuff/utils";
import {LoginComponent} from "../login/login.component";
import {SessionService} from "../../services/session/delegator";
import {MedvalComponent} from "../../shared/stuff/medval.component";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {AccountService} from "../../services/account/delegator";
import {Config} from "../../shared/aws/config";
import {Account} from "../../services/account/schema";
import {Staff} from "../../services/staff/schema";
import {MetricService} from "../../services/metric/delegator";


@Component({
  selector: 'survey',
  templateUrl: 'survey.component.html',
  animations: [
    trigger('metricsPresented', [
      state('gtZero', style({opacity: 1, transform: 'translateX(0)'})),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100%)'
        }),
        animate('0.2s ease-in')
      ]),
      transition('* => void', [
        animate('0.2s 10 ease-out', style({
          opacity: 0,
          transform: 'translateX(100%)'
        }))
      ])
    ])
  ]
})

export class SurveyComponent extends MedvalComponent {

  maxMetrics : number = 7;
  metricCount: number = 0;

  private metricIterator: MetricIterator;
  private selectedStaff: Set<Staff>;

  public progressBarValue: number = 10;

  public currentMetric: Metric = new Metric();

  constructor(
    private metricService: MetricService,
    private sessionService: SessionService,
    private accountSvc : AccountService,
    tokenProvider: AccessTokenService,
    navController: NavController,
    navParams: NavParams,
    utils: Utils
  ) {
    super(tokenProvider, navController, utils);
    this.selectedStaff = navParams.get('staff');
    Utils.log("In survey constr, got selected staff: {0}", Utils.stringify(this.selectedStaff));
  }

  ngOnInit() {
    super.ngOnInit();
    this.resetMetrics();

  }

  state() {
    if (this.metricCount > 0) {
      return "gtZero";
    }
    return "";
  }

  onAnswerSelection(metricValue: MetricValue) {
    // setting up answer value to survey object.
    //this.utils.showLoading();
    this.addMetricValue(metricValue);
    this.goToNextMetric();
  }

  private goToNextMetric() {
    setTimeout(() => {
      this.goToNextMetricOrEndSession();
    }, 600);

  }
  /** Returns true if there is a next metric, otherwise false. */
  nextMetric() : boolean {
    let result : IteratorResult<Metric> = this.metricIterator.next();

    if (result.done || this.maxMetrics == this.metricCount) {
      return false;
    }
    this.metricCount++;
    this.currentMetric = result.value;
    Utils.log("In survey currentMetric set to " + this.currentMetric);
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
    this.metricService.get(metricValue.metricId)
      .then((metric: Metric) => {
        this.sessionService.addToCurrentSession(metric.subject, metricValue);
        this.metricIterator.updateAnswer(metricValue);
      });
  }

  private calculateProgressBarValue() {
    let length = this.maxMetrics;
    if (length > 0) {
      this.progressBarValue = this.progressBarValue +  Math.round(80 / length);
      Utils.log("ProgressbarValue {0}", this.progressBarValue)
    }
  }

  private resetMetrics() {
    // TODO: Make sure we actually get usernames here and pass them.
    // let usernames : Array<string> = this.sessionService.getCurrentSession().properties.selectedStaffUserNames;
    this.metricIterator = new MetricIterator(
      this.maxMetrics,
      this.metricService,
      this.selectedStaff,
      new Set<string>() /* Roles */);

    this.nextMetric();
  }

  private goToNextMetricOrEndSession() {
    if (!this.nextMetric()) {
      this.resetSurveyAndThankUser();
    }
  }


}
