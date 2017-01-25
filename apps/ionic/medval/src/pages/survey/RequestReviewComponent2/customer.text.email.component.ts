import {Component} from "@angular/core";
import {RegisterComponent} from "../../../services/survey/survey.navigator";
import {NavParams, ViewController, NavController, LoadingController} from "ionic-angular";
import {FormGroup, FormBuilder, Validators, AbstractControl, FormControl} from "@angular/forms";
import {SurveyPage} from "../survey.page";
import {Idle} from "@ng-idle/core";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";

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
    utils: Utils, navCtrl: NavController, sessionSvc: SessionService, idle: Idle, // For SurveyPage
    navParams: NavParams, loadingCtrl: LoadingController, private viewCtrl: ViewController, private formBuilder: FormBuilder) {

    super(loadingCtrl, navCtrl, sessionSvc, idle);

    this.message = navParams.get('message') || 'Please provide your email and text.';
    this.phone = navParams.get('phone') || '';
    this.email = navParams.get('email') || '';
  }

  ngOnInit() {
    super.ngOnInit();
    this.myForm = new FormGroup({
      // http://emailregex.com/
      email: new FormControl('', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
      phone: new FormControl('', Validators.pattern(/^(\([0-9]{3}\)\s)?[0-9]{3}\-[0-9]{4}$/)),
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
    let data = { 'email': this.email, 'phone': this.phone };
    this.viewCtrl.dismiss(data);
  }
}
