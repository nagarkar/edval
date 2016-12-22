import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {LoginComponent} from "../../login/login.component";
import {PickStaffComponent} from "../pickstaff/pickstaff.component";
import {Utils} from "../../../shared/stuff/utils";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {MetricService} from "../../../services/metric/delegator";
import {SessionService} from "../../../services/session/delegator";
import {Account} from "../../../services/account/schema";
import {SurveyService} from "../../../services/survey/delegator";
import {Session} from "../../../services/session/schema";
import {SurveySelectionComponent} from "../surveyselection/surveyselection.component";
import {NavigationTarget} from "../../../services/survey/survey.navigator";
import {ThanksComponent} from "../thanks/thanks.component";
import {ObjectCycler} from "./object.cycler";

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
    let navTarget: NavigationTarget = this.sessionSvc.surveyNavigator.getNavigationTarget();
    setTimeout(()=> {
      this.utils.setRoot(this.navCtrl, navTarget.component, navTarget.params);
    }, 1000)
  }
}
