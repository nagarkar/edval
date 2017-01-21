import {Utils} from "../../shared/stuff/utils";
import {NavController, LoadingController} from "ionic-angular";
import {SurveyNavUtils} from "./SurveyNavUtils";
import {SessionService} from "../../services/session/delegator";
import {Idle, DEFAULT_INTERRUPTSOURCES} from "@ng-idle/core";
import {Subject} from "rxjs";
import {StartWithSurveyOption} from "./start/start.with.survey.option.component";
import {Config} from "../../shared/config";
import {SurveyNavigator} from "../../services/survey/survey.navigator";

export class SurveyPage {

  progress: number = 0;

  inNavigation:boolean = false;

  constructor(
    protected loadingCtrl: LoadingController,
    protected navCtrl: NavController,
    protected sessionSvc: SessionService,
    protected idle?: Idle) {

    if (sessionSvc.hasCurrentSession()){
      sessionSvc.recordNavigatedLocationInCurrentSession(Utils.getObjectName(this));
      this.progress = sessionSvc.surveyNavigator.getProgressFraction();
    } else {
      Utils.error("Did not find current session in SurveyPage:" + this.constructor.name);
    }
  }

  ngOnInit() {
    let idle = this.idle;
    if (!idle) {
      return;
    }
    idle.setIdle(Config.SURVEY_PAGE_IDLE_SECONDS);
    idle.setTimeout(Config.SURVEY_PAGE_TIMEOUT_SECONDS);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    let subscription: Subject<number> = idle.onTimeout.subscribe(() => {
      this.stopIdling(subscription);
      this.navCtrl.setRoot(StartWithSurveyOption, {defaultOnly: true});
    })
    idle.watch();
  }

  ngOnDestroy() {
    if (!this.idle) {
      return;
    }
    this.stopIdling();
  }

  public navigateToNext(...terminationMessage: string[]) {
    if (this.inNavigation === true) {
      return;
    }
    this.inNavigation = true;
    try {
      SurveyNavUtils.navigateOrTerminate(this.sessionSvc.surveyNavigator, this.loadingCtrl, this.navCtrl, ...terminationMessage);
    } finally {
      this.inNavigation = false;
    }
  }

  cancelAndRestart() {
    if (!this.sessionSvc.hasCurrentSession()) {
      this.navCtrl.setRoot(StartWithSurveyOption, {defaultOnly: true, cancelPreviousSession: true});
      return;
    }
    let navigator: SurveyNavigator = this.sessionSvc.surveyNavigator;
    let surveyId = navigator.survey.id;
    this.sessionSvc.newCurrentSession(surveyId);
    navigator = this.sessionSvc.surveyNavigator; // Refresh the navigator.
    SurveyNavUtils.navigateOrTerminate(navigator, this.loadingCtrl, this.navCtrl);
  }

  private stopIdling(subscription?: Subject<number>) {
    this.idle.stop();
    if (subscription) {
      subscription.unsubscribe();
    }
  }
}
