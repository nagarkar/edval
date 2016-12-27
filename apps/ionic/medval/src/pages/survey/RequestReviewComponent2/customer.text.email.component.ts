import {Component} from "@angular/core";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {NavParams, ViewController} from "ionic-angular";
import {FormGroup, FormBuilder, Validators, AbstractControl, FormControl} from "@angular/forms";

@Component({
  templateUrl: 'customer.text.email.component.html',
})

@RegisterComponent
export class CustomerTextEmailComponent {

  message: string;
  email: string;
  phone: string;
  myForm: FormGroup = new FormGroup({
    // http://emailregex.com/
    email: new FormControl('',Validators.pattern('^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$')),
    phone: new FormControl('', Validators.pattern("^\([0-9]{3})([0-9]{3})([0-9]{4})$")),
  });

  get ready(): boolean {
    let form: FormGroup = this.myForm;
    let emailControl: AbstractControl = form.controls['email'];
    let phoneControl: AbstractControl = form.controls['phone'];
    return (emailControl.dirty || phoneControl.dirty);
  }

  constructor(navParams: NavParams, private viewCtrl: ViewController, private formBuilder: FormBuilder) {
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
