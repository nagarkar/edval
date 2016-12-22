import {Component} from '@angular/core';

import { NavController} from 'ionic-angular';
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {SurveyNavUtils} from "../SurveyNavUtils";
import {RegisterComponent} from "../../../services/survey/survey.navigator";

@Component({
  templateUrl: 'handle.complaint.component.html',
})

@RegisterComponent
export class HandleComplaintComponent {

  public complaintMsg: string;

  constructor(
    tokenProvider: AccessTokenService,
    private sessionSvc: SessionService,
    private navCtrl: NavController,
    private utils: Utils
  ) {
  }

  public navigateToNext() {
    SurveyNavUtils.navigateOrTerminate(
      this.sessionSvc.surveyNavigator,
      this.navCtrl,
      this.utils,
      "We're sorry if had a bad experience",
      "The folks at Orthodontic Excellence want to do better",
      "Rest assured that your feedback, although nameless, will help");
  }
}
