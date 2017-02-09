/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component, ViewChild} from "@angular/core";
import {Metric, MetricValue} from "../../../services/metric/schema";
import {Utils} from "../../../shared/stuff/utils";
import {RatingComponent} from "../../../shared/components/rating/rating.component";
import {Staff} from "../../../services/staff/schema";
import {StaffService} from "../../../services/staff/delegator";
import {SurveyNavigator, RegisterComponent} from "../../../services/survey/survey.navigator";
import {NavParams, NavController, LoadingController} from "ionic-angular";
import {MetricService} from "../../../services/metric/delegator";
import {SessionService} from "../../../services/session/delegator";
import {SurveyPage} from "../survey.page";
import {Idle} from "@ng-idle/core";
import {SReplacerDataMap} from "../../../pipes/sreplacer";

@Component({
  selector: 'topline-for-staff',
  templateUrl: './topline.for.staff.component.html',
  //providers: [Idle]
})

@RegisterComponent
export class ToplineForStaffComponent extends SurveyPage {

  displayData: Array<SReplacerDataMap> = [];
  displayCount: number;
  done: boolean = false;

  styles: any = {};

  imgStyleMap = {
    1:'100%',
    2:'85%',
    3:'70%',
    4:'60%',
    5:'40%'
  };

  textStyleMap = {
    1:'1.7em',
    2:'1.6em',
    3:'1.5em',
    4:'1.5em',
    5:'1.5em'
  };

  @ViewChild(RatingComponent) inputComponent: RatingComponent;

  constructor(
    idle: Idle,
    utils: Utils,
    navCtrl: NavController,
    sessionSvc: SessionService,
    params: NavParams,
    private staffSvc: StaffService,
    private metricSvc: MetricService) {

    super(navCtrl, sessionSvc, idle);

    let staffNames: string[] = sessionSvc.getCurrentSession().properties.selectedStaffUserNames;
    if(staffNames.length == 0) {
      this.navigateToNext();
    }

    this.displayCount = params.get('displayCount') || staffNames.length;

    this.styles = this.createStyles(this.displayCount, staffNames);

    this.displayData = this.setupDisplayData(this.displayCount, staffNames);
  }

  public onSelection(data: SReplacerDataMap, value: string) {
    data['value'] = value;
    let navigator: SurveyNavigator = this.sessionSvc.surveyNavigator;
    navigator.session.addMetricValue(data.metric.subject, new MetricValue(data.metric.metricId, value));
    if (this.displayData.every((data: SReplacerDataMap) => {return data['value'] != null})) {
      this.done = true;
    }
  }

  private createStyles(displayCount: number, staffNames: string[]): any {
    let styles: any = {

    }
    styles.img = { width: this.imgStyleMap[Math.min(displayCount, staffNames.length)] }
    styles.text = { 'font-size': this.textStyleMap[Math.min(displayCount, staffNames.length)] }
    return styles;
  }

  private setupDisplayData(displayCount:number, staffNames: string[]) {
    let displayData: Array<SReplacerDataMap> = [];
    for (let i = 0; i < staffNames.length && this.displayData.length < this.displayCount; i++) {
      let staffName = staffNames[i];
      let staff: Staff = this.staffSvc.getCached(staffName);
      let role: string = staff.role;
      let rootMetrics: Metric[] = this.metricSvc.getRootMetricsForSubject(Metric.createStaffSubject(staff.username));
      if (rootMetrics.length == 0) {
        rootMetrics = this.metricSvc.getRootMetricsForSubject(Metric.createRoleSubject(role));
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
      displayData.push({onlyStaff: staff, role: role, metric: rootMetric});
    }
    return displayData;
  }
}
