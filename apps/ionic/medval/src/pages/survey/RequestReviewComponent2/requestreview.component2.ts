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
  templateUrl: 'requestreview.component2.html',
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

  public navigateToNext() {
    this.sessionSvc.getCurrentSession().properties.reviewData.message = this.reviewMsg;
    super.navigateToNext();
  }

  googleReview() {
    let abtest: boolean = Math.random() > 0.5;
    if (abtest) {
      //let url = 'https://www.google.com/search?q=gentle+dental+redmond&oq=gentle+dental+redmond&lrd=0x549072ac7b352b9d:0x4d08f342bcdf4b97,1,#lrd=0x549072ac7b352b9d:0x4d08f342bcdf4b97,3,';
      let url = 'https://www.google.com/search?q=orthodontic+excellence+coal+creek+parkeway&oq=orthodontic+excellence+coal+creek+parkeway&aqs=chrome..69i57.8959j0j1&sourceid=chrome&ie=UTF-8#lrd=0x5490691ef2188207:0xb56b7b88cd8157c3,3,';
      let options = 'location=no,toolbar=yes,hardwareback=no,clearcache=yes,clearsessioncache=yes,closebuttoncaption=Back';
      this.browser = new InAppBrowser(url, '_blank', options);

      this.browser.on("loaderror")
        .subscribe(
          (res) => {
            let options = 'location=no,toolbar=yes,hardwareback=no,closebuttoncaption=Back';
            this.browser = new InAppBrowser(url, '_system', options);
          },
          err => {
            Utils.error("InAppBrowser Error: " + err);
          });
        setTimeout(() => {
          let fn: string = `
            if (!window) {
              alert('no window');
              return;
            }
            if (!window.location) {
              alert('no window.location');
              return;
            }
            alert('Window href: ' + window.location.href);
            if (window.location.href) {
              window.onhashchange = () => {
                let hash = new String(window.location.hash);
                alert('hash: ' + hash);
                if (hash.indexOf('lrd') < 0) {
                  alert('Thank you for providing a review for Orthodontic Excellence!');
                  window.close();
                }
              }
            }
          `;
        this.browser.executeScript({
          code: fn
        }).then((data) => {
          alert(Utils.format('done script injection with data: {0}, stringified: {1}' + data, Utils.stringify(data)));
        }).catch((err)=> {
          alert(err);
        });
        this.browser.close();
      }, Config.REVIEW_TIME_MINUTES * 60 * 1000);
    } else {
      this.saveReview('google');
    }
  }

  facebookReview() {
    this.saveReview('google');
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

