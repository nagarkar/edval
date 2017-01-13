import {SurveyNavigator, NavigationTarget} from "../../services/survey/survey.navigator";
import {ThanksComponent} from "./thanks/thanks.component";
import {NavController, LoadingController, Loading} from "ionic-angular";
import {Utils} from "../../shared/stuff/utils";
import {Config} from "../../shared/config";
import {serialize} from "class-transformer";

export class SurveyNavUtils {
  public static navigateOrTerminate(navigator: SurveyNavigator, loadingCtrl: LoadingController, navCtrl: NavController, ...terminationMessage: string[]) {
    let loading: Loading = Utils.presentLoading(loadingCtrl, 750);
    setTimeout(()=>{
      let navigationTarget: NavigationTarget;
      try {
        navigationTarget = navigator.getNavigationTarget();
        if (navigationTarget == null) {
          navCtrl.setRoot(ThanksComponent, {message: terminationMessage});
        } else {
          navCtrl.setRoot(navigationTarget.component, navigationTarget.params);
        }
      } catch(err) {
        Utils.error("In SurveyNavUtils; failed to load navigationtarget: {0}", serialize(navigationTarget));
        Utils.error("In SurveyNavUtils: The error is {0}", err);
      }
      finally {
        loading.dismissAll();
      }
    }, Config.PAGE_TRANSITION_TIME)
  }
}
