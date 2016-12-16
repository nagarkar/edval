import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {LoginComponent} from "../../login/login.component";
import {PickStaffComponent} from "../pickstaff/pickstaff.component";
import {Utils} from "../../../shared/stuff/utils";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {MetricService} from "../../../services/metric/delegator";
import {SessionService} from "../../../services/session/delegator";
import {Account} from "../../../services/account/schema";

@Component({
  templateUrl: 'start.component.html'
})
export class StartComponent {
  showNoThanks = false;
  account: Account;
  constructor(
    private navCtrl: NavController,
    private utils: Utils,
    tokenProvider: AccessTokenService,
    private sessionSvc: SessionService

  ) {
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

  startSurvey(){
    this.sessionSvc.newCurrentSession();
    this.utils.setRoot(this.navCtrl, PickStaffComponent, {directPage: true});
  }
}
