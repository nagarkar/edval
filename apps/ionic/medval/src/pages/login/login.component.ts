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
import {HelpPage} from "../dashboard/help/help.page";

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

  private static soundTimerHandle: number;

  private clearTimerHandles() {
    if (LoginComponent.soundTimerHandle) {
      clearInterval(LoginComponent.soundTimerHandle);
    }
  }

  static MUSIC_ID: string = "assets/mp3/bingbong.mp3";
  static MUSIC_PRELOADED: boolean = false;

  ngOnInit() {
    this.clearTimerHandles();
    this.setupSoundHandling();
  }

  ngOnDestroy() {
    this.clearTimerHandles();
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
      let username: string = data.username;
      if (Utils.nullOrEmptyString(username)) {
        return false;
      }
      username = username.trim().toLowerCase();
      let userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(Config.POOL_DATA);
      let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
        Username : username,
        Pool : userPool
      });
      cognitoUser.forgotPassword({
        onSuccess: function (result) {
          Utils.info('Forgotpassword call result: ' + result);
        },
        onFailure: function(err) {
          Utils.presentTopToast(me.toastCtrl, "Error when calling forgotPassword: " + err);
        },
        inputVerificationCode() {
          Utils.presentAlertPrompt(
            me.alertCtrl,
            ((data)=> {
              let verificationCode: string = data.verificationCode;
              if (Utils.nullOrEmptyString(verificationCode)) {
                return false;
              }
              verificationCode = verificationCode.trim();
              Utils.presentAlertPrompt(
                me.alertCtrl,
                ((passwordData)=> {
                  let password: string = passwordData.newPassword;
                  if (Utils.nullOrEmptyString(password)) {
                    return false;
                  }
                  password = password.trim();
                  me.tryNewPassword(username, cognitoUser, verificationCode, password);
                }),
                "Please pick a new password",
                [{name: "newPassword", type: 'password', label: 'New Password'}]);
            }),
            "Provide Verification Code",
            [{name: "verificationCode", type:'number', label: 'Verification Code'}],
            "The verification code was just sent to your registered email address");
        }
      });
      /*
      this.accSetupSvc.forgotPassword(username)
        .then((result: string) => {
          // never invoked due to teh bad way backend is implemented.
        })
        .catch((err)=> {
          if (err && Utils.stringify(err).toLowerCase().indexOf("error") >=0){
            Utils.presentInvalidEntryAlert(me.alertCtrl, "Problems...", err);
            return;
          }
          Utils.presentAlertPrompt(
            me.alertCtrl,
            ((data)=> {
              let verificationCode = data.verificationCode;
              if (Utils.nullOrEmptyString(verificationCode)) {
                return false;
              }
              Utils.presentAlertPrompt(
                me.alertCtrl,
                ((passwordData)=> {
                  if (Utils.nullOrEmptyString(passwordData.newPassword)) {
                    return false;
                  }
                  me.tryNewPassword(username, cognitoUser, verificationCode.trim(), passwordData.newPassword.trim());
                }),
                "Please pick a new password",
                [{name: "newPassword", type: 'password', label: 'New Password'}]);
            }),
            "Provide Verification Code",
            [{name: "verificationCode", type:'number', label: 'Verification Code'}],
            "The verification code was just sent to your registered email address");
        })
      */
    }), 'What is your username', [{name: "username", label: 'User Name'}]);
  }

  tryNewPassword(username: string, cognitoUser: any, verificationCode: string, newPassword: string) {
    var me = this;
    cognitoUser.confirmPassword(verificationCode, newPassword,  {
      onSuccess: function (result) {
        SpinnerDialog.show(null, null, true);
        setTimeout(()=>{
          me.loginWithCreds(username, newPassword);
        }, 50);

      },
      onFailure: function (err) {
        Utils.presentInvalidEntryAlert(me.alertCtrl, "Problems...", err);
      }
    });
  }

  login() {

    let username: string = this.loginForm.controls['username'].value.trim().toLowerCase();
    let password: string = this.loginForm.controls['password'].value.trim();

    SpinnerDialog.show(null, null, true);
    setTimeout(()=>{
      this.loginWithCreds(username, password);
    }, 100);
  }

  loginWithCreds(username: string, password: string) {
    // Start new session and dismiss loading screen on success/failure (this dismiss step is required for ios/not for web)
    this.authProvider.startNewSession(username, password,
      (token: AuthResult, err: any): void => {
        if(token) {
          SpinnerDialog.hide();
          this.navigateToDashboardPage();
          this.logDeviceInfo();
        }
        if(err) {
          SpinnerDialog.hide();
          Utils.error("LoginComponent.login().startNewSession:" + err);
          Utils.presentTopToast(this.toastCtrl, "Login Failed with error: " + err);
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

  gotoHelp() {
    Utils.push(this.navCtrl, HelpPage);
  }


  private setupSoundHandling() {
    this.preloadSoundIfNecessary()
      .then(()=>{
        LoginComponent.soundTimerHandle = setInterval(()=> {
          let id = LoginComponent.MUSIC_ID;
          NativeAudio.play(id, ()=> {} /* Nothing to do on completion */)
            .then(()=> {
              Utils.info("Played sound {0}", id);
            })
            .catch((err)=> {
              Utils.error("Unable to play sound {0}, due to {1}", id, err);
            })
        }, 2 * 60 * 1000);
      })
  }

  private preloadSoundIfNecessary(): Promise<any> {
    if (LoginComponent.MUSIC_PRELOADED) {
      return;
    }
    let id = LoginComponent.MUSIC_ID;
    return NativeAudio.preloadSimple(id, id)
      .then((result: any)=>{
        LoginComponent.MUSIC_PRELOADED = true;
        return result;
      })
      .catch((err)=>{
        Utils.error("Could not preload music in login component : {0}", err);
        throw err;
      });
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
