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

declare let AWSCognito:any;
declare let AWS:any;


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
    var me = this;
    Utils.presentAlertPrompt(this.alertCtrl, ((data)=>{
      let username = data.username;
      let userPool =
        new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(Config.POOL_DATA);
      let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
        Username : username,
        Pool : userPool
      });
      this.accSetupSvc.forgotPassword(username)
        .then((result: string) => {
          // Please user the reset code in the email or phone number you registered. This as your password
          Utils.presentInvalidEntryAlert(this.alertCtrl, "Reset your password", result);
        })
        .catch((err)=> {
          if (err && Utils.stringify(err).toLowerCase().indexOf("error") >=0){
            Utils.presentInvalidEntryAlert(this.alertCtrl, "Error", err);
          }
          else {
            Utils.presentAlertPrompt(
              me.alertCtrl,
              ((data)=> {
                let verificationCode = data.verificationCode;
                let newPassword = data.newPassword;
                cognitoUser.confirmPassword(verificationCode, newPassword,  {
                  onSuccess: function (result) {
                    Utils.presentInvalidEntryAlert(me.alertCtrl, "Done");
                  },
                  onFailure: function (err) {
                    Utils.presentInvalidEntryAlert(me.alertCtrl, "Error", err);
                  }
                });
              }),
              "Verification Code and Password",
              [{name: "verificationCode", label: 'Verification Code'}, {name: "newPassword", label: 'New Password'}],
              "Please check your registered email address and input the verification code we just sent to you, along with the new password!");
          }
        })
    }), 'Provide your username', [{name: "username", label: 'User Name'}]);
  }

  login() {

    let username: string = this.loginForm.controls['username'].value.trim().toLowerCase();
    let password: string = this.loginForm.controls['password'].value.trim();

    SpinnerDialog.show();
    setTimeout(()=>{
      this.loginWithCreds(username, password);
    }, 100);
  }

  loginWithCreds(username: string, password: string) {
    // Start new session and dismiss loading screen on success/failure (this dismiss step is required for ios/not for web)
    this.authProvider.startNewSession(username, password,
      (token: AuthResult, err: any): void => {
        if(token) {
          this.navigateToDashboardPage();
          SpinnerDialog.hide();
          this.logDeviceInfo();
        }
        if(err) {
          Utils.error("LoginComponent.login().startNewSession:" + err);
          Utils.presentTopToast(this.toastCtrl, "Login Failed with error: " + err + ". Please try again!");
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
