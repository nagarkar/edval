import {Component, AfterViewChecked, AfterViewInit} from '@angular/core';

import { NavController} from 'ionic-angular';
import {Config} from "../../../shared/aws/config";
import {StartComponent} from "../start/start.component";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {MedvalComponent} from "../../../shared/stuff/medval.component";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {SurveyNavUtils} from "../SurveyNavUtils";

@Component({
  templateUrl: 'promoterinfluencers.component.html',
})

@RegisterComponent
export class PromoterInfluencersComponent {

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
