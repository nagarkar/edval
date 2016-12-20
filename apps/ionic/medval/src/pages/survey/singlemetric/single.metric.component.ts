import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';
import {Metric, MetricValue, NPSType, TextType} from "../../../services/metric/schema";
import {Utils} from "../../../shared/stuff/utils";
import {RatingComponent} from "../../../shared/rating/rating.component";
import {Staff} from "../../../services/staff/schema";
import {StaffService} from "../../../services/staff/delegator";
import {
  SurveyNavigator, ISurveyFunction, ISurveyComponent, RegisterComponent,
  NavigationTarget
} from "../../../services/survey/survey.navigator";
import {NavParams, NavController} from "ionic-angular";
import {MetricService} from "../../../services/metric/delegator";
import {SessionService} from "../../../services/session/delegator";

@Component({
  selector: 'single-metric',
  templateUrl: 'single.metric.component.html',
  animations: [
    trigger('metricName', [
      transition('* => *', [
        style({
          opacity: 0,
          transform: 'translateY(-100%)'
        }),
        animate('1s ease-in')
      ]),
    ])
  ]
})

@RegisterComponent
export class SingleMetricComponent implements ISurveyComponent {

  private currentMetric: Metric; // Input()

  @ViewChild(RatingComponent) inputComponent: RatingComponent;

  constructor(
    params: NavParams,
    private navCtrl: NavController,
    private utils: Utils,
    private staffSvc: StaffService,
    private sessionSvc: SessionService,
    private metricSvc: MetricService
  ) {
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

  public onSelection(data) {
    let navigator: SurveyNavigator = this.sessionSvc.surveyNavigator;
    navigator.session.addMetricValue(this.currentMetric.subject, new MetricValue(this.currentMetric.metricId, data));
    let navigationTarget: NavigationTarget = navigator.getNavigationTarget();
    this.utils.setRoot(this.navCtrl, navigationTarget.component, navigationTarget.params);
  }

  get metricDisplayName(): string {
    return this.currentMetric.properties.metricName;
  }

}
