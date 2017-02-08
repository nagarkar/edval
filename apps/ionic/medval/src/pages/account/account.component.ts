/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {Component} from "@angular/core";
import {
  NavController,
  ActionSheetController,
  AlertController,
  ToastController,
  NavParams,
  Loading,
  LoadingController
} from "ionic-angular";
import {Account} from "../../services/account/schema";
import {AccountService} from "../../services/account/delegator";
import {Utils} from "../../shared/stuff/utils";
import {AdminComponent} from "../admin.component";
import {Config} from "../../shared/config";
import {AccountSetupService, AccountSetup} from "../../services/accountsetup/account.setup.service";
import {LoginComponent} from "../login/login.component";

@Component({
  selector:'account',
  templateUrl: './account.component.html'
})

export class AccountComponent extends AdminComponent {

  constructor(private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              navCtrl: NavController,
              private accountSvc : AccountService,
              private setupService: AccountSetupService,
              navParams: NavParams
  ) {
    super(navCtrl);
    let create = navParams.get('create');
    this.isEdit = !create;
  }

  account: Account = new Account();

  username:string;

  phoneNumber: string;

  email: string;

  isEdit: boolean = true;

  verticals= [
    { key: "OrthodonticClinic", value: "Orthodontic Clinic"},
    { key: "DentalClinic", value:"Dental Clinic"}
  ];

  states = [
    { key: "WA", value: "WA"},
    { key: "CA", value:"CA"}
  ];


  //err: string = "";

  ngOnInit(): void {
    if (!this.isEdit) {
      return;
    }
    super.ngOnInit();
    this.accountSvc.get(Config.CUSTOMERID)
      .then((account: Account) => {
        this.account = account;
      })
      .catch(err => {
        Utils.error(err);
        Utils.presentTopToast(this.toastCtrl, err || "Could not retrieve Account");
      });
  }

  ngOnDestroy() {
    this.save();
  }

  collectUrl() {
    Utils.collectUrl(this.alertCtrl, this.actionSheetCtrl, (value): void => {
      this.account.properties.logo = value;
    })
  }

  navigate() {
    if (this.isEdit) {
      this.navCtrl.pop();
      return;
    }
    this.tryCreateAccount();
  }

  private save() {
    if (this.isEdit) {
      this.update();
    }
  }

  private loading: Loading;
  private static handle: number;
  private tryCreateAccount() {
    this.loading = Utils.presentLoading(this.loadingCtrl);
    let err: string = "";
    if (!this.account.customerId) {
      err += "\nPlease provide an Organization ID";
    }
    if (!this.username) {
      err += "\nPlease provide a username";
    }
    if (!this.phoneNumber) {
      err += "\nPlease provide a valid phone number with 10 digits";
    } else {
      try {
        this.phoneNumber = this.transformPhoneNumberOrThrowException(this.phoneNumber);
      } catch (err) {
        err += "\nPlease provide a valid phone number with 10 digits; errorcode:" + err;
      }
    }
    if (err) {
      this.dismissLoadingShowAlertClearInterval(err);
      return;
    }
    let usernameAvailable: boolean;
    let customerIdAvailable: boolean;
    let created: boolean;
    let totalWait: number = 1 * 60 * 1000; // 1/2 minute;
    let checkInterval: number = 100;
    let svc: AccountSetupService = this.setupService;
    svc.userexists(this.username).then((userexists)=> {
      usernameAvailable = !userexists;
      if (usernameAvailable === true) {
        svc.customerexists(this.account.customerId)
          .then((customerexists)=> {
            customerIdAvailable = !customerexists;
            if (customerIdAvailable === true) {
              svc.create({customer: this.account, userName: this.username, phoneNumber: this.phoneNumber})
                .then((accountSetup: AccountSetup)=>{
                  created = true;
                  this.dismissLoadingShowAlertClearInterval(`Please check your phone for a text message. Please
                    login with the username you selected on this page and the temporary password in the text message.`, true);
                })
                .catch((err) => {
                  created = false;
                  err += "Account Creation failed: " + err;
                  this.dismissLoadingShowAlertClearInterval(err);
                });
            };
          });
      };
    });
    if (AccountComponent.handle) {
      clearInterval(AccountComponent.handle);
    }
    AccountComponent.handle = setInterval(()=>{
      if (usernameAvailable === false) {
        err += "\nThe username you seleted is not available";
        this.dismissLoadingShowAlertClearInterval(err);
      }
      if (customerIdAvailable === false) {
        err += "\nThe Organization ID you seleted is not available";
        this.dismissLoadingShowAlertClearInterval(err);
      }
      totalWait -= 100;
      if (totalWait <= 0) {
        this.dismissLoadingShowAlertClearInterval(`Could not create a new account. Please contact technical support 
          at 206-407-8536.`);
      }
    }, checkInterval);
  }

  private update() {
    this.accountSvc.update(this.account)
      .catch((errResp) => {
        Utils.error(errResp);
      })
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

  private dismissLoadingShowAlertClearInterval(msg: string, navigate?: boolean) {
    this.loading.dismissAll();
    Utils.presentInvalidEntryAlert(this.alertCtrl, msg)
      .onDidDismiss(()=>{
        if (navigate) {
          this.navCtrl.setRoot(LoginComponent);
        }
      });
    clearInterval(AccountComponent.handle);
  }


  isInvalid(): boolean {
    if (!this.isEdit) {
      return this.username == null || this.phoneNumber == null || this.account.isInvalid();
    }
    return this.account.isInvalid()
  }
}
