import {SurveyNavigator, NavigationTarget} from "../../services/survey/survey.navigator";
import {ThanksComponent} from "./thanks/thanks.component";
import {NavController, LoadingController} from "ionic-angular";
import {Utils} from "../../shared/stuff/utils";
import {Config} from "../../shared/config";

export class SurveyNavUtils {
  public static navigateOrTerminate(navigator: SurveyNavigator, loadingCtrl: LoadingController, navCtrl: NavController, ...terminationMessage: string[]) {
    Utils.presentLoading(loadingCtrl);
    setTimeout(()=>{
      let navigationTarget: NavigationTarget = navigator.getNavigationTarget();
      if (navigationTarget == null) {
        navCtrl.setRoot(ThanksComponent, {message: terminationMessage});
      } else {
        navCtrl.setRoot(navigationTarget.component, navigationTarget.params);
      }
    }, Config.PAGE_TRANSITION_TIME)
  }
}
