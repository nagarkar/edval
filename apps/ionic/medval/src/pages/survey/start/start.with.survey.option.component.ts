/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component, Input} from "@angular/core";
import {NavController, NavParams, ToastController} from "ionic-angular";
import {LoginComponent} from "../../login/login.component";
import {Utils} from "../../../shared/stuff/utils";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {SessionService} from "../../../services/session/delegator";
import {Account} from "../../../services/account/schema";
import {SurveyService} from "../../../services/survey/delegator";
import {ThanksComponent} from "../thanks/thanks.component";
import {ObjectCycler} from "../../../shared/stuff/object.cycler";
import {SurveyNavUtils} from "../SurveyNavUtils";
import {Survey} from "../../../services/survey/schema";

@Component({
  templateUrl: './start.with.survey.option.component.html'
})

export class StartWithSurveyOption {

  private images = [
    'https://s3.amazonaws.com/revvolveapp/quotes/quote1.jpg',
    'https://s3.amazonaws.com/revvolveapp/quotes/quote2.jpg',
    'https://s3.amazonaws.com/revvolveapp/quotes/quote3.jpg',
    'https://s3.amazonaws.com/revvolveapp/quotes/quote1.jpg',
    'https://s3.amazonaws.com/revvolveapp/quotes/quote4.jpg',
    'https://s3.amazonaws.com/revvolveapp/quotes/quote1.jpg',
    'https://s3.amazonaws.com/revvolveapp/quotes/quote5.jpg',
    'https://s3.amazonaws.com/revvolveapp/quotes/quote2.jpg',
  ];

  leftImage: string = this.images[0];
  account: Account = new Account();

  surveys : Survey[] = [];

  cancelPreviousSession: boolean;

  @Input()
  defaultOnly: boolean = false; // must default to false in order for logic in constructor to work

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    utils: Utils,
    private tokenProvider: AccessTokenService,
    private surveySvc: SurveyService,
    private sessionSvc: SessionService,
    navParams: NavParams
  ) {

    this.defaultOnly = navParams.get("defaultOnly") === true || this.defaultOnly;
    this.cancelPreviousSession = navParams.get("cancelPreviousSession") || this.cancelPreviousSession;
  }

  ngOnInit() {
    new ObjectCycler<string>(null, ...this.images)
      .onNewObj.subscribe((next:string)=>this.leftImage = next);
    this.surveySvc.list().then((surveys: Survey[]) => {
      this.surveys = surveys;
      this.surveys.filter((survey: Survey)=> {
        return survey.id == 'default';
      })
    });
    setTimeout(()=>{
      if (this.navCtrl.getActive().component == StartWithSurveyOption) {
        Utils.log("Refreshing Start Page");
        Utils.setRoot(this.navCtrl, StartWithSurveyOption, {defaultOnly: this.defaultOnly});
      }
    }, 5 * 60 * 1000)
  }

  gotoLogin() {
    Utils.setRoot(this.navCtrl, LoginComponent);
  }

  noThanks() {
    Utils.setRoot(this.navCtrl, ThanksComponent, {message: ["That's ok, maybe next time!"]});
  }

  pickSurvey(id: string){
    if (this.sessionSvc.hasCurrentSession() && !this.cancelPreviousSession) {
      try {
        this.sessionSvc.closeCurrentSession();
      } catch(err) {
        Utils.presentTopToast(this.toastCtrl, err || err.message);
      }
    }
    this.sessionSvc.newCurrentSession(id);
    this.sessionSvc.scratchPad['defaultOnly'] = this.defaultOnly;
    SurveyNavUtils.navigateOrTerminate(this.sessionSvc.surveyNavigator, this.navCtrl);
  }
}
