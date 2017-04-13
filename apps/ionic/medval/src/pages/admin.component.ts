/// <reference path="./any.component.ts" />
/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {Utils} from "../shared/stuff/utils";
import {Config} from "../shared/config";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {SpinnerDialog} from "ionic-native";
import {Http} from "@angular/http";
import {AnyComponent} from "./any.component";
import {DeviceServices} from "../shared/service/DeviceServices";
import {RevvolvePage} from "./revvolve.page";
import {StartWithSurveyOption} from "./survey/start/start.with.survey.option.component";

/**
 * Subclasses should implement ngOnInit() and call super.ngOnInit() before calling the account to load
 * data.
 */
export abstract class AdminComponent extends RevvolvePage implements OnInit {

  constructor(navCtrl: NavController, private http: Http) {
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

}
