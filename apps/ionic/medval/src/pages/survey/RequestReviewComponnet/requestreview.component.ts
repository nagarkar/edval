import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {SurveyNavUtils} from "../SurveyNavUtils";
import {InAppBrowser} from "ionic-native";

@Component({
  templateUrl: 'requestreview.component.html',
})

@RegisterComponent
export class RequestReviewComponent {

  static GOOGLE_REVIEW_URL: string = `https://www.google.com/search?q=orthodontic%20excellence%20%20%20%20%20%20&%3A-1%2Clf_msr%3A-1%2Clf%3A1%2Clf_ui%3A2%2Clf_pqs%3AEAE%20%20%20%20%20%20&rflfq=1%20%20%20%20%20%20&rlha=0%20%20%20%20%20%20&rllag=47364907%2C-122235939%2C23993%20%20%20%20%20%20&tbm=lcl%20%20%20%20%20%20&rldimm=13072678170866571203%20%20%20%20%20%20&lrd=0x5490691ef2188207%3A0xb56b7b88cd8157c3%2C1%2C%20%20%20%20%20%20&rct=j#lrd=0x5490691ef2188207:0xb56b7b88cd8157c3,3,&rlfi=hd:;si:13072678170866571203;mv:!1m3!1d30071.983337186946!2d-122.15809474999999!3d47.54806575!2m3!1f0!2f0!3f0!3m2!1i62!2i268!4f13.1`;
  static FACEBOOK_REVIEW_URL: string = `https://www.facebook.com/pg/NewcastleOE/reviews/?ref=page_internal#u_0_r`;
  static BROWSER_OPTIONS: string =     'location=no,toolbar=yes,hardwareback=no,clearcache=yes,clearsessioncache=yes,closebuttoncaption=Back';

  private browser : InAppBrowser = null;

  public reviewMsg: string;

  constructor(
    private sessionSvc: SessionService,
    private navCtrl: NavController,
    private utils: Utils
  ) {
  }

  public navigateToNext() {
    SurveyNavUtils.navigateOrTerminate(this.sessionSvc.surveyNavigator, this.navCtrl, this.utils);
  }

  googleReview() {
    this.onReviewFor(RequestReviewComponent.GOOGLE_REVIEW_URL);
  }

  facebookReview() {
    this.onReviewFor(RequestReviewComponent.FACEBOOK_REVIEW_URL);
  }

  private onReviewFor(url: string) {
    this.browser = new InAppBrowser(url, '_blank', RequestReviewComponent.BROWSER_OPTIONS);
    this.createBrowserAfterReasonableTime();
  }

  private createBrowserAfterReasonableTime(): void {
    setTimeout(() => {
      this.browser.close();
      this.browser = null;
    }, 1000 * 60 * 5);
  }
}

