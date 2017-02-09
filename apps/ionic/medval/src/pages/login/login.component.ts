/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component} from "@angular/core";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService, AuthResult} from "../../shared/aws/access.token.service";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {NavController, ToastController, AlertController} from "ionic-angular";
import {SettingsComponent} from "../settings/settings.component";
import {AccountComponent} from "../account/account.component";
import {AccountSetupService} from "../../services/accountsetup/account.setup.service";
import {Config} from "../../shared/config";
import {HttpClient} from "../../shared/stuff/http.client";
import {Http} from "@angular/http";
import {Validators, FormControl, FormGroup} from "@angular/forms";
import {SpinnerDialog} from "ionic-native";

@Component({
  templateUrl: './login.component.html'
})

export class LoginComponent {

  loginForm = new FormGroup({
    'username': new FormControl('', Validators.required),
    'password': new FormControl('', Validators.required)
  });

  showNewAccount: boolean = Config.SHOW_NEW_ACCOUNT;

  showForgotPwd: boolean = Config.SHOW_FORGOT_PASSWORD;

  http: HttpClient<string>;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private accSetupSvc: AccountSetupService,
    private authProvider: AccessTokenService,
    http: Http) {

    if (authProvider.supposedToBeLoggedIn()) {
      Utils.error("Login Attempt while already logged in");
    }
  }

  setupNewAccount() {
    Utils.push(this.navCtrl, AccountComponent, {create: true});
  }

  forgotPassword() {
    Utils.presentAlertPrompt(this.alertCtrl, ((data)=>{
      let username = data.username;
      this.accSetupSvc.forgotPassword(username)
        .then((result: string) => {
          Utils.presentAlertPrompt(this.alertCtrl, ()=>{}, result);
        })
        .catch((err)=> {
          Utils.presentAlertPrompt(this.alertCtrl, ()=>{}, err);
        })
    }), 'Provide your username', [{name: "username", label: 'User Name'}]);
  }

  login() {

    let username: string = this.loginForm.controls[ 'username' ].value.trim().toLowerCase();
    let password: string = this.loginForm.controls[ 'password' ].value.trim();

    SpinnerDialog.show();

    let finishedLoginProcess = false;
    setTimeout(()=>{
      if (!finishedLoginProcess) {
        Utils.presentTopToast(
          this.toastCtrl, "Could not reach login server. Are you sure your device has a working internet connection?");
      }
    }, 3 * 60 * 1000)
    // Start new session and dismiss loading screen on success/failure (this dismiss step is required for ios/not for web)
    this.authProvider.startNewSession(username, password,
      (token: AuthResult, err: any): void => {
        if(token) {
          this.navigateToDashboardPage();
          finishedLoginProcess = true;
          SpinnerDialog.hide();
        }
        if(err) {
          Utils.error("LoginComponent.login().startNewSession:" + err);
          Utils.presentTopToast(this.toastCtrl, "Login Failed with error: " + err + ". Please try again!");
          finishedLoginProcess = true;
          SpinnerDialog.hide();
        }
      });
  }

  get lastWinTime(): number {
    return Config.LAST_WIN_TIME;
  }

  get lastSessionTime(): number {
    return Config.LAST_SESSION_CREATED;
  }

  get isLoggedIn(): boolean {
    return this.authProvider.cognitoUser != null;
  }

  private navigateToDashboardPage() {
    Utils.log("about to navigate to dashboard");
    Utils.setRoot(this.navCtrl, DashboardComponent);
  }

  public gotoHome() {
    Utils.setRoot(this.navCtrl, LoginComponent);
  }

  public gotoSettings() {
    Utils.push(this.navCtrl, SettingsComponent);
  }
}
