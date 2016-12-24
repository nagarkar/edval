import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {Config} from "../../../shared/aws/config";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {SurveyNavUtils} from "../SurveyNavUtils";
import {MetricService} from "../../../services/metric/delegator";
import {Metric} from "../../../services/metric/schema";
import {ObjectCycler} from "../../../shared/stuff/object.cycler";

@Component({
  templateUrl: 'multimetric.component.html',
})

@RegisterComponent
export class MultimetricComponent {

  private metricIds: string[];
  private images: string[] = []

  message: string;
  displayMetrics: Metric[] = [];
  leftImage: string;

  constructor(
    navParams: NavParams,
    tokenProvider: AccessTokenService,
    private sessionSvc: SessionService,
    private navCtrl: NavController,
    private metricSvc: MetricService,
    private utils: Utils
    ) {
    this.metricIds = navParams.get('metricIds');
    this.message = navParams.get('message') || 'Please answer the following questions';

    this.images = this.setupImages();
    this.leftImage = this.images[0];
    this.setupImageCycling();

    this.displayMetrics = this.setupDisplayMetrics(metricSvc);
  }

  public setValue(value: number, metric: Metric) {
    metric['value'] = value;
    this.updateMetricInSession(value, metric);
    if (this.displayMetrics.every((vMetric: Metric) => {return vMetric['value'] != null;})) {
      this.navigateToNext();
    }
  }

  private updateMetricInSession(value: number, metric: Metric) {
    //TODO Write this.
  }

  private setupImages() {
    return [
      'http://blog.insurancejobs.com/wp-content/uploads/2012/04/InterviewQuestionWhatAreYourWeaknesses.jpg',
      'http://www.medpreps.com/wp-content/uploads/2012/08/interview-strength.jpg',
      'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcREOSr8_qh3jy6hF7c0ZbtboZxRXtqdn104ZjugwFkEFcjDRGR2ug',
      'http://www.sqleadership.com/wp-content/uploads/2010/06/strength-weights1.jpg'
    ]
  }

  private setupImageCycling() {
    new ObjectCycler<string>(Config.TIME_OUT_AFTER_SURVEY/2, ...this.images)
      .onNewObj.subscribe((next:string) => { this.leftImage = next;});
  }

  private setupDisplayMetrics(metricSvc: MetricService) {
    let allMetrics: Metric[] = metricSvc.listCached();
    allMetrics = Utils.shuffle(allMetrics);
    return allMetrics.filter((value: Metric) => {
      return this.metricIds.indexOf(value.metricId) >= 0;
    });
  }

  public navigateToNext() {
    SurveyNavUtils.navigateOrTerminate(this.sessionSvc.surveyNavigator, this.navCtrl, this.utils);
  }
}
