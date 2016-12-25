import {SurveyNavigator, NavigationTarget} from "../../services/survey/survey.navigator";
import {ThanksComponent} from "./thanks/thanks.component";
import {NavController} from "ionic-angular";
import {Utils} from "../../shared/stuff/utils";
import {Config} from "../../shared/aws/config";

export class SurveyNavUtils {
  public static navigateOrTerminate(navigator: SurveyNavigator, navCtrl: NavController, utils: Utils, ...terminationMessage: string[]) {
    utils.presentLoading();
    setTimeout(()=>{
      let navigationTarget: NavigationTarget = navigator.getNavigationTarget();
      if (navigationTarget == null) {
        utils.setRoot(navCtrl, ThanksComponent, {message: terminationMessage});
      } else {
        utils.setRoot(navCtrl, navigationTarget.component, navigationTarget.params);
      }
    }, Config.PAGE_TRANSITION_TIME)
  }
}
