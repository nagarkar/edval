import {Component, AfterViewChecked, AfterViewInit} from '@angular/core';

import { NavController} from 'ionic-angular';
import {Config} from "../../../shared/aws/config";
import {StartComponent} from "../start/start.component";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {MedvalComponent} from "../../../shared/stuff/medval.component";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {StartWithSurveyOption} from "../startWithSurveyOption/start.with.survey.option.component";

@Component({
  templateUrl: 'thanks.component.html',
})
export class ThanksComponent extends MedvalComponent implements AfterViewInit {

  constructor(
    tokenProvider: AccessTokenService,
    private sessionService: SessionService,
    navCtrl: NavController,
    utils: Utils
    ) {
    super(tokenProvider, navCtrl, utils);
    sessionService.closeCurrentSession();
  }

  public restartSurvey() {
    this.utils.push(this.navCtrl, StartWithSurveyOption);
  }

  public ngAfterViewInit() {
    setTimeout(()=> {
      this.restartSurvey();
    }, Config.TIME_OUT_AFTER_SURVEY)
  }
}
