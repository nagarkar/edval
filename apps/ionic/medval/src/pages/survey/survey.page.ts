import {Utils} from "../../shared/stuff/utils";
import {NavController, LoadingController} from "ionic-angular";
import {SurveyNavUtils} from "./SurveyNavUtils";
import {SessionService} from "../../services/session/delegator";
import {Idle, DEFAULT_INTERRUPTSOURCES} from "@ng-idle/core";
import {Subject} from "rxjs";
import {StartWithSurveyOption} from "./start/start.with.survey.option.component";
import {Config} from "../../shared/config";

export class SurveyPage {

  constructor(protected loadingCtrl: LoadingController, protected navCtrl: NavController, protected sessionSvc: SessionService, idle?: Idle) {
    if (idle) {
      idle.setIdle(Config.SURVEY_PAGE_IDLE_SECONDS);
      idle.setTimeout(Config.SURVEY_PAGE_TIMEOUT_SECONDS);
      idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

      let subscription: Subject<number> = idle.onTimeout.subscribe(() => {
        this.onIdleTimeout();
        subscription.unsubscribe();
      })
      idle.watch();
    }
    sessionSvc.recordNavigatedLocationInCurrentSession(Utils.getObjectName(this));
  }

  public navigateToNext(...terminationMessage: string[]) {
    SurveyNavUtils.navigateOrTerminate(this.sessionSvc.surveyNavigator, this.loadingCtrl, this.navCtrl, ...terminationMessage);
  }

  protected onIdleTimeout() {
    this.navCtrl.setRoot(StartWithSurveyOption, {defaultOnly: true});
  }
}
