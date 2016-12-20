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

@Component({
  templateUrl: 'start.with.survey.option.component.html'
})

export class StartWithSurveyOption extends SurveySelectionComponent {
  showNoThanks = false;
  private images = [
    'assets/img/do-better4.jpg',
    //'assets/img/do-better.jpg',
    'assets/img/intentions2.jpg',
    //'assets/img/intentions3.jpg',
    //'assets/img/do-better3-left.jpg',
    //'assets/img/intentions.jpg',
    //'assets/img/improve-easy-button.jpg'
  ];
  leftImage: string;
  account: Account;
  constructor(
    navCtrl: NavController,
    utils: Utils,
    tokenProvider: AccessTokenService,
    surveySvc: SurveyService,
    sessionSvc: SessionService
  ) {
    super(navCtrl, utils, tokenProvider, surveySvc, sessionSvc);
    this.leftImage = this.images[0];
    setInterval(()=> {
      this.cycleImage();
    }, 15000 /*http://museumtwo.blogspot.com/2010/10/getting-people-in-door-design-tips-from.html */);
    //TODO remove this.
    tokenProvider.startNewSession("celeron", "passWord@1");
  }

  gotoLogin() {
    this.utils.setRoot(this.navCtrl, LoginComponent);
  }

  noThanks() {
    this.showNoThanks = true;
    setTimeout(()=> {
      this.showNoThanks = false;
    }, 5000)
  }

  pickSurvey(idx: number){
    this.sessionSvc.newCurrentSession(this.surveys[idx].id);
    let navTarget: NavigationTarget = this.sessionSvc.surveyNavigator.getNavigationTarget();
    setTimeout(()=> {
      this.utils.setRoot(this.navCtrl, navTarget.component, navTarget.params);
    }, 1000)

    /*
    setTimeout(()=> {
      this.utils.setRoot(this.navCtrl, PickStaffComponent, {directPage: true});
    }, 1000)
    */
  }

  private cycleImage() {
    this.leftImage = this.images[(this.images.indexOf(this.leftImage) + 1) % this.images.length];
  }
}
