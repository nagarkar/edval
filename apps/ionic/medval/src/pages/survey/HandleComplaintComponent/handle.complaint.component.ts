/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component, ViewChild} from "@angular/core";
import {NavController, NavParams, AlertController} from "ionic-angular";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {AccountService} from "../../../services/account/delegator";
import {Config} from "../../../shared/config";
import {Account} from "../../../services/account/schema";
import {Idle} from "@ng-idle/core";
import {SurveyPage} from "../survey.page";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {EmailProviderService} from "../../../shared/service/email.provider.service";
import {AutoComplete} from "../../../shared/components/autocomplete/autocomplete";
import {ValidationService} from "../../../shared/components/validation/validation.service";

@Component({
  templateUrl: './handle.complaint.component.html',
  //providers: [Idle]
})

@RegisterComponent
export class HandleComplaintComponent extends SurveyPage {

  private images: string[] = [
    "http://www.nicephotomag.com/wp-content/uploads/2009/06/uniracer_2009_0409_1435_20_149.jpg",
    "https://s-media-cache-ak0.pinimg.com/236x/eb/ac/c2/ebacc2789ff96ca7aafe6c855b6a8e1a.jpg",
    "http://i.dailymail.co.uk/i/pix/2011/04/14/article-1376796-0B9F664100000578-491_634x467.jpg",
    "http://cdn.alex.leonard.ie/wp-content/uploads/2013/02/extreme-mountain-unicycling.jpg"
  ];

  showTitle: boolean = false;

  complaintForm: FormGroup;

  title: string = "We're sorry you didn't have a great experience...";
  image: string = this.images[0];
  account: Account = new Account();

  requestForFeedback: string;

  // Patient f/b
  email: string;
  phone: string;
  complaintMsg: string;

  // Email autocomplete
  filteredEmail: any[];
  @ViewChild('autoemail')
  autoComplete: AutoComplete

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
    alertCtrl: AlertController,
    navParams: NavParams,
    sessionSvc: SessionService,
    tokenProvider: AccessTokenService,
    accountSvc: AccountService,
    private emailProviderService: EmailProviderService
  ) {
    super(navCtrl, alertCtrl, sessionSvc, idle);

    try {
      this.account = accountSvc.getCached(Config.CUSTOMERID);
      this.title = navParams.get('title') || this.title;
      this.requestForFeedback = this.createRequestForFeedbackString();
    } catch(err) {
      super.handleErrorAndCancel(err);
    }

  }

  ngOnInit() {
    try {
      super.ngOnInit();
      this.complaintForm = new FormGroup({
        email: new FormControl('', ValidationService.EmailValidator),
        phone: new FormControl('', ValidationService.PhoneValidator),
        complaintMsg: new FormControl('', Validators.minLength(5))
      });
    } catch (err) {
      super.handleErrorAndCancel(err);
    }
  }

  navigateToNext() {
    if (this.sessionSvc.hasCurrentSession()) {
      this.sessionSvc.getCurrentSession().properties.complaintData = {
        email: this.autoComplete.value, phone: this.phone, message: this.complaintMsg
      }
    }
    super.navigateToNext(false /* dontAnimate */, false, /* Force Navigate */
      "account.properties.customerName ? (account.properties.customerName + ' wants to do better') : 'The team will try to do a better job next time!'", "Your feedback is invaluable");
  }


  getEmail(event) {
    let query = event.query;
    this.filteredEmail = this.filterEmail(query, [
      { "name" : "@gmail.com" },
      { "name" : "@outlook.com" },
      { "name" : "@mail.com" },
      { "name" : "@yahoo.com" },
      { "name" : "@inbox.com" },
      { "name" : "@icloud.com" }]);
  }

  filterEmail(query, emails: any[]):any[] {
    let filterData : any[] = [];
    filterData = emails;
    let arr = query.split("@");
    let data;
    if(query.indexOf("@") > 0){
      data = filterData.filter(ep => ep.name.toLowerCase().includes(("@" + arr[1]).toLowerCase()));
      let len = data.length;
      for(let i=0;i<len;i++){
        data[i].name = arr[0]+data[i].name;
      }
      filterData = [];
      return data;
    }
    else{
      return data=[];
    }
  }

  onSelectEmail(value){
    this.email = value;
  }

  private createRequestForFeedbackString() {
    let account = this.account;
    if (account && account.properties && account.properties.customerName) {
      return 'The team at ' + account.properties.customerName + ' would appreciate any other feedback you can provide...';
    } else {
      return 'The team here would appreciate any other feedback you can provide...';
    }
  }
}
