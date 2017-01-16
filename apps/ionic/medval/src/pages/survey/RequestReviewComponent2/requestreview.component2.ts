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

  get someDataProvided() {
    if (this.sessionSvc.hasCurrentSession()) {
      let reviewData = this.sessionSvc.getCurrentSession().properties.reviewData;
      return reviewData.email || reviewData.phone || this.reviewMsg;
    }
    return false;
  }

  browserScript: string = ""+
    "if (!window.location) {" +
      "window.alert('no window.location');" +
      "  window.console.log('no window.location');" +
      "  return;" +
    "};" +
    "window.console.log('Window href: ' + window.location.href);" +
    "window.alert('Window href: ' + window.location.href);" +
    "if (window.location.href && window.onhashchange) {" +
      "window.onhashchange = function(event) {" +
      "  let hash = new String(window.location.hash);" +
      "  window.console.log('hash: ' + hash);" +
      "  window.alert('hash: ' + hash);" +
      "  if (hash.indexOf('lrd') < 0) {" +
      "    window.console.log('Thank you for providing a review for Orthodontic Excellence!');" +
      "    window.alert('Thank you for providing a review for Orthodontic Excellence!');" +
      "    window.close();" +
      "  };" +
      "};" +
    "};";

  googleReview() {
    let abtest: boolean = Math.random() > 0.5;
    abtest = false; // TODO: Test more before uncommenting this.
    if (abtest) {
      //let url = 'https://www.google.com/search?q=gentle+dental+redmond&oq=gentle+dental+redmond&lrd=0x549072ac7b352b9d:0x4d08f342bcdf4b97,1,#lrd=0x549072ac7b352b9d:0x4d08f342bcdf4b97,3,';
      let url = 'https://www.google.com/search?q=orthodontic+excellence+coal+creek+parkeway&oq=orthodontic+excellence+coal+creek+parkeway&aqs=chrome..69i57.8959j0j1&sourceid=chrome&ie=UTF-8#lrd=0x5490691ef2188207:0xb56b7b88cd8157c3,3,';
      let options = 'location=no,toolbar=yes,hardwareback=no,clearcache=yes,clearsessioncache=yes,closebuttoncaption=Back';
      this.browser = new InAppBrowser(url, '_blank', options);
      this.setupScriptInjection();
      this.browser.on("loaderror").subscribe(
        (res) => {
          let options = 'location=no,toolbar=yes,hardwareback=no,closebuttoncaption=Back';
          this.browser = new InAppBrowser(url, '_blank', options);
          this.setupScriptInjection();
        },
        err => {
          Utils.error("InAppBrowser Error: " + err);
        });
      setTimeout(() => {
        this.browser.close();
      }, Config.REVIEW_TIME_MINUTES * 60 * 1000);
    } else {
      this.saveReview('google');
    }
  }
  private setupScriptInjection() {
    this.browser.on('loadstart').subscribe((event)=>{
      if (event.url.match("http://www.smilewithbraces.com")) {
        this.browser.close();
        return;
      }
    })
    this.browser.on('loadstop').subscribe(
        (event)=> {
          if (event.url.match("http://www.smilewithbraces.com")) {
            this.browser.close();
            return;
          }
          console.log('event: ' + event.type + ":" + event.url);
          //if (window.oldhash && (!window.location.hash || window.location.hash == '')) {window.close();}
          this.browser.executeScript({
            code  : '' +
            'window.console.log("INJECTED SCRIPT");' +
            //'window.alert("Injected Script" + window.location.href + ":" + window.location.hash);' +
            'window.setInterval(function(){' +
              'window.console.log("hashes:" + window.oldhash + ":new" + window.location.hash);' +
              'if (window.oldhash && (!window.location.hash || window.location.hash == "")) {' +
                'window.open("http://www.smilewithbraces.com", "_self");' +
              '};' +
              'window.oldhash = window.location.hash;' +
            '}, 50);'
          }).then((data) => {
            console.log(Utils.format('done script injection with data: {0}, stringified: {1}' + data, Utils.stringify(data)));
            setInterval(()=> {
              if (this.browser['needsClosing']) {
                this.browser.close()
              }
            }, 50);
          }).catch((err)=> {
            console.log(err);
          });
        }
    )
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

