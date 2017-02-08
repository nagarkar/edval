/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

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

  static internetCheckHandle: number;
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

      this.initiateConnectionCheck(http);
    });
  }

  private initiateConnectionCheck(http: Http) {
    let client: HttpClient<string> = new HttpClient<string>(http);
    if (RevvolveApp.internetCheckHandle) {
      clearInterval(RevvolveApp.internetCheckHandle)
    }
    RevvolveApp.internetCheckHandle = setInterval(()=>{
      client.ping().catch((err)=>{
        alert('You may not have a working internet connection. Please check your Wifi and/or data service settings.')
      }).then((result)=> {
        Utils.log('Customer: {0}, Ping response {1}, from remote url {2} ', Config.CUSTOMERID, result, Config.pingUrl);
      })
    }, 1 * 60 * 1000);
  }
}
