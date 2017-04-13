/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {StatusBar, Splashscreen, Device} from "ionic-native";
import {Component, Injector} from "@angular/core";
import {Platform, Alert, AlertController} from "ionic-angular";
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
import {GoogleChartsConfig as ChartConfig} from "../pages/reporting/config";
import {AccessTokenService} from "../shared/aws/access.token.service";
import {DeviceServices} from "../shared/service/DeviceServices";
import {AppVersion} from "@ionic-native/app-version";
import {CodePush} from "@ionic-native/code-push";
import {Idle} from "@ng-idle/core";

declare let google;

@Component({
  template: `<ion-nav [root]="rootPage" [rootParams]="rootParams"></ion-nav>`
})
export class RevvolveApp {

  static GlobalInjector: Injector;
  private static CONNECTION_CHECK_HANDLE: number;


  rootPage = LoginComponent;
  rootParams = {defaultOnly: true}
  connectionRetries: number;

  constructor(
    platform: Platform,
    http: Http,
    appVersion: AppVersion,
    codePush: CodePush,
    private injector:Injector,
    private alertCtrl: AlertController,
    private tokenSvc: AccessTokenService) {

    this.resetConnectionRetries();
    if (!RevvolveApp.GlobalInjector) {
      RevvolveApp.GlobalInjector = injector;
    }

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
      this.initializeGoogleCharts();
      DeviceServices.initialize(appVersion, codePush);
    });
  }

  private initiateConnectionCheck(http: Http) {
    let client: HttpClient<string> = new HttpClient<string>(http);
    if (RevvolveApp.CONNECTION_CHECK_HANDLE) {
      clearInterval(RevvolveApp.CONNECTION_CHECK_HANDLE)
    }
    let alert: Alert;
    RevvolveApp.CONNECTION_CHECK_HANDLE = setInterval(()=>{
      client.ping()
        .then((result)=> {
          if (alert) {
            alert.dismiss();
            alert = null;
          }
          this.resetConnectionRetries();
          Utils.info('Customer: {0}, Ping response {1}, from remote url {2} ', Config.CUSTOMERID, result, Config.pingUrl);
        })
        .catch((err)=>{
          if (!alert) {
            alert = Utils.presentInvalidEntryAlert(this.alertCtrl, "Connection", "You may not have a working internet connection. Please check your Wifi and/or data service settings.")
            alert.onDidDismiss(()=> {alert = null;})
          }
          this.connectionRetries--;
          if (this.connectionRetries <= 0) {
            this.resetConnectionRetries()
              this.tokenSvc.logout();
            }
          })
    }, Config.PING_INTERVAL);
  }

  private resetConnectionRetries() {
    this.connectionRetries = 3;
  }

  private initializeGoogleCharts() {
    google.charts.load('current', { packages: ['corechart', 'controls', 'table'] });
    google.charts.setOnLoadCallback(()=>{
      ChartConfig.CHARTS_LOADED = true;
    });
  }
}
