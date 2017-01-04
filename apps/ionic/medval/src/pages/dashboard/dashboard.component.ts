import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {AccountComponent} from "../account/account.component";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {LoginComponent} from "../login/login.component";
import {TermComponent} from "./terms/term.component";
import {PolicyComponent} from "./policy/policy.component";
import {StaffComponent} from "../staff/staff.component";
import {Utils} from "../../shared/stuff/utils";
import {AllTrendsComponent} from "../charts/all.trends";
import {MetricSummaryComponent} from "../metricsetup/metric.summary.component";
import {SettingsComponent} from "../settings/settings.component";
import {StartWithSurveyOption} from "../survey/start/start.with.survey.option.component";

@Component({
  templateUrl: 'dashboard.component.html'
})

export class DashboardComponent {

  constructor(private navCtrl: NavController, private accessTokenProvider: AccessTokenService) {
  }

  gotoHome(): void {
    this.navCtrl.push(LoginComponent);
  }

  gotoSettings(): void {
    this.navCtrl.push(SettingsComponent);
  }

  openNavAccountPage() {
    this.push(AccountComponent);
  }

  gotoStaffPage() {
    this.push(StaffComponent);
  }

  gotoMetricsPage() {
    this.push(MetricSummaryComponent);
  }

  gotoBusinessHealthPage() {
    this.push(AllTrendsComponent);
  }

  gotoSurveyPage() {
    this.setRoot(StartWithSurveyOption);
  }

  openNavGetHelpPage() {
    this.push(LoginComponent);
  }

  openNavTermsPage() {
    this.push(TermComponent);
  }

  openNavPrivacyPage() {
    this.push(PolicyComponent);
  }

  logout(){
    this.setRoot(LoginComponent);
  }

  private push(component: any) : void {
    this.navCtrl.push(component);
  }

  private setRoot(component) {
    this.navCtrl.setRoot(component, {}, Utils.forwardAnimation());
  }
}

