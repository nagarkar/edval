import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {AccountService} from "../../../services/account/delegator";
import {Config} from "../../../shared/config";
import {Account} from "../../../services/account/schema";
import {Idle} from "@ng-idle/core";
import {SurveyPage} from "../survey.page";
import {SReplacer} from "../../../pipes/SReplacer";
import {StaffService} from "../../../services/staff/delegator";

@Component({
  templateUrl: 'handle.complaint.component.html',
})

@RegisterComponent
export class HandleComplaintComponent extends SurveyPage {

  private images: string[] = [
    "http://www.nicephotomag.com/wp-content/uploads/2009/06/uniracer_2009_0409_1435_20_149.jpg",
    "https://s-media-cache-ak0.pinimg.com/236x/eb/ac/c2/ebacc2789ff96ca7aafe6c855b6a8e1a.jpg",
    "http://i.dailymail.co.uk/i/pix/2011/04/14/article-1376796-0B9F664100000578-491_634x467.jpg",
    "http://cdn.alex.leonard.ie/wp-content/uploads/2013/02/extreme-mountain-unicycling.jpg"
  ];
  complaintDetails: string;
  title: string;
  image: string = this.images[0];
  account: Account = new Account();

  constructor(
    idle: Idle,
    utils: Utils,
    navCtrl: NavController,
    navParams: NavParams,
    sessionSvc: SessionService,
    tokenProvider: AccessTokenService,
    accountSvc: AccountService
  ) {
    super(utils, navCtrl, sessionSvc, idle);

    this.account =  accountSvc.getCached(Config.CUSTOMERID);
    let sReplacer = new SReplacer(accountSvc);
    if (navParams.get('title')) {
      let title = (sReplacer.transform(navParams['title']));
      this.title = title;
    } else {
      this.title = 'Did something go wrong?';
    }
  }

  public navigateToNext() {
    super.navigateToNext(
      "'The folks at '+ account.properties.customerName + ' want to do better'",
      "Your feedback, although nameless, is invaluable");
  }
}
