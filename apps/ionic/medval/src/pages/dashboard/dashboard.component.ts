import {Component, Inject} from '@angular/core';

import { NavController} from 'ionic-angular';

import {AccountComponent} from "../account/account.component";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {LoginComponent} from "../login/login.component";
import {TermComponent} from "./terms/term.component";
import {PolicyComponent} from "./policy/policy.component";
import {StaffComponent} from "../staff/staff.component";
import {StartComponent} from "../survey/start/start.component";
import {Utils} from "../../shared/stuff/utils";
import {AllTrendsComponent} from "../charts/all.trends";
import {MetricSummaryComponent} from "../metricsetup/metric.summary.component";

@Component({
  templateUrl: 'dashboard.component.html'
})

export class DashboardComponent {

  constructor(private navCtrl: NavController,
    private accessTokenProvider: AccessTokenService,
    private utils: Utils) {
  }

  openNavAccountPage() {
    this.goto(AccountComponent);
  }

  gotoStaffPage() {
    this.goto(StaffComponent);
  }

  gotoMetricsPage() {
    this.goto(MetricSummaryComponent);
  }

  gotoBusinessHealthPage() {
    this.goto(AllTrendsComponent);
  }

  gotoSurveyPage() {
    this.utils.setRoot(this.navCtrl, StartComponent);
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
    this.utils.setRoot(this.navCtrl, LoginComponent);
  }

  private goto(component: any) : void {
    this.utils.push(this.navCtrl, component);
  }
}

