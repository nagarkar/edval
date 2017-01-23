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
import {Http} from "@angular/http";
import {HttpClient} from "../shared/stuff/http.client";
import {Utils} from "../shared/stuff/utils";
import {Config} from "../shared/config";

@Component({
  template: `<ion-nav [root]="rootPage" [rootParams]="rootParams"></ion-nav>`
})
export class RevvolveApp {
  rootPage = LoginComponent;
  rootParams = {defaultOnly: true}

  constructor(platform: Platform, serviceFactory: ServiceFactory, http: Http) {
    platform.ready().then(() => {
      // The platform is ready and our plugins are available.
      StatusBar.styleDefault();
      StatusBar.hide();
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

      let client: HttpClient<string> = new HttpClient<string>(http);
      setInterval(()=>{
        client.ping().catch((err)=>{
          alert('You may not have a working internet connection. Please check your Wifi and/or data service settings.')
        }).then((result)=> {console.log(Utils.format('Ping response {0}, from remote url {1} ', result, Config.pingUrl))})
      }, 1 * 60 * 1000);

    });
  }
}
