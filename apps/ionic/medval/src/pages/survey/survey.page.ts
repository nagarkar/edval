import {Utils} from "../../shared/stuff/utils";
import {NavController, LoadingController} from "ionic-angular";
import {SurveyNavUtils} from "./SurveyNavUtils";
import {SessionService} from "../../services/session/delegator";
import {Idle, DEFAULT_INTERRUPTSOURCES} from "@ng-idle/core";
import {Subject} from "rxjs";
import {StartWithSurveyOption} from "./start/start.with.survey.option.component";
import {Config} from "../../shared/config";
import {Component} from "@angular/core";

export class SurveyPage {

  constructor(
    protected loadingCtrl: LoadingController,
    protected navCtrl: NavController,
    protected sessionSvc: SessionService,
    protected idle?: Idle) {
  }

  ngOnInit() {
    if (this.sessionSvc.hasCurrentSession()){
      this.sessionSvc.recordNavigatedLocationInCurrentSession(Utils.getObjectName(this));
    } else {
      Utils.error("Did not find current session in SurveyPage:" + this.constructor.name);
    }

    let idle = this.idle;
    if (!idle) {
      return;
    }
    idle.setIdle(Config.SURVEY_PAGE_IDLE_SECONDS);
    idle.setTimeout(Config.SURVEY_PAGE_TIMEOUT_SECONDS);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    let subscription: Subject<number> = idle.onTimeout.subscribe(() => {
      this.stopIdling(subscription);
      this.goToStartPage();
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
    SurveyNavUtils.navigateOrTerminate(this.sessionSvc.surveyNavigator, this.loadingCtrl, this.navCtrl, ...terminationMessage);
  }

  protected goToStartPage() {
    this.navCtrl.setRoot(StartWithSurveyOption, {defaultOnly: true});
  }

  private stopIdling(subscription?: Subject<number>) {
    this.idle.stop();
    if (subscription) {
      subscription.unsubscribe();
    }
  }
}
