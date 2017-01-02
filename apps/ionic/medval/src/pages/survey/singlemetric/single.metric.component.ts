import {Component, ViewChild} from "@angular/core";
import {Metric, MetricValue} from "../../../services/metric/schema";
import {Utils} from "../../../shared/stuff/utils";
import {RatingComponent} from "../../../shared/components/rating/rating.component";
import {StaffService} from "../../../services/staff/delegator";
import {SurveyNavigator, RegisterComponent} from "../../../services/survey/survey.navigator";
import {NavParams, NavController} from "ionic-angular";
import {MetricService} from "../../../services/metric/delegator";
import {SessionService} from "../../../services/session/delegator";
import {SurveyNavUtils} from "../SurveyNavUtils";
import {Idle} from "@ng-idle/core";
import {SurveyPage} from "../survey.page";

@Component({
  selector: 'single-metric',
  templateUrl: 'single.metric.component.html',
  //pipes: [SReplacer]
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

    //TODO Add back idle.
    super(utils, navCtrl, sessionSvc);

    this.getMetricById(params.get("metricId"));
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
    let navigator: SurveyNavigator = this.sessionSvc.surveyNavigator;
    navigator.session.addMetricValue(this.currentMetric.subject, new MetricValue(this.currentMetric.metricId, data));
    SurveyNavUtils.navigateOrTerminate(this.sessionSvc.surveyNavigator, this.navCtrl, this.utils);
  }
}
