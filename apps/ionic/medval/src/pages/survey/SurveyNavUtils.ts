/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {SurveyNavigator, NavigationTarget} from "../../services/survey/survey.navigator";
import {ThanksComponent} from "./thanks/thanks.component";
import {NavController, LoadingController} from "ionic-angular";
import {Utils} from "../../shared/stuff/utils";
import {Config} from "../../shared/config";
import {StartWithSurveyOption} from "./start/start.with.survey.option.component";
import {SpinnerDialog} from "ionic-native";

export class SurveyNavUtils {
  public static navigateOrTerminate(navigator: SurveyNavigator, navCtrl: NavController, ...terminationMessage: string[]): Promise<any> {
    SpinnerDialog.show();
    return new Promise<any>((resolve, reject)=> {
      setTimeout(()=>{
        let navigationTarget: NavigationTarget;
        try {
          navigationTarget = navigator.getNavigationTarget();
        } catch(err) {
          reject(err);
          Utils.error("In SurveyNavUtils Could not get Navigation Target: The error is {0}. Stack:", err, new Error().stack);
          alert("Unexpected Error Occurred:" + err);
        }
        let component: any = (navigationTarget && navigationTarget.component) || ThanksComponent;
        let params = component == ThanksComponent ? {message: terminationMessage} : navigationTarget.params;
        if (component) {
          try {
            let promise = Utils.setRoot(navCtrl, component, params);
            resolve(promise);
          } catch(err) {
            reject(err);
            Utils.error("Error: {0}, Stack: {1}", err, new Error().stack);
            alert("Unexpected Error Occurred:" + err);
          }
        }
        SpinnerDialog.hide();
      }, Config.PAGE_TRANSITION_TIME)
    });
  }

  static goToStart(navCtrl: NavController) {
    Utils.setRoot(navCtrl, StartWithSurveyOption, {defaultOnly: true});
  }
}
