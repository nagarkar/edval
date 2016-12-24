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

  static GOOGLE_REVIEW_URL: string = `https://www.google.com/search?q=orthodontic+excellence+newcastle&oq=orthodontic+excellence+newcastle&lrd=0x5490691ef2188207:0xb56b7b88cd8157c3,1,#lrd=0x5490691ef2188207:0xb56b7b88cd8157c3,1,`;
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

