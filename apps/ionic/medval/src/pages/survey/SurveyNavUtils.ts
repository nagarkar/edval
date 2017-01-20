import {SurveyNavigator, NavigationTarget} from "../../services/survey/survey.navigator";
import {ThanksComponent} from "./thanks/thanks.component";
import {NavController, LoadingController, Loading} from "ionic-angular";
import {Utils} from "../../shared/stuff/utils";
import {Config} from "../../shared/config";
import {StartWithSurveyOption} from "./start/start.with.survey.option.component";

export class SurveyNavUtils {
  public static navigateOrTerminate(navigator: SurveyNavigator, loadingCtrl: LoadingController, navCtrl: NavController, ...terminationMessage: string[]) {
    let loading: Loading = Utils.presentLoading(loadingCtrl, 750);
    setTimeout(()=>{
      let navigationTarget: NavigationTarget;
      try {
        navigationTarget = navigator.getNavigationTarget();
      } catch(err) {
        Utils.error("In SurveyNavUtils Could not get Navigation Target: The error is {0}", err);
        alert("Unexpected Error Occurred:" + err);
      }
      let component: any = (navigationTarget && navigationTarget.component) || ThanksComponent;
      let params = component == ThanksComponent ? {message: terminationMessage} : navigationTarget.params;
      if (component) {
        try {
          navCtrl.setRoot(component, params);
        } catch(err) {
          Utils.error(err);
          alert("Unexpected Error Occurred:" + err);
        }
      }
      loading.dismissAll();
    }, Config.PAGE_TRANSITION_TIME)
  }

  static goToStart(navCtrl: NavController) {
    navCtrl.setRoot(StartWithSurveyOption, {defaultOnly: true});
  }
}
