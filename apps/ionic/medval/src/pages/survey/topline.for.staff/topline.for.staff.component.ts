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
import { SurveyNavigator, ISurveyComponent, RegisterComponent,NavigationTarget} from "../../../services/survey/survey.navigator";
import {NavParams, NavController} from "ionic-angular";
import {MetricService} from "../../../services/metric/delegator";
import {SessionService} from "../../../services/session/delegator";
import {SurveyNavUtils} from "../SurveyNavUtils";

interface dataInterface {staff: Staff, metric: Metric, value?: string};

@Component({
  selector: 'single-metric',
  templateUrl: 'topline.for.staff.component.html',
})

@RegisterComponent
export class ToplineForStaffComponent implements ISurveyComponent {

  displayData: Array<dataInterface> = [];

  @ViewChild(RatingComponent) inputComponent: RatingComponent;

  constructor(
    params: NavParams,
    private navCtrl: NavController,
    private utils: Utils,
    private staffSvc: StaffService,
    private sessionSvc: SessionService,
    private metricSvc: MetricService
  ) {

    let displayCount = params.get('displayCount') || 2;
    let staffNames: string[] = sessionSvc.getCurrentSession().properties.selectedStaffUserNames;
    if(staffNames.length == 0) {
      this.navigateToNext();
    }
    for (let i = 0; i < staffNames.length && this.displayData.length < displayCount; i++) {
      let staffName = staffNames[i];
      let staff: Staff = staffSvc.getCached(staffName);
      let role: string = staff.role;
      let rootMetrics: Metric[] = metricSvc.getRootMetricsForSubject(Metric.createStaffSubject(staff.username));
      if (rootMetrics.length == 0) {
        rootMetrics = metricSvc.getRootMetricsForSubject(Metric.createRoleSubject(role));
      }
      if (rootMetrics.length == 0) {
        continue;
      }
      let rootMetric: Metric = rootMetrics[0];
      if (rootMetric.hasRoleSubject()) {
        rootMetric = Object.assign<Metric, Metric>(new Metric(), rootMetric);
        rootMetric.subject = Metric.createStaffSubject(staff.username);
      }
      this.displayData.push({staff: staff, metric: rootMetric});
    }
  }

  public onSelection(data: dataInterface, value) {
    data.value = value;
    let navigator: SurveyNavigator = this.sessionSvc.surveyNavigator;
    navigator.session.addMetricValue(data.metric.subject, new MetricValue(data.metric.metricId, data.value));
    if (this.displayData.every((data: dataInterface) => {return data.value != null})) {
      this.navigateToNext();
    }
  }

  public navigateToNext() {
    SurveyNavUtils.navigateOrTerminate(this.sessionSvc.surveyNavigator, this.navCtrl, this.utils);
  }
}
