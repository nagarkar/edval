import {Component} from "@angular/core";
import {Platform} from "ionic-angular";
import {StatusBar, Splashscreen} from "ionic-native";
import {ServiceFactory} from "../services/service.factory";
import {StartWithSurveyOption} from "../pages/survey/start/start.with.survey.option.component";
import {
  AllPromoters,
  StrongDetractor,
  StrongPromoter,
  AnyDetractors,
  AveragePromoterScore
} from "../services/survey/survey.functions";
import {HeaderComponent} from "../shared/components/header/header.component";
import {LoginComponent} from "../pages/login/login.component";
import {DashboardComponent} from "../pages/dashboard/dashboard.component";
import {SettingsComponent} from "../pages/settings/settings.component";

@Component({
  template: `<ion-nav [root]="rootPage" [rootParams]="rootParams"></ion-nav>`
})
export class RevvolveApp {
  rootPage = LoginComponent;
  rootParams = {defaultOnly: true}

  constructor(platform: Platform, serviceFactory: ServiceFactory) {
    platform.ready().then(() => {
      // The platform is ready and our plugins are available.
      StatusBar.styleDefault();
      Splashscreen.hide();
      // This is required to make sure the class decorators run. There must be a better way to do this.
      new AllPromoters();
      new AveragePromoterScore();
      new AnyDetractors();
      new StrongPromoter();
      new StrongDetractor();
      HeaderComponent.HOME_MAP = {
        'login': LoginComponent,
        'dashboard': DashboardComponent,
        'survey': StartWithSurveyOption,
        'surveyinternal': StartWithSurveyOption,
        'settings': SettingsComponent
      }
      HeaderComponent.DEFAULT_HOME = LoginComponent;
    });
  }
}
