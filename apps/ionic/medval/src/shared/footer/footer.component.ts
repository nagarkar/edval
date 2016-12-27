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

@Component({
  templateUrl: 'footer.component.html',
  selector: 'mdval-footer'
})
export class FooterComponent {
  @Input() reassure: boolean;
}
