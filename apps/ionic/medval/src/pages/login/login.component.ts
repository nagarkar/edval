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
import {Validators, FormControl, FormGroup} from "@angular/forms";
import {SpinnerDialog, NativeAudio, Device} from "ionic-native";

declare let cordova;

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

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private accSetupSvc: AccountSetupService,
    private authProvider: AccessTokenService) {

    if (authProvider.supposedToBeLoggedIn()) {
      Utils.info("Login Attempt while already logged in");
    }
    authProvider.resetLoginErrors();
  }

  static MUSIC_INTERVAL_HANDLE: number;
  static MUSIC_ID: string = "assets/mp3/bingbong.mp3";
  static MUSIC_PRELOADED: boolean = false;
  ngOnInit() {
    let musicId = LoginComponent.MUSIC_ID;
    if (!LoginComponent.MUSIC_PRELOADED) {
      NativeAudio.preloadSimple(musicId, musicId)
        .then(()=>{
          LoginComponent.MUSIC_PRELOADED = true;
        })
        .catch((err)=>{
          Utils.error("Could not preload music in login component : {0}", err);
        });
    }
    LoginComponent.MUSIC_INTERVAL_HANDLE = setInterval(()=>{
      if (LoginComponent.MUSIC_PRELOADED) {
        NativeAudio.play(musicId, ()=>{} /* Nothing to do on completion */)
            .then(()=>{
              Utils.info("Played sound {0} in Logincomponent", musicId);
            })
            .catch((err)=>{
              Utils.error("Unable to play sound {0} in Logincomponent", musicId);
            })
        }
    }, 2 * 60 * 1000)
  }
  ngOnDestroy() {

  }
  //TODO DELETE THIS ***************************
  // ngOnInit() {
  //   this.loginWithCreds('celeron', 'passWord@1');
  // }
  //*********************************************

  setupNewAccount() {
    Utils.push(this.navCtrl, AccountComponent, {create: true});
  }

  forgotPassword() {
    Utils.presentAlertPrompt(this.alertCtrl, ((data)=>{
      let username = data.username;
      this.accSetupSvc.forgotPassword(username)
        .then((result: string) => {
          Utils.presentAlertPrompt(this.alertCtrl, null, result);
        })
        .catch((err)=> {
          Utils.presentAlertPrompt(this.alertCtrl, null, err);
        })
    }), 'Provide your username', [{name: "username", label: 'User Name'}]);
  }

  login() {

    let username: string = this.loginForm.controls['username'].value.trim().toLowerCase();
    let password: string = this.loginForm.controls['password'].value.trim();

    this.loginWithCreds(username, password);
  }

  loginWithCreds(username: string, password: string) {

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
          this.logDeviceInfo();
        }
        if(err) {
          Utils.error("LoginComponent.login().startNewSession:" + err);
          Utils.presentTopToast(this.toastCtrl, "Login Failed with error: " + err + ". Please try again!");
          finishedLoginProcess = true;
          SpinnerDialog.hide();
        }
      });
  }

  get isLoggedIn(): boolean {
    return this.authProvider.cognitoUser != null;
  }

  private navigateToDashboardPage() {
    Utils.setRoot(this.navCtrl, DashboardComponent);
  }

  public gotoHome() {
    Utils.setRoot(this.navCtrl, LoginComponent);
  }

  public gotoSettings() {
    Utils.push(this.navCtrl, SettingsComponent);
  }

  private logDeviceInfo() {
    Utils.log(["Device Information;",
      "uuid:", Device.uuid, ";",
      "cordova version:", Device.cordova, ";",
      "model:", Device.model, ";",
      "os name:", Device.platform, ";",
      "os version:", Device.version, ";",
      "manufacturer:", Device.manufacturer, ";",
      "is running on a simulator:", Device.isVirtual, ";",
      "device hardware serial number:", Device.serial, ";",
      "device Revvolve version:", Config.SOFTWARE_VERSION
    ].join(''));
  }
}
