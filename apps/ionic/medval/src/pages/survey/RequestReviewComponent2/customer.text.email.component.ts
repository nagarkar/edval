import {Component} from "@angular/core";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {NavParams, ViewController, NavController} from "ionic-angular";
import {FormGroup, FormBuilder, Validators, AbstractControl, FormControl} from "@angular/forms";
import {SurveyPage} from "../survey.page";
import {Idle} from "@ng-idle/core";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";

@Component({
  templateUrl: 'customer.text.email.component.html',
})

@RegisterComponent
export class CustomerTextEmailComponent extends SurveyPage {

  message: string;
  email: string;
  phone: string;
  myForm: FormGroup = new FormGroup({
    // http://emailregex.com/
    email: new FormControl('', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
    //email: new FormControl('',Validators.pattern('^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$')),
    phone: new FormControl('', Validators.pattern("^\([0-9]{3})([0-9]{3})([0-9]{4})$")),
  });

  get ready(): boolean {
    let form: FormGroup = this.myForm;
    let emailControl: AbstractControl = form.controls['email'];
    let phoneControl: AbstractControl = form.controls['phone'];
    return (emailControl.dirty || phoneControl.dirty);
  }

  constructor(
    utils: Utils, navCtrl: NavController, sessionSvc: SessionService, idle: Idle, // For SurveyPage
    navParams: NavParams, private viewCtrl: ViewController, private formBuilder: FormBuilder) {

    super(utils, navCtrl, sessionSvc, idle);

    this.message = navParams.get('message') || 'Please provide your email and text.';
    this.phone = navParams.get('phone') || '';
    this.email = navParams.get('email') || '';
  }

  clearEmail() {
    this.email = "";
  }

  dismiss() {
    let data = { 'email': this.email, 'phone': this.phone };
    this.viewCtrl.dismiss(data);
  }
}
