import {Component} from "@angular/core";
import {NavController, Modal, ModalController, LoadingController} from "ionic-angular";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {CustomerTextEmailComponent} from "./customer.text.email.component";
import {SessionProperties} from "../../../services/session/schema";
import {InAppBrowser} from "ionic-native";
import {Idle} from "@ng-idle/core";
import {SurveyPage} from "../survey.page";
import {Config} from "../../../shared/config";

@Component({
  templateUrl: './requestreview.component2.html',
  providers: [Idle]
})

@RegisterComponent
export class RequestReviewComponent2 extends SurveyPage {

  public reviewMsg: string;
  private browser : InAppBrowser = null;

  constructor(
    idle: Idle,
    utils: Utils,
    navCtrl: NavController,
    sessionSvc: SessionService,
    private modalCtrl: ModalController,
    loadingCtrl: LoadingController,
  ) {

    super(loadingCtrl, navCtrl, sessionSvc, idle);
  }

  navigateToNext() {
    this.sessionSvc.getCurrentSession().properties.reviewData.message = this.reviewMsg;
    super.navigateToNext();
  }

  get someDataProvided(): boolean {
    if (this.sessionSvc.hasCurrentSession()) {
      let reviewData = this.sessionSvc.getCurrentSession().properties.reviewData;
      let gtg = Utils.nullOrEmptyString;
      return !gtg(reviewData.email) || !gtg(reviewData.phone) || !gtg(this.reviewMsg);
    }
    return false;
  }

  googleReview() {
    this.saveReview('google');
  }

  facebookReview() {
    this.saveReview('facebook');
  }

  yelpReview() {
    this.saveReview('yelp');
  }

  private saveReview(reviewSite: string) {
    let message = 'Email or text me easy-to-use instructions for providing a review!';
    let reviewData = this.sessionSvc.getCurrentSession().properties.reviewData;
    if (reviewData.email || reviewData.phone) {
      message = "We already have your contact information. You can change your information below";
    }
    let profileModal : Modal = this.modalCtrl.create(CustomerTextEmailComponent, {
      message: message,
      email: reviewData.email,
      phone: reviewData.phone
    });
    profileModal.onDidDismiss((data) =>{
      if (data) {
        this.updateSessionReviewData(data.email, data.phone, reviewSite);
      }
    });
    profileModal.present(); //profileModal.
  }

  private updateSessionReviewData(email: string, phone: string, preferredReviewSite: string) {
    let props: SessionProperties = this.sessionSvc.getCurrentSession().properties;
    props.reviewData.email = email;
    props.reviewData.phone = phone;
    if (!props.reviewData.preferredReviewSite) {
      props.reviewData.preferredReviewSite = [];
    }
    props.reviewData.preferredReviewSite.push(preferredReviewSite);
  }
}

