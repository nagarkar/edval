/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {
  CodePush,
  Brightness,
  BatteryStatus,
  BatteryStatusResponse,
  Device,
  NativeStorage,
  StatusBar,
  Splashscreen
} from "ionic-native";
import {Component} from "@angular/core";
import {Platform, Alert, AlertController} from "ionic-angular";
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
import {GoogleChartsConfig as ChartConfig} from "../pages/reporting/config";
import {AccessTokenService} from "../shared/aws/access.token.service";
import {Subscription} from "rxjs";

declare let google;

@Component({
  template: `<ion-nav [root]="rootPage" [rootParams]="rootParams"></ion-nav>`
})
export class RevvolveApp {

  private static CONNECTION_CHECK_HANDLE: number;
  private static BATTERY_SUBSCRIPTION: Subscription;
  private static INITIAL_INSTALL_TIMESTAMP = "INITIAL_INSTALL_TIMESTAMP";

  rootPage = LoginComponent;
  rootParams = {defaultOnly: true}
  connectionRetries: number;

  constructor(
    platform: Platform,
    serviceFactory: ServiceFactory,
    http: Http,
    private alertCtrl: AlertController,
    private tokenSvc: AccessTokenService) {

    this.resetConnectionRetries();
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

      google.charts.load('current', { packages: ['corechart', 'controls', 'table'] });
      google.charts.setOnLoadCallback(()=>{
        ChartConfig.CHARTS_LOADED = true;
      });

      this.setupCodePush();
      this.setupBatteryCheck();
      this.setupOnPause();
      this.storeInitialInstallDate();
    });
  }

  private setupOnPause() {
    document.addEventListener("pause", ()=>{
      Utils.log("Application Paused");
    }, false);
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

  private setupCodePush() {
    Utils.log("Setup Code Push");
    CodePush.sync();
  }

  private setupBatteryCheck() {
    let setBrightnessAndScreenOn = (b: number, o: boolean)=>{
      Utils.info("Setting brightness: {0}, screenon: {1}", b, o);
      Brightness.setBrightness(b);
      Brightness.setKeepScreenOn(o);
    }
    // watch change in battery status
    if (RevvolveApp.BATTERY_SUBSCRIPTION) {
      RevvolveApp.BATTERY_SUBSCRIPTION.unsubscribe();
    }
    RevvolveApp.BATTERY_SUBSCRIPTION = BatteryStatus.onChange().subscribe(
      (status: BatteryStatusResponse) => {
        Utils.log("In brightness observable");
        if (status.isPlugged) {
          setBrightnessAndScreenOn(0.9, true);
          return;
        }
        if (status.level > 0.9) {
          setBrightnessAndScreenOn(0.9, true);
        } else if (status.level > 0.8) {
          setBrightnessAndScreenOn(0.8, true);
        } else if (status.level > 0.3) {
          setBrightnessAndScreenOn(0.7, true);
        } else {
          setBrightnessAndScreenOn(-1, false);
        }
      }
    );
  }

  private storeInitialInstallDate() {
    NativeStorage.getItem(RevvolveApp.INITIAL_INSTALL_TIMESTAMP)
      .then((timestamp)=>{
        Utils.info("Retrieved {0} for Device {2}: {1}", RevvolveApp.INITIAL_INSTALL_TIMESTAMP, timestamp, Device.serial);
        if (!timestamp) {
          let currentTime = new Date().getTime();
          NativeStorage.setItem(RevvolveApp.INITIAL_INSTALL_TIMESTAMP, currentTime)
            .then(()=>{
              Utils.info("Stored {0} for device {2}: {1}", RevvolveApp.INITIAL_INSTALL_TIMESTAMP, currentTime, Device.serial);
            })
            .catch((err)=>{
              Utils.error("In NativeStorage.setItem(INITIAL_INSTALL_TIMESTAMP) for Device {1}; {0}", Utils.stringify(err), Device.serial);
            })
        }
      })
      .catch((err)=>{
        Utils.error("In NativeStorage.getItem(INITIAL_INSTALL_TIMESTAMP) for Device {1}; {0}", err, Device.serial);
      })
  }
}
