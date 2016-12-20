import {Component, OnInit} from '@angular/core';

import { NavController } from 'ionic-angular';
import {LoginComponent} from "../../login/login.component";
import {PickStaffComponent} from "../pickstaff/pickstaff.component";
import {Utils} from "../../../shared/stuff/utils";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {MetricService} from "../../../services/metric/delegator";
import {SessionService} from "../../../services/session/delegator";
import {Account} from "../../../services/account/schema";
import {SurveyService} from "../../../services/survey/delegator";
import {Survey} from "../../../services/survey/schema";
import {StartComponent} from "../start/start.component";
import {ServiceInterface} from "../../../shared/service/interface.service";
import {ServiceFactory} from "../../../services/service.factory";

@Component({
  templateUrl: 'surveyselection.component.html'
})
export class SurveySelectionComponent implements OnInit {

  surveys : Survey[] = [];

  constructor(
    protected navCtrl: NavController,
    protected utils: Utils,
    tokenProvider: AccessTokenService,
    protected surveyService: SurveyService,
    protected sessionSvc: SessionService

  ) { }

  pickSurvey(idx: number) {
    this.sessionSvc.newCurrentSession(this.surveys[idx].id);
    this.utils.setRoot(this.navCtrl, StartComponent, {directPage: true});
  }

  ngOnInit() {
    this.surveyService.list().then((surveys: Survey[]) => {
      this.surveys = surveys;
    });
  }
}
