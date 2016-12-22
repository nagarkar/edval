import { Component } from '@angular/core';

import {NavController} from 'ionic-angular';
import {LoginComponent} from "../../login/login.component";
import {Utils} from "../../../shared/stuff/utils";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {SessionService} from "../../../services/session/delegator";
import {Account} from "../../../services/account/schema";
import {SurveyService} from "../../../services/survey/delegator";
import {SurveySelectionComponent} from "../surveyselection/surveyselection.component";
import {ThanksComponent} from "../thanks/thanks.component";
import {ObjectCycler} from "../../../shared/stuff/object.cycler";
import {SurveyNavUtils} from "../SurveyNavUtils";

@Component({
  templateUrl: 'start.with.survey.option.component.html'
})

export class StartWithSurveyOption extends SurveySelectionComponent {
  private images = [
    'assets/img/do-better4.jpg',
    'assets/img/intentions2.jpg',
  ];
  leftImage: string = this.images[0];
  account: Account;
  constructor(
    navCtrl: NavController,
    utils: Utils,
    tokenProvider: AccessTokenService,
    surveySvc: SurveyService,
    sessionSvc: SessionService
  ) {
    super(navCtrl, utils, tokenProvider, surveySvc, sessionSvc);
    new ObjectCycler<string>(null, ...this.images)
      .onNewObj.subscribe((next:string)=>this.leftImage = next);
    //TODO remove this.
    tokenProvider.startNewSession("celeron", "passWord@1");
  }

  gotoLogin() {
    this.utils.setRoot(this.navCtrl, LoginComponent);
  }

  noThanks() {
    this.utils.setRoot(this.navCtrl, ThanksComponent, {message: ["That's ok, maybe next time!"]});
  }

  pickSurvey(idx: number){
    this.sessionSvc.newCurrentSession(this.surveys[idx].id);
    SurveyNavUtils.navigateOrTerminate(this.sessionSvc.surveyNavigator, this.navCtrl, this.utils);
  }
}
