/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
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

  static inNavigation:boolean = false;

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

  static GOING_TO_ROOT_TEST: boolean = false;
  ngOnInit() {

    let idle = this.idle;
    if (!idle) {
      return;
    }
    this.stopIdling();
    idle.setIdle(Config.SURVEY_PAGE_IDLE_SECONDS);
    idle.setTimeout(Config.SURVEY_PAGE_TIMEOUT_SECONDS);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    let subscription: Subject<number> = idle.onTimeout.subscribe(() => {
      try {
        this.stopIdling(subscription);
      } catch(err) {
        return;
      }
      if (SurveyPage.GOING_TO_ROOT_TEST == true) {
        return;
      }
      SurveyPage.GOING_TO_ROOT_TEST = true;
      Utils.setRoot(this.navCtrl, StartWithSurveyOption, {defaultOnly: true}).then(()=>{
        SurveyPage.GOING_TO_ROOT_TEST = false;
      }).catch((err)=> {SurveyPage.GOING_TO_ROOT_TEST = false; Utils.error(err)});
    })
    idle.watch();

  }

  /*
  ngOnDestroy() {
    this.stopIdling();
  }
  */

  public navigateToNext(...terminationMessage: string[]) {
    if (SurveyPage.inNavigation === true) {
      return;
    }
    SurveyPage.inNavigation = true;
    let navState = this.sessionSvc.surveyNavigator.navState;
    try {
      SurveyNavUtils.navigateOrTerminate(this.sessionSvc.surveyNavigator, this.loadingCtrl, this.navCtrl, ...terminationMessage)
        .then(()=>{
          SurveyPage.inNavigation = false;
        })
        .catch((err)=>{
          SurveyPage.inNavigation = false;
          this.sessionSvc.surveyNavigator.navState = navState;
        });
    } finally {

    }
  }

  cancelAndRestart() {
    if (this.sessionSvc.hasCurrentSession()) {
      Utils.setRoot(this.navCtrl, StartWithSurveyOption, {defaultOnly: true, cancelPreviousSession: true});
      return;
    }
    let navigator: SurveyNavigator = this.sessionSvc.surveyNavigator;
    let surveyId = navigator.survey.id;
    this.sessionSvc.newCurrentSession(surveyId);
    navigator = this.sessionSvc.surveyNavigator; // Refresh the navigator.
    SurveyNavUtils.navigateOrTerminate(navigator, this.loadingCtrl, this.navCtrl);
  }

  private stopIdling(subscription?: Subject<number>) {
    if (!this.idle) {
      return;
    }
    this.idle.stop();
    this.idle.clearInterrupts();
    if (subscription) {
      subscription.unsubscribe();
    }
  }
}
