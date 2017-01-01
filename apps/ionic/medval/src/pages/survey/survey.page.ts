import {Utils} from "../../shared/stuff/utils";
import {NavController} from "ionic-angular";
import {SurveyNavUtils} from "./SurveyNavUtils";
import {SessionService} from "../../services/session/delegator";
import {Idle, DEFAULT_INTERRUPTSOURCES} from "@ng-idle/core";
import {Subject} from "rxjs";
import {StartWithSurveyOption} from "./start/start.with.survey.option.component";
import {Config} from "../../shared/config";

export class SurveyPage {

  constructor(protected utils: Utils, protected navCtrl: NavController, protected sessionSvc: SessionService, idle?: Idle) {
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
  }

  public navigateToNext(...terminationMessage: string[]) {
    SurveyNavUtils.navigateOrTerminate(this.sessionSvc.surveyNavigator, this.navCtrl, this.utils, ...terminationMessage);
  }

  protected onIdleTimeout() {
    this.utils.setRoot(this.navCtrl, StartWithSurveyOption);
  }
}