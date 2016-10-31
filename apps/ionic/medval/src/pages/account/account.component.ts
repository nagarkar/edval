import {Component } from '@angular/core';

import {NavController} from 'ionic-angular';
import {Account} from "./account";
import { AccountService } from "./service/account.service";
import {LoginComponent} from "../login/login.component";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {MockAccountService} from "./service/mock.account.service";
import {LiveAccountService} from "./service/live.account.service";
import {MedvalComponent} from "../../shared/stuff/medval.component";

@Component({
  templateUrl: './account.component.html',
  providers: [ AccountService, MockAccountService, LiveAccountService ]
})

export class AccountComponent extends MedvalComponent {

  constructor(protected tokenProvider: AccessTokenService,
              public navCtrl: NavController,
              protected utils: Utils,
              private accountSvc : AccountService,
  ) {
    super(tokenProvider, navCtrl, utils);
  }

  public account: Account = {
    customerId: '',
    properties: {
      customerName : "",
      logo: ""
    },
    configuration: { }
  };

  ngOnInit(): void {
    super.ngOnInit();
    this.utils.log("Calling account service to get account");
    this.accountSvc.getAccount()
      .then((account: Account) => {
        this.account = account;
      })
      .catch(err => {
        this.utils.presentTopToast(err);
        this.utils.log(err)
      });
    /*this.accountSvc.getAccount().subscribe(
      (company : any) => {
        this.utils.log("Got account: " + JSON.stringify(company));
        this.account = Object.assign<Account, any>(this.account, company);
      },
      (err) => {
        this.utils.presentTopToast(err);
        setTimeout(() => {
          this.navCtrl.setRoot(LoginComponent);
        }, 1000)
      });
      */
  }

  public collectUrl() {
    this.utils.collectUrl((value) => {
      this.account.properties.logo = value;
    })
  }

  public save() {

    this.accountSvc.saveAccount(this.account)
      .then((res) => {
        this.utils.presentTopToast('Information saved successfully!.');
      })
      .catch((errResp) => {
        this.utils.presentTopToast(errResp);
      })
  }
}
