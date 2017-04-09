/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {SurveyNavigator, NavigationTarget} from "../../services/survey/survey.navigator";
import {ThanksComponent} from "./thanks/thanks.component";
import {NavController} from "ionic-angular";
import {Utils} from "../../shared/stuff/utils";
import {Config} from "../../shared/config";
import {SpinnerDialog} from "ionic-native";

export class SurveyNavUtils {

  /**
   *
   * @param navigator The surveyNavigator in use
   * @param navCtrl
   * @param dontAnimate This is used to disable ionic ease-in animation and page transition delay.
   * @param terminationMessage
   * @returns {Promise<any>}
   */
  public static navigateOrTerminate(navigator: SurveyNavigator, navCtrl: NavController, dontAnimate?: boolean, ...terminationMessage: string[]): Promise<any> {
    SpinnerDialog.show();
    return new Promise<any>((resolve, reject)=> {
      setTimeout(()=>{
        let navigationTarget: NavigationTarget;
        try {
          navigationTarget = navigator.getNavigationTarget();
        } catch(err) {
          reject(err);
          let errMsg = Utils.format("In SurveyNavUtils Could not get Navigation Target: The error is {0}. Stack:", err, err.stack || new Error().stack);
          Utils.error(errMsg);
          alert(errMsg);
        }
        let component: any = (navigationTarget && navigationTarget.component) || ThanksComponent;
        let params = component == ThanksComponent ? {message: terminationMessage} : navigationTarget.params;
        if (component) {
          try {
            let promise = null;
            if (dontAnimate) {
              promise = Utils.setRootNoAnimation(navCtrl, component, params);
            } else {
              promise = Utils.setRoot(navCtrl, component, params);
            }
            resolve(promise);
          } catch(err) {
            reject(err);
            let errMsg = Utils.format("Unexpected Error: {0}, Stack: {1}", err, err, err.stack || new Error().stack);
            Utils.error(errMsg);
            alert(errMsg);
          }
        }
        SpinnerDialog.hide();
      }, dontAnimate ? 0 : Config.PAGE_TRANSITION_TIME)
    });
  }
}
