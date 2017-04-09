/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component, ViewChild} from "@angular/core";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {NavParams, ViewController, NavController, AlertController} from "ionic-angular";
import {FormGroup, FormBuilder, AbstractControl, FormControl} from "@angular/forms";
import {SurveyPage} from "../survey.page";
import {Idle} from "@ng-idle/core";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {AutoComplete} from "../../../shared/components/autocomplete/autocomplete";
import {ValidationService} from "../../../shared/components/validation/validation.service";

@Component({
  templateUrl: './customer.text.email.component.html',
  //providers: [Idle]
})

@RegisterComponent
export class CustomerTextEmailComponent extends SurveyPage {

  message: string;
  email: string;
  phone: string;
  myForm: FormGroup;

  // Email autocomplete
  filteredEmail: any[];
  @ViewChild('autoemail')
  autoemail: AutoComplete;

  get ready(): boolean {
    let form: FormGroup = this.myForm;
    let emailControl: AbstractControl = form.controls['email'];
    let phoneControl: AbstractControl = form.controls['phone'];
    return (emailControl.dirty ||
      phoneControl.dirty ||
      !Utils.nullOrEmptyString(emailControl.value) ||
      !Utils.nullOrEmptyString(phoneControl.value));
  }

  constructor(
    utils: Utils, navCtrl: NavController, alertCtrl: AlertController, sessionSvc: SessionService, idle: Idle, // For SurveyPage
    navParams: NavParams, private viewCtrl: ViewController, private formBuilder: FormBuilder) {

    super(navCtrl, alertCtrl, sessionSvc, idle);

    this.message = navParams.get('message') || 'Please provide your email and text.';
    this.phone = navParams.get('phone') || '';
    this.email = navParams.get('email') || '';
  }

  ngOnInit() {
    super.ngOnInit();
    this.myForm = new FormGroup({
      // http://emailregex.com/
      email: new FormControl('', ValidationService.EmailValidator),
      phone: new FormControl('', ValidationService.PhoneValidator),
    });
  }

  clearEmail() {
    this.email = "";
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

  dismiss() {
    let data = { 'email': this.autoemail.value, 'phone': this.phone };
    this.viewCtrl.dismiss(data);
  }

  onSelectEmail(value){
    this.email = value;
  }
}
