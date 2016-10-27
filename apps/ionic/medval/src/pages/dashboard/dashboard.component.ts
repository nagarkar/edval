import {Component, Inject} from '@angular/core';

import { NavController, Tab } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

/*
import { StaffComponent } from '../../staff-info'

import { AccountSettingsComponent } from '../../account-settings'

*/

import {App} from 'ionic-angular';
import {AccountComponent} from "../account/account.component";
import {AccessTokenProvider} from "../../shared/aws/access.token.service";
import {LoginComponent} from "../login/login.component";
import {TermComponent} from "./terms/term.component";
import {PolicyComponent} from "./policy/policy.component";
import {StaffComponent} from "../staff/staff.component";

@Component({
  templateUrl: 'dashboard.component.html'
})

export class DashboardComponent {

  constructor(private navCtrl: NavController,
    @Inject(AccessTokenProvider) private accessTokenProvider) {

  }

  openNavAccountPage() {
    this.goto(AccountComponent);
  }

  gotoStaffPage() {
    this.goto(StaffComponent);
  }

  openNavGetHelpPage() {
    this.goto(LoginComponent);
  }

  openNavTermsPage() {
    this.goto(TermComponent);
  }

  openNavPrivacyPage() {
    this.goto(PolicyComponent);
  }

  logout(){
    this.accessTokenProvider.logout();
    this.navCtrl.setRoot(LoginComponent);
  }

  private goto(component: any) : void {
    this.navCtrl.push(component);
  }
}

