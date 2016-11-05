import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {LoginComponent} from "../../login/login.component";
import {PickStaffComponent} from "../pickstaff/pickstaff.component";
import {Utils} from "../../../shared/stuff/utils";
import {AccessTokenService} from "../../../shared/aws/access.token.service";

@Component({
  templateUrl: 'start.component.html'
})
export class StartComponent {
  showNoThanks = false;
  constructor(
    private navCtrl: NavController,
    private utils: Utils,
    tokenProvider: AccessTokenService

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
    this.utils.setRoot(this.navCtrl, PickStaffComponent, {directPage: true});
  }
}
