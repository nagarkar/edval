import {Component, AfterViewChecked, AfterViewInit} from '@angular/core';

import { NavController} from 'ionic-angular';
import {Config} from "../../../shared/aws/config";
import {StartComponent} from "../start/start.component";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {MedvalComponent} from "../../../shared/stuff/medval.component";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {SurveyNavigator, NavigationTarget, RegisterComponent} from "../../../services/survey/survey.navigator";
import {ThanksComponent} from "../thanks/thanks.component";
import {SurveyNavUtils} from "../SurveyNavUtils";

@Component({
  templateUrl: 'detractor.influencer.component.html',
})

@RegisterComponent
export class DetractorInfluencerComponent {

  constructor(
    tokenProvider: AccessTokenService,
    private sessionSvc: SessionService,
    private navCtrl: NavController,
    private utils: Utils
    ) {
  }

  public navigateToNext() {
    SurveyNavUtils.handleEvent(this.sessionSvc.surveyNavigator, this.navCtrl, this.utils);
  }
}
