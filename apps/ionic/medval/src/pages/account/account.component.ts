import {Component, Inject, OnInit} from '@angular/core';

import {ActionSheetController, AlertController, Nav, NavController} from 'ionic-angular';
import {Account} from "./account";
import { AccountService } from "./service/account.service";
import {CameraImageSelector} from "../../shared/stuff/camera.imageselector";
import {LoginComponent} from "../login/login.component";
import {ComponentUtils} from "../../shared/stuff/component.utils";
import {Logger} from "../../shared/logger.service";
import {AccessTokenProvider} from "../../shared/aws/access.token.service";
import {HttpClient} from "../../shared/stuff/http.client";
import {MockAccountService} from "./service/mock.account.service";
import {LiveAccountService} from "./service/live.account.service";

@Component({
  templateUrl: './account.component.html',
  providers: [ AccountService, MockAccountService, LiveAccountService ]
})

export class AccountComponent implements OnInit {

  public message: string = '';

  public account: Account = {customerId: '', properties: {customerName : "", logo: ""}};

  ngOnInit(): void {

    if(!this.tokenProvider.getAuthResult()) {
      setTimeout(() => this.navCtrl.setRoot(LoginComponent), 2000);
    }

    this.accountSvc.getAccount()
      .then(
        company => this.account = company
      )
      .catch(err => {
        this.message = err;
        setTimeout(() => {
          this.navCtrl.setRoot(LoginComponent);
        }, 1000)
      });
  }

  constructor(private tokenProvider: AccessTokenProvider,
              private logger: Logger,
              @Inject(AccountService) private accountSvc,
              private navCtrl: NavController,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              @Inject(CameraImageSelector) private camera) {

  }

  public collectUrl() {
    ComponentUtils.collectUrl(
      this.actionSheetCtrl,
      this.alertCtrl,
      this.camera,
      (value) => {
        this.account.properties.logo = value;
      })
  }

  public save() {
    ComponentUtils.showLoadingBar();

    this.accountSvc.saveAccount(this.account)
      .then((res) => {
        ComponentUtils.hideLoadingBar();
        this.message = 'Information saved successfully!.'
        this.hideMessage();
      })
      .catch((errResp) => {
        ComponentUtils.hideLoadingBar();
        this.message = errResp;
        this.hideMessage();
      })
  }

  private hideMessage() {
    setTimeout(() => this.message = '', 2000);
  }

}
