import {Component } from '@angular/core';

import {NavController} from 'ionic-angular';
import {Account} from "../../services/account/schema";
import { AccountService } from "../../services/account/delegator";
import {LoginComponent} from "../login/login.component";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {MockAccountService} from "../../services/account/mock";
import {LiveAccountService} from "../../services/account/live";
import {MedvalComponent} from "../../shared/stuff/medval.component";
import {Config} from "../../shared/aws/config";

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
    this.utils.log("Calling account account to get account");
    this.accountSvc.get(Config.CUSTOMERID)
      .then((account: Account) => {
        this.account = account;
      })
      .catch(err => {
        this.utils.presentTopToast(err || "Could not retrieve Account");
        this.utils.log(err)
      });
  }

  public collectUrl() {
    this.utils.collectUrl((value) => {
      this.account.properties.logo = value;
    })
  }

  public save() {
    this.accountSvc.update(this.account)
      .then((res) => {
        this.utils.presentTopToast('Information saved successfully!.');
      })
      .catch((errResp) => {
        this.utils.presentTopToast(errResp || "Could not save Account");
      })
  }
}
