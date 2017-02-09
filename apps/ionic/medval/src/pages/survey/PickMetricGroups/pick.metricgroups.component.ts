/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component, ViewChild, ElementRef, Input} from "@angular/core";
import {Utils} from "../../../shared/stuff/utils";
import {StaffService} from "../../../services/staff/delegator";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {NavParams, NavController} from "ionic-angular";
import {MetricService} from "../../../services/metric/delegator";
import {SessionService} from "../../../services/session/delegator";
import {Idle} from "@ng-idle/core";
import {SurveyPage} from "../survey.page";

@Component({
  selector: 'pick-problem-role',
  templateUrl: './pick.metricgroups.component.html',
  //providers: [Idle]
})

@RegisterComponent
export class PickMetricGroups extends SurveyPage {

  @ViewChild('imageMap')
  imageMap: ElementRef;

  title : string = "What part of your experience was the least satisfying?";

  done: boolean = false;

  @Input()
  params: any = {};

  constructor(
    idle: Idle,
    utils: Utils,
    navCtrl: NavController,
    sessionSvc: SessionService,
    params: NavParams,
    private staffSvc: StaffService,
    private metricSvc: MetricService
  ) {

    super(navCtrl, sessionSvc, idle);
    this.params = params.get('graphicalMetricGroupIndicators');
    this.title = params.get('title') || this.title;
  }


  handleSelected(index: number) {
    let area: HTMLAreaElement = this.imageMap.nativeElement.areas[index] as HTMLAreaElement;
    let metricIds: string[] = area.alt.split(',')
    if (this.sessionSvc.hasCurrentSession()) {
      this.sessionSvc.scratchPad.metricsForTopLineInfluencer = metricIds;
    }
    this.done = true;
  }
}
