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

  constructor(private navCtrl: NavController,
    private accessTokenProvider: AccessTokenService,
    private utils: Utils) {
  }

  gotoHome(): void {
    this.navCtrl.push(LoginComponent);
  }

  gotoSettings(): void {
    this.navCtrl.push(SettingsComponent);
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
    this.utils.setRoot(this.navCtrl, StartWithSurveyOption);
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

