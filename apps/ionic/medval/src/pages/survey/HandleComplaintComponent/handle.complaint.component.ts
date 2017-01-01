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
import {SReplacer} from "../../../pipes/sreplacer";
import {FormGroup, FormControl, Validators} from "@angular/forms";

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

  complaintForm: FormGroup;

  title: string;
  image: string = this.images[0];
  account: Account = new Account();

  // Patient f/b
  email: string;
  phone: string;
  complaintMsg: string;

  get informationProvided() {
    let email = this.complaintForm.controls['email'];
    let phone = this.complaintForm.controls['phone'];
    let complaintMsg = this.complaintForm.controls['complaintMsg'];
    return (email.dirty && email.valid && email.value)
      || (phone.dirty && phone.valid && phone.value)
      || (complaintMsg.dirty && complaintMsg.valid && complaintMsg.value);

  }

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

  ngOnInit() {
    this.complaintForm = new FormGroup({
      email: new FormControl('', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
      phone: new FormControl('', Validators.pattern(/^(\([0-9]{3}\)\s)?[0-9]{3}\-[0-9]{4}/)),
      complaintMsg: new FormControl('', Validators.minLength(5))
    });
  }

  public navigateToNext() {
    //TODO Save email, phone and text to session.

    super.navigateToNext(
      "account.properties.accountName + ' wants to do better'",
      "Your feedback is invaluable");
  }
}
