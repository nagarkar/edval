/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Utils} from "../../shared/stuff/utils";
import {NavController, Alert, AlertController} from "ionic-angular";
import {SurveyNavUtils} from "./SurveyNavUtils";
import {SessionService} from "../../services/session/delegator";
import {Idle, DEFAULT_INTERRUPTSOURCES} from "@ng-idle/core";
import {Subject} from "rxjs";
import {StartWithSurveyOption} from "./start/start.with.survey.option.component";
import {Config} from "../../shared/config";
import {SurveyNavigator} from "../../services/survey/survey.navigator";
import {SpinnerDialog} from "ionic-native";
import {LoginComponent} from "../login/login.component";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {AnyComponent} from "../any.component";
import {Account} from "../../services/account/schema";

export class SurveyPage  extends AnyComponent {

  account: Account;
  progress: number = 0;

  idleSeconds(): number {
    return undefined;
  }

  timeoutSeconds(): number {
    return undefined;
  }

  static inNavigation:boolean = false;

  constructor(
    protected navCtrl: NavController,
    protected alertCtrl: AlertController,
    protected sessionSvc: SessionService,
    protected idle?: Idle) {

    super();
    try {
      this.account = Config.CUSTOMER;
      setTimeout(()=>{
        SpinnerDialog.hide();
      }, Config.SURVEY_PAGE_IDLE_SECONDS/4);

      if (sessionSvc.hasCurrentSession()) {
        sessionSvc.recordNavigatedLocationInCurrentSession(Utils.getObjectName(this));
        this.progress = sessionSvc.surveyNavigator.getProgressFraction();
      } else {
        Utils.error("Did not find current session in SurveyPage:" + this.constructor.name);
      }
    } catch(err) {
      this.handleErrorAndCancel(err);
    }

  }

  static GOING_TO_ROOT_TEST: boolean = false;

  ngOnInit() {
    try {

      if (!AccessTokenService.authResult) {
        this.navCtrl.setRoot(LoginComponent);
      }

      let idle = this.idle;
      if (!idle) {
        return;
      }
      this.stopIdling();
      idle.setIdle(this.idleSeconds() || Config.SURVEY_PAGE_IDLE_SECONDS);
      idle.setTimeout(this.timeoutSeconds() || Config.SURVEY_PAGE_TIMEOUT_SECONDS);
      idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

      let subscription: Subject<number> = idle.onTimeout.subscribe(() => {
        try {
          this.stopIdling(subscription);
        } catch (err) {
          return;
        }
        if (SurveyPage.GOING_TO_ROOT_TEST == true) {
          return;
        }
        SurveyPage.GOING_TO_ROOT_TEST = true;
        Utils.setRoot(this.navCtrl, StartWithSurveyOption, {defaultOnly: true}).then(()=> {
          SurveyPage.GOING_TO_ROOT_TEST = false;
        }).catch((err)=> {
          SurveyPage.GOING_TO_ROOT_TEST = false;
          Utils.error(err)
        });
      })
      idle.watch();
    } catch(err) {
      this.handleErrorAndCancel(err);
    }
  }

  public navigateToNext(dontAnimate?: boolean, forceNavigate?: boolean, ...terminationMessage: string[]) {
    if (!forceNavigate && SurveyPage.inNavigation === true) {
      return;
    }
    SurveyPage.inNavigation = true;
    let navState = this.sessionSvc.surveyNavigator.navState;
    try {
      SurveyNavUtils.navigateOrTerminate(this.sessionSvc.surveyNavigator, this.navCtrl, dontAnimate, ...terminationMessage)
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
    let warningMessage = "This will take you back to the beginning.";

    Utils.presentProceedCancelPrompt(this.alertCtrl, ()=> {
      let sessionSvc = this.sessionSvc;
      if (sessionSvc.hasCurrentSession()) {
        Utils.setRoot(this.navCtrl, StartWithSurveyOption, {defaultOnly: sessionSvc.scratchPad['defaultOnly'], cancelPreviousSession: true});
        return;
      }

      let navigator: SurveyNavigator = sessionSvc.surveyNavigator;
      let surveyId = navigator.survey.id;
      this.createNewSessionAndNavigateToFirstPage(surveyId);
    }, warningMessage)
  }

  handleErrorAndCancel(err: any) {
    let errMsg = Utils.format("Unexpected error: {0}, with stack trace {1}", err, err.stack || new Error().stack);
    Utils.error(errMsg);
    alert(errMsg);
    setTimeout(()=>{
      this.cancelAndRestart();
    }, 50)
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


  private createNewSessionAndNavigateToFirstPage(surveyId: string) {
    this.sessionSvc.newCurrentSession(surveyId);
    SurveyNavUtils.navigateOrTerminate(this.sessionSvc.surveyNavigator, this.navCtrl);
  }
}
