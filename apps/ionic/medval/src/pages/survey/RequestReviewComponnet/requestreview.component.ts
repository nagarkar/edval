import {Component} from '@angular/core';

import { NavController} from 'ionic-angular';
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {SurveyNavUtils} from "../SurveyNavUtils";

@Component({
  templateUrl: 'requestreview.component.html',
})

@RegisterComponent
export class RequestReviewComponent {

  public reviewMsg: string;

  constructor(
    private sessionSvc: SessionService,
    private navCtrl: NavController,
    private utils: Utils
  ) {
  }

  public navigateToNext() {
    SurveyNavUtils.navigateOrTerminate(this.sessionSvc.surveyNavigator, this.navCtrl, this.utils);
  }
}

