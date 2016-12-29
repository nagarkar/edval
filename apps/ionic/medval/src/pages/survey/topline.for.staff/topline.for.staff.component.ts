import {Component, ViewChild} from "@angular/core";
import {Metric, MetricValue} from "../../../services/metric/schema";
import {Utils} from "../../../shared/stuff/utils";
import {RatingComponent} from "../../../shared/components/rating/rating.component";
import {Staff} from "../../../services/staff/schema";
import {StaffService} from "../../../services/staff/delegator";
import {SurveyNavigator, RegisterComponent} from "../../../services/survey/survey.navigator";
import {NavParams, NavController} from "ionic-angular";
import {MetricService} from "../../../services/metric/delegator";
import {SessionService} from "../../../services/session/delegator";
import {SurveyNavUtils} from "../SurveyNavUtils";
import {SurveyPage} from "../survey.page";
import {Idle} from "@ng-idle/core";

export interface dataInterface {staff: Staff, metric: Metric, value?: string};

@Component({
  selector: 'topline-for-staff',
  templateUrl: 'topline.for.staff.component.html',
  //pipes: [SReplacer]
})

@RegisterComponent
export class ToplineForStaffComponent extends SurveyPage {

  displayData: Array<dataInterface> = [];

  styles: any = {};

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

    super(utils, navCtrl, sessionSvc, idle);

    let staffNames: string[] = sessionSvc.getCurrentSession().properties.selectedStaffUserNames;
    let displayCount = params.get('displayCount') || staffNames.length;
    let imgStyleMap = {
      1:'100%',
        2:'85%',
        3:'70%',
        4:'60%',
        5:'40%'
    }
    this.styles.img = {
      width: imgStyleMap[Math.min(displayCount, staffNames.length)]
    }
    let textStyleMap = {
      1:'1em',
      2:'1em',
      3:'.9m',
      4:'.8em',
      5:'.7em'
    }
    this.styles.text = {
      'font-size': textStyleMap[Math.min(displayCount, staffNames.length)]
    }
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
      rootMetrics.filter((rootMetric: Metric)=> {
        return rootMetric.isNpsType();
      })
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

  public onSelection(data: dataInterface, value: string) {
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
