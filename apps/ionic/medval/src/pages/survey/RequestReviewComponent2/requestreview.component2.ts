/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {Component} from "@angular/core";
import {NavController, Modal, ModalController, AlertController} from "ionic-angular";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {CustomerTextEmailComponent} from "./customer.text.email.component";
import {SessionProperties} from "../../../services/session/schema";
import {Idle} from "@ng-idle/core";
import {SurveyPage} from "../survey.page";
import {AccountService} from "../../../services/account/delegator";
import {Config} from "../../../shared/config";
import {Account} from "../../../services/account/schema";
import {ValidationService} from "../../../shared/components/validation/validation.service";

@Component({
  templateUrl: './requestreview.component2.html',
  //providers: [Idle]
})

@RegisterComponent
export class RequestReviewComponent2 extends SurveyPage {

  reviewMsg: string;
  showGoogle: boolean;
  showFacebook: boolean;
  showYelp: boolean;
  title: string;

  constructor(idle: Idle,
              utils: Utils,
              navCtrl: NavController,
              alertCtrl: AlertController,
              sessionSvc: SessionService,
              private accountSvc: AccountService,
              private modalCtrl: ModalController) {

    super(navCtrl, alertCtrl, sessionSvc, idle);
    try {
      let account: Account = this.accountSvc.getCached(Config.CUSTOMERID);
      if (account && account.properties) {
        this.showFacebook = ValidationService.urlValidator.test(account.properties.configuration.REVIEW_URL_FACEBOOK);
        this.showGoogle = ValidationService.urlValidator.test(account.properties.configuration.REVIEW_URL_GOOGLE);
        this.showYelp = ValidationService.urlValidator.test(account.properties.configuration.REVIEW_URL_YELP);
      }
      this.title = this.createTitle(account);
    } catch (err) {
      Utils.error(err);
    }
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
    let message = 'Send me a link to provide a review, and include any feedback I provided today to help me get started!';
    let reviewData = this.sessionSvc.getCurrentSession().properties.reviewData;
    if (reviewData.email || reviewData.phone) {
      message = "We already have your contact information. You can change your information below";
    }
    let profileModal: Modal = this.modalCtrl.create(CustomerTextEmailComponent, {
      message: message,
      email: reviewData.email,
      phone: reviewData.phone
    });
    profileModal.onDidDismiss((data) => {
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

  private createTitle(account: Account): string {
    if (account && account.properties && account.properties.contactName) {
      return "Sounds like " + account.properties.contactName + "  & team are doing ok!";
    } else {
      return "Sounds like we are doing ok!";
    }
  }
}

