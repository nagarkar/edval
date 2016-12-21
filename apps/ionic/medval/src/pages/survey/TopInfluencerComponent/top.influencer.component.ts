import {Component, AfterViewChecked, AfterViewInit} from '@angular/core';

import {NavController, NavParams} from 'ionic-angular';
import {Config} from "../../../shared/aws/config";
import {StartComponent} from "../start/start.component";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {MedvalComponent} from "../../../shared/stuff/medval.component";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {SurveyNavigator, NavigationTarget, RegisterComponent} from "../../../services/survey/survey.navigator";
import {ThanksComponent} from "../thanks/thanks.component";
import {SurveyNavUtils} from "../SurveyNavUtils";
import {MetricService} from "../../../services/metric/delegator";
import {Metric, MetricValue} from "../../../services/metric/schema";

@Component({
  templateUrl: 'top.influencer.component.html',
})

@RegisterComponent
export class TopInfluencerComponent {

  private rootMetricId: string;
  private maxMetrics: number;
  private valueOrderDesc: boolean;
  private numSelections: number;
  private offsetRange: number;

  message: string;
  displayMetrics: Metric[] = [];
  rows = [];
  numCols = 0;
  leftImage: string;
  private rankedMetrics: Metric[] = [];
  private images = [
    'assets/img/do-better4.jpg',
    'assets/img/intentions2.jpg',
  ];
  constructor(
    navParams: NavParams,
    tokenProvider: AccessTokenService,
    private sessionSvc: SessionService,
    private navCtrl: NavController,
    private metricSvc: MetricService,
    private utils: Utils
    ) {
    this.rootMetricId = navParams.get('rootMetricId');
    this.maxMetrics = +navParams.get('maxMetrics') || Infinity;
    this.numSelections = +navParams.get('numSelections') || 2;
    this.valueOrderDesc = navParams.get('valueOrderDesc');
    this.message = this.constructMessage();
    this.offsetRange = +navParams.get('offsetRange') || 0.5;
    this.numCols = navParams.get('numCols') || 2;
    let drilldownMetrics: Metric[] = metricSvc.getCachedNpsDrilldownMetrics(this.rootMetricId);
    drilldownMetrics = Utils.shuffle(drilldownMetrics);
    this.displayMetrics = drilldownMetrics.slice(0, Math.min(this.maxMetrics, drilldownMetrics.length))
    this.rows = Array.from(Array(Math.ceil(this.displayMetrics.length / this.numCols)).keys());

     this.leftImage = this.images[0];
     setInterval(()=> {
      this.cycleImage();
    }, 15000 /*http://museumtwo.blogspot.com/2010/10/getting-people-in-door-design-tips-from.html */);
  }

  public registerRank(metric: Metric) {
    metric['isSelected'] = true;
    this.rankedMetrics.push(metric);
    if (this.rankedMetrics.length == Math.min(this.numSelections, this.displayMetrics.length)) {
      this.persistMetricValuesAndNavigate();
    }
  }

  private constructMessage(): string {
    if (this.valueOrderDesc) {
      return "What are the top (" + this.numSelections + ")" + "things Orthodontic Excellence does realy well?";
    } else {
      return "We try our best. Tell us the top (" + this.numSelections + ")" + "things we need to improve on!";
    }
  }

  private persistMetricValuesAndNavigate() {
    let numRanked = this.rankedMetrics.length;
    let offset = this.offsetRange/numRanked;
    this.rankedMetrics.forEach((metric: Metric, index: number) => {
      let value = null;
      let range = metric.properties.definition.npsType.range;
      if (this.valueOrderDesc) {
        value = Math.floor(range * (1 - offset * (index + 1)));
      } else {
        value = Math.floor(range * offset * (index + 1));
      }
      this.sessionSvc.addToCurrentSession(metric.subject, new MetricValue(metric.metricId, ''+value));
    })
    this.navigateToNext();
  }

  public navigateToNext() {
    SurveyNavUtils.navigateOrTerminate(this.sessionSvc.surveyNavigator, this.navCtrl, this.utils);
  }
  private cycleImage() {
    this.leftImage = this.images[(this.images.indexOf(this.leftImage) + 1) % this.images.length];
  }
}
