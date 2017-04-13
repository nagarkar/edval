/// <reference path="./any.component.ts" />
/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {OnInit} from "@angular/core";
import {NavController, Alert, AlertController} from "ionic-angular";
import {Utils} from "../shared/stuff/utils";
import {Config} from "../shared/config";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {SpinnerDialog, Dialogs} from "ionic-native";
import {Http} from "@angular/http";
import {DeviceServices} from "../shared/service/DeviceServices";
import {RevvolvePage} from "./revvolve.page";

/**
 * Subclasses should implement ngOnInit() and call super.ngOnInit() before calling the account to load
 * data.
 */
export abstract class AdminComponent extends RevvolvePage implements OnInit {

  constructor(navCtrl: NavController, protected alertCtrl: AlertController, private http: Http) {
    super(navCtrl);
    setTimeout(()=>{
      SpinnerDialog.hide();
    }, Config.PAGE_IDLE_SECONDS/4);
  }

  ngOnInit() {
    try {
      DeviceServices.warnAboutNetworkConnection();
      Utils.logoutIfNecessary(this.navCtrl, this.http);
      super.ngOnInit();
    } catch(err) {
      Utils.error("Error in AdminComponent.ngOnInit {0}", err);
    }
  }

  handleErrorAndCancel(err: any) {
    let errMsg = Utils.format("Unexpected error: {0}, with stack trace {1}", err, err.stack || new Error().stack);
    Utils.error(errMsg);
    alert(errMsg);
    setTimeout(()=>{
      this.navCtrl.setRoot(DashboardComponent);
    }, 50)
  }

  protected idleSeconds(): number {
    return Config.ADMIN_PAGE_IDLE_SECONDS;
  }

  protected timeoutSeconds(): number {
    return Config.ADMIN_PAGE_TIMEOUT_SECONDS;
  }

  warn = (function(): Promise<boolean> {
    return new Promise((resolve, reject)=> {
      let alert: Alert = Utils.presentProceedCancelPrompt(this.alertCtrl, (result)=> {
        RevvolvePage.stopIdling();
        resolve(true);
      }, "Are you sure you wan to log out?")
      alert.onDidDismiss(()=> {
        resolve(false);
      })
    })
  }).bind(this);
}
