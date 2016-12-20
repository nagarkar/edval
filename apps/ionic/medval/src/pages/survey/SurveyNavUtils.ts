import {SurveyNavigator, NavigationTarget} from "../../services/survey/survey.navigator";
import {ThanksComponent} from "./thanks/thanks.component";
import {NavController} from "ionic-angular";
import {Utils} from "../../shared/stuff/utils";

export class SurveyNavUtils {
  public static handleEvent(navigator: SurveyNavigator, navCtrl: NavController, utils: Utils) {
    let navigationTarget: NavigationTarget = navigator.getNavigationTarget();
    if (navigationTarget == null) {
      utils.setRoot(navCtrl, ThanksComponent);
    } else {
      utils.setRoot(navCtrl, navigationTarget.component, navigationTarget.params);
    }
  }
}
