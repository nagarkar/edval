import {Component} from '@angular/core';

import {NavController, NavParams} from 'ionic-angular';
import {Config} from "../../../shared/aws/config";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {SurveyNavUtils} from "../SurveyNavUtils";
import {MetricService} from "../../../services/metric/delegator";
import {Metric, MetricValue} from "../../../services/metric/schema";
import {ObjectCycler} from "../../../shared/stuff/object.cycler";

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
  private rankedMetrics: Metric[] = [];
  private images: string[] = []

  message: string;
  displayMetrics: Metric[] = [];
  rows = [];
  numCols = 0;
  leftImage: string;
  displayAttribute: string;

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

    this.displayAttribute = this.valueOrderDesc ? 'positiveImpact' : 'improvement';

    this.images = this.setupImages();
    this.leftImage = this.images[0];
    this.setupImageCycling();

    this.displayMetrics = this.setupDisplayMetrics(metricSvc);

    this.rows = Array.from(Array(Math.ceil(this.displayMetrics.length / this.numCols)).keys())
  }

  public registerRank(metric: Metric) {
    let currentIndex = this.rankedMetrics.indexOf(metric);
    if (currentIndex >= 0) {
      this.rankedMetrics.splice(currentIndex, 1);
      metric['isSelected'] = false;
      return;
    }
    this.rankedMetrics.push(metric);
    if (this.rankedMetrics.length == Math.min(this.numSelections, this.displayMetrics.length)) {
      this.persistMetricValuesAndNavigate();
    }
    metric['isSelected'] = true;
  }

  private setupImages() {
    if (this.valueOrderDesc) {
      return [
        'assets/img/strength4.jpg',
        'assets/img/strength.jpg',
        'assets/img/strength2.jpg',
        'assets/img/strength3.jpg',
      ]
    } else {
      return [
        'assets/img/strength4.jpg',
        'assets/img/mistake1.jpg',
      ]
    }

  }
  private setupImageCycling() {
    new ObjectCycler<string>(Config.TIME_OUT_AFTER_SURVEY/2, ...this.images)
      .onNewObj.subscribe((next:string) => { this.leftImage = next;});
  }

  private setupDisplayMetrics(metricSvc: MetricService) {
    let drilldownMetrics: Metric[] = metricSvc.getCachedNpsDrilldownMetrics(this.rootMetricId);
    drilldownMetrics = Utils.shuffle(drilldownMetrics);
    drilldownMetrics = drilldownMetrics.slice(0, Math.min(this.maxMetrics, drilldownMetrics.length))
    return drilldownMetrics.sort((a:Metric, b:Metric) => {
      return b.properties[this.displayAttribute].length - a.properties[this.displayAttribute].length
    });
  }

  private constructMessage(): string {
    if (this.valueOrderDesc) {
      return "What are the top (" + this.numSelections + ")" + "things Orthodontic Excellence does realy well?";
    } else {
      return "Tell us the top (" + this.numSelections + ")" + "things Orthodontic Excellence should improve!";
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
}
