/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {Component} from "@angular/core";
import {NavController, ActionSheetController, AlertController, ToastController, NavParams} from "ionic-angular";
import {Account} from "../../services/account/schema";
import {AccountService} from "../../services/account/delegator";
import {Utils} from "../../shared/stuff/utils";
import {AdminComponent} from "../admin.component";
import {Config} from "../../shared/config";
import {AccountSetupService, AccountSetup} from "../../services/accountsetup/account.setup.service";
import {LoginComponent} from "../login/login.component";
import {ValidationService} from "../../shared/components/validation/validation.service";
import {Http} from "@angular/http";
import {DeviceServices} from "../../shared/service/DeviceServices";

@Component({
  selector:'account',
  templateUrl: './account.component.html'
})

export class AccountComponent extends AdminComponent {

  private selectOptions = {
    cssClass: 'fullwidth'
  }

  private requiredForCreate = {
    'account.customerId': true,
    'account.email': true,
    'account.username': true,
  }
  private requiredForEdit = {
    //'account.properties.customerName': true,
    //'account.properties.contactName': true,
    //'account.properties.customerName': true,
    //'account.properties.contactName': true,
  }

  constructor(private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              navCtrl: NavController,
              http: Http,
              private accountSvc : AccountService,
              private setupService: AccountSetupService,
              navParams: NavParams
  ) {
    super(navCtrl, http);
    let create = navParams.get('create');
    this.isEdit = !create;
    if (create) {
      this.account.customerId = Utils.generateCustomerId(5);
      //this.account.properties.customerName = Account.DEFAULT_CUSTOMER_NAME;
      //this.account.properties.contactName = Account.DEFAULT_CONTACT_NAME;
    }
  }

  account: Account = new Account();

  private _username: string;
  set username(value:string) {
    if (Utils.nullOrEmptyString(value)){
      return;
    }
    this._username = value.toLowerCase().trim();
  }
  get username() {
    return this._username;
  }

  phoneNumber: string;

  email: string;

  isEdit: boolean = false;

  verticals = [
    { key: "OrthodonticClinic", value: "General Dentistry or Orthodontic Clinic" },
  ];

  states = [
    { key: "WA", value: "WA"},
    { key: "CA", value:"CA"},
    { key: "Other", value:"Other"}
  ];

  ngOnInit(): void {
    try {

      if (!this.isEdit) {
        return;
      }
      super.ngOnInit();
      this.accountSvc.get(Config.CUSTOMERID)
        .then((account: Account) => {
          this.account = Object.assign(this.account, account);
        })
        .catch(err => {
          Utils.error(err);
          Utils.presentTopToast(this.toastCtrl, err || "Could not retrieve Account");
        });

    } catch(err) {
      super.handleErrorAndCancel(err);
    }
  }

  isRequired(item: string): boolean {
    if (this.isEdit) {
      return this.requiredForEdit[item] === true;
    }
    return this.requiredForCreate[item] === true;
  }
  showHelp(item: string) {
    Utils.showHelp(this.alertCtrl, item, 'bighelp');
  }

  collectUrl() {
    Utils.collectUrl(this.alertCtrl, this.actionSheetCtrl, (value): void => {
      this.account.properties.logo = value;
    })
  }

  save() {
    let errors = this.getValidationErrors();
    if (errors !== "") {
      Utils.presentInvalidEntryAlert(this.alertCtrl, 'Please take another look at the form!', errors);
      return;
    }
    try { // Best Effort
      this.account.truncateStringsInAccount();
    } catch(err) {
      Utils.error(err);
    }
    if (this.isEdit) {
      this.update()
        .then(()=>{
          Utils.presentTopToast(this.toastCtrl, "Saved", 2000);
          this.navCtrl.pop();
        })
        .catch((err) => {
          Utils.presentTopToast(this.toastCtrl, "Oops! We had a problem and could not save your change. Error: " + err);
        });
      return;
    }
    this.tryCreateAccount();
  }


  private tryCreateAccount() {
    if (DeviceServices.isDeviceOffline) {
      DeviceServices.warnAboutNetworkConnection();
      return;
    }

    Utils.showSpinner();
    setTimeout(()=>{
      let err: string = this.getAccountErrorsForCreate();
      if (err) {
        this.dismissLoadingShowAlert('Error', err);
        return;
      }
      let svc: AccountSetupService = this.setupService;
      svc.userexists(this.username).then((userexists)=> {
        if(userexists) {
          this.dismissLoadingShowAlert('The username you seleted is not available', '');
          return;
        }

        svc.customerexists(this.account.customerId)
          .then((customerexists)=> {
            if(customerexists) {
              this.dismissLoadingShowAlert('Oops! We ran into an unexpected problem. Do you mind trying again?', '');
              this.account.customerId = Utils.generateCustomerId(10);
              return;
            }
            let accountSetupObj = {
              customer: this.account,
              userName: this.username,
              emailAddress: this.email
            };
            svc.create(accountSetupObj)
              .then((accountSetup: AccountSetup)=>{
                this.dismissLoadingShowAlert("Created Account",`You will receive an email from 
                  no-reply@verificationemail.com with a temporary password.
                You will be prompted to change your password on first login!`, true);
              })
              .catch((err) => {
                err += "Account Creation failed: " + err;
                this.dismissLoadingShowAlert('Error', err);
              });
          });
      });
    })
  }

  private update(): Promise<any> {
    if (DeviceServices.isDeviceOffline) {
      DeviceServices.warnAboutNetworkConnection();
      return;
    }
    let errors = this.account.cleanupConfiguration();
    if (errors) {
      Utils.presentInvalidEntryAlert(this.alertCtrl, 'Errors', errors);
      return Promise.reject(errors);
    }
    return this.accountSvc.update(this.account)
      .catch((errResp) => {
        Utils.error(errResp);
        Utils.presentTopToast(this.toastCtrl, errResp);
        throw errResp;
      });
  }

  private transformPhoneNumberOrThrowException(phone: string) {
    phone = phone.replace(/[^0-9]/g, '');
    Utils.throwIf(phone.length < 10 || phone.length > 11 || (phone.length == 11 && phone.substring(0,0) != '1'),
      "Invalid Phone Format");
    if (phone.length == 10) {
      phone = "+1" + phone;
    } else if (phone.length == 11) {
      phone = "+" + phone;
    }
    return phone;
  }

  private dismissLoadingShowAlert(title: string, msg: string, navigate?: boolean) {
    Utils.hideSpinner();
    Utils.presentInvalidEntryAlert(this.alertCtrl, title, msg)
      .onDidDismiss(()=>{
        if (navigate) {
          Utils.setRoot(this.navCtrl, LoginComponent);
        }
      });
  }

  getValidationErrors(): string {
    if (!this.isEdit) {
      return this.getAccountErrorsForCreate();
    }
    return this.getAccountErrorsForUpdate();
  }

  private getAccountErrorsForUpdate(): string {
    let err = "";
    /*
    if (!this.account.properties.customerName) {
      err += "\nPlease provide an Organization Name";
    }

    if (!this.account.properties.contactName) {
      err += "\nPlease provide a Primary Contact Name";
    }
    */
    return err;
  }

  private getAccountErrorsForCreate(): string {
    let err = "";
    if (!ValidationService.validSingleWordId(this.account.customerId)) {
      err += '\nPlease provide an Organization ID (numbers digits and special charaters are ok, whitespace characters not ok)'
    }

    if (!ValidationService.validSingleWordId(this.username)) {
      err += '\nPlease provide a valid username (numbers digits and special charaters are ok, whitespace characters not ok)'
    }

    if (!ValidationService.validEmail(this.email)) {
      err += "\nPlease provide a valid email address";
    }
    return err;
  }
}
