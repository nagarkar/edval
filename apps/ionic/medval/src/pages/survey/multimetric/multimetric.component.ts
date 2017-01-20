import {Component} from "@angular/core";
import {NavController, NavParams, LoadingController} from "ionic-angular";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {MetricService} from "../../../services/metric/delegator";
import {Metric, MetricValue} from "../../../services/metric/schema";
import {Idle} from "@ng-idle/core";
import {SurveyPage} from "../survey.page";
import {SReplacerDataMap} from "../../../pipes/sreplacer";

@Component({
  templateUrl: './multimetric.component.html',
  providers: [Idle]
})

@RegisterComponent
export class MultimetricComponent extends SurveyPage {

  private metricIds: string[];
  done = false;
  message: string;
  displayMetrics: Metric[] = [];
  metricValues: number[] = [];
  dirty: boolean= false;

  sReplacerDataPack: SReplacerDataMap = {}

  constructor(
    idle: Idle,
    utils: Utils,
    navCtrl: NavController,
    loadingCtrl: LoadingController,
    sessionSvc: SessionService,
    navParams: NavParams,
    tokenProvider: AccessTokenService,
    //staffSvc: StaffService,
    private metricSvc: MetricService,
    ) {

    super(loadingCtrl, navCtrl, sessionSvc, idle);
    //this.sReplacerDataPack = {
//      staffSvc: staffSvc
  //  }

    this.metricIds = navParams.get('metricIds');
    this.message = navParams.get('message') || 'Please answer the following questions';

    this.displayMetrics = this.setupDisplayMetrics(metricSvc);
    this.displayMetrics.forEach(()=>{
      this.metricValues.push(1);
    })
  }

  navigateToNext() {
    this.displayMetrics.forEach((metric: Metric, idx: number)=>{
      this.updateMetricInSession(this.metricValues[idx], metric);
    });
    super.navigateToNext();
  }

  setValue(data: any, metric: Metric) {
    //First time someone's made a change! If you strongly disagree with everything, the survey does not move forward.
    if (!this.dirty) {
      setTimeout(()=>{
        this.done = true;
      }, 4000)
    }
    this.dirty = true;
  }

  private updateMetricInSession(value: number, metric: Metric) {
    if (this.sessionSvc.hasCurrentSession()) {
      this.sessionSvc.getCurrentSession().addMetricValue(
        metric.subject, new MetricValue(metric.metricId, '' + value));
    }
  }

  private setupDisplayMetrics(metricSvc: MetricService) {
    let allMetrics: Metric[] = metricSvc.listCached();
    allMetrics = Utils.shuffle(allMetrics);
    return allMetrics.filter((value: Metric) => {
      return this.metricIds.indexOf(value.metricId) >= 0;
    });
  }
}
