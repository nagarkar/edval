import {Component, ViewChild, ElementRef, Input} from "@angular/core";
import {Metric, MetricValue} from "../../../services/metric/schema";
import {Utils} from "../../../shared/stuff/utils";
import {RatingComponent} from "../../../shared/components/rating/rating.component";
import {StaffService} from "../../../services/staff/delegator";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {NavParams, NavController, LoadingController} from "ionic-angular";
import {MetricService} from "../../../services/metric/delegator";
import {SessionService} from "../../../services/session/delegator";
import {Idle} from "@ng-idle/core";
import {SurveyPage} from "../survey.page";

@Component({
  selector: 'pick-problem-role',
  templateUrl: 'pick.metricgroups.component.html',
  providers: [Idle]
})

@RegisterComponent
export class PickMetricGroups extends SurveyPage {

  @ViewChild('imageMap')
  imageMap: ElementRef;

  msg : string = "What part of your experience was the least satisfying?";

  @Input()
  params: any = {};

  constructor(
    idle: Idle,
    utils: Utils,
    navCtrl: NavController,
    loadingCtrl: LoadingController,
    sessionSvc: SessionService,
    params: NavParams,
    private staffSvc: StaffService,
    private metricSvc: MetricService
  ) {

    super(loadingCtrl, navCtrl, sessionSvc, idle);
    this.params = params.get('graphicalMetricGroupIndicators');
    this.msg = params.get('message') || this.msg;
  }


  handleSelected(index: number) {
    let area: HTMLAreaElement = this.imageMap.nativeElement.areas[index] as HTMLAreaElement;
    let metricIds: string[] = area.alt.split(',')
    if (this.sessionSvc.hasCurrentSession()) {
      this.sessionSvc.scratchPad.metricsForTopLineInfluencer = metricIds;
    }
    super.navigateToNext();
  }
}
