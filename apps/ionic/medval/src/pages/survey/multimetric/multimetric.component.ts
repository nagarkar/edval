import {Component} from "@angular/core";
import {NavController, NavParams, LoadingController} from "ionic-angular";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {SurveyNavUtils} from "../SurveyNavUtils";
import {MetricService} from "../../../services/metric/delegator";
import {Metric} from "../../../services/metric/schema";
import {Idle} from "@ng-idle/core";
import {SurveyPage} from "../survey.page";
import {SReplacerDataMap} from "../../../pipes/sreplacer";

@Component({
  templateUrl: 'multimetric.component.html',
})

@RegisterComponent
export class MultimetricComponent extends SurveyPage {

  private metricIds: string[];
  done = false;
  message: string;
  displayMetrics: Metric[] = [];
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
  }

  public setValue(value: number, metric: Metric) {
    metric['value'] = value;
    this.updateMetricInSession(value, metric);
    if (this.displayMetrics.every((vMetric: Metric) => {return vMetric['value'] != null;})) {
      this.done = true;
    }
  }

  private updateMetricInSession(value: number, metric: Metric) {
    //TODO Write this.
  }

  private setupDisplayMetrics(metricSvc: MetricService) {
    let allMetrics: Metric[] = metricSvc.listCached();
    allMetrics = Utils.shuffle(allMetrics);
    return allMetrics.filter((value: Metric) => {
      return this.metricIds.indexOf(value.metricId) >= 0;
    });
  }

  public navigateToNext() {
    SurveyNavUtils.navigateOrTerminate(this.sessionSvc.surveyNavigator, this.loadingCtrl, this.navCtrl);
  }
}
