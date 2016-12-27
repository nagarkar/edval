import {Component, OnInit, Input} from "@angular/core";
import {AccountService} from "../../services/account/delegator";
import {NavController} from "ionic-angular";
import {Utils} from "../stuff/utils";
import {Account} from "../../services/account/schema";
import {Config} from "../aws/config";
import {StartWithSurveyOption} from "../../pages/survey/startWithSurveyOption/start.with.survey.option.component";
import {LoginComponent} from "../../pages/login/login.component";
import {DashboardComponent} from "../../pages/dashboard/dashboard.component";
import {SurveySelectionComponent} from "../../pages/survey/surveyselection/surveyselection.component";
import {SettingsComponent} from "../../pages/settings/settings.component";

/**
 * Shows the header, including the account logo. If not logged in, logo is not shown.
 */
@Component({
  templateUrl: 'header.component.html',
  selector: 'mdval-header'
})
export class HeaderComponent implements OnInit {

  private static HOME_MAP = {
    'login': LoginComponent,
    'dashboard': DashboardComponent,
    'survey': StartWithSurveyOption,
    'surveyinternal': SurveySelectionComponent,
    'settings': SettingsComponent
  }

  account: Account = new Account();

  @Input() title: string;

  /** '' home tells this component not to show the home icon **/
  @Input() home: string;

  constructor(
    private accountSvc : AccountService,
    private navCtrl: NavController,
    private utils: Utils // instance required for navigation.
  ) {
    Utils.log("Created header");
  }

  goHome() {
    this.utils.setRoot(this.navCtrl, HeaderComponent.HOME_MAP[this.home] || LoginComponent);
  }

  ngOnInit() {
    this.getAccount();
  }

  private getAccount() {
    this.accountSvc.get(Config.CUSTOMERID)
      .then((account: Account) => {
        this.account = account;
      })
      .catch(error => {
        // no op; don't show the image
      });
  }
}
