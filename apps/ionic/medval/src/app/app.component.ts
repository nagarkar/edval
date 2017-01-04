import {Component} from "@angular/core";
import {Platform} from "ionic-angular";
import {StatusBar, Splashscreen} from "ionic-native";
import {ServiceFactory} from "../services/service.factory";
import {StartWithSurveyOption} from "../pages/survey/start/start.with.survey.option.component";
import {AllPromoters, StrongDetractor, StrongPromoter, AnyDetractors} from "../services/survey/survey.functions";
import {HeaderComponent} from "../shared/components/header/header.component";
import {LoginComponent} from "../pages/login/login.component";
import {DashboardComponent} from "../pages/dashboard/dashboard.component";
import {SettingsComponent} from "../pages/settings/settings.component";
import {Config} from "../shared/config";


@Component({
  template: `<ion-nav [root]="rootPage" [rootParams]="rootParams"></ion-nav>`
})
export class MyApp {
  rootPage = LoginComponent;
  rootParams = {defaultOnly: true}

  constructor(platform: Platform, serviceFactory: ServiceFactory) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      // This is required to make sure the class decorators run. There must be a better way to do this.
      new AllPromoters();
      new AnyDetractors();
      new StrongPromoter();
      new StrongDetractor();
      if (!window['REVVOLVE_PROD_ENV']) {
        Config.CUSTOMERID = "OMC";
        serviceFactory.resetRegisteredServices(); // this needs to be done first, esp in mock mode.
      }
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
