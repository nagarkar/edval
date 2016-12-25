import {Component} from "@angular/core";
import {NavController, Modal, ModalController} from "ionic-angular";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {SurveyNavUtils} from "../SurveyNavUtils";
import {CustomerTextEmailComponent} from "./customer.text.email.component";
import {SessionProperties} from "../../../services/session/schema";

@Component({
  templateUrl: 'requestreview.component2.html',
})

@RegisterComponent
export class RequestReviewComponent2 {

  public reviewMsg: string;

  constructor(
    private sessionSvc: SessionService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private utils: Utils
  ) {
  }

  public navigateToNext() {
    // TODO Process the reviewMsg
    SurveyNavUtils.navigateOrTerminate(this.sessionSvc.surveyNavigator, this.navCtrl, this.utils);
  }

  googleReview() {
    this.saveReview('google');
  }

  facebookReview() {
    this.saveReview('google');
  }

  saveReview(reviewSite: string) {
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
      this.updateSessionReviewData(data.email, data.phone, reviewSite);
    });
    profileModal.present(); //profileModal.
    /*
    this.utils.presentProfileModal(CustomerTextEmailComponent, {
      message: message,
    }).onDidDismiss((data) =>{
      this.updateSessionReviewData(data.email, data.phone, reviewSite);
    });
    */
  }

  private updateSessionReviewData(email: string, phone: string, preferredReviewSite: string) {
    let props: SessionProperties = this.sessionSvc.getCurrentSession().properties;
    props.reviewData.email = email;
    props.reviewData.email = email;
    if (!props.reviewData.preferredReviewSite) {
      props.reviewData.preferredReviewSite = [];
    }
    props.reviewData.preferredReviewSite.push(preferredReviewSite);
  }
}

