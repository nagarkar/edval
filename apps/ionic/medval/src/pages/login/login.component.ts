/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component} from "@angular/core";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {NavController, ToastController, AlertController, ModalController, Modal} from "ionic-angular";
import {SettingsComponent} from "../settings/settings.component";
import {AccountComponent} from "../account/account.component";
import {Config} from "../../shared/config";
import {Validators, FormControl, FormGroup} from "@angular/forms";
import {SpinnerDialog, NativeAudio} from "ionic-native";
import {HelpPage} from "../dashboard/help/help.page";
import {AnyComponent} from "../any.component";
import {DeviceServices} from "../../shared/service/DeviceServices";
import {AwsClient} from "../../shared/aws/aws.client";
import {Account} from "../../services/account/schema";
import {ServiceFactory} from "../../services/service.factory";
import {AppVersion} from "@ionic-native/app-version";
import {CodePush} from "@ionic-native/code-push";

declare let AWSCognito:any;
declare let AWS:any;


@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent extends AnyComponent {

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
    private modalCtrl: ModalController,
    private serviceFactory: ServiceFactory,
    private authProvider: AccessTokenService) {

    super();
    try {
      DeviceServices.warnAboutNetworkConnection();
      if (authProvider.supposedToBeLoggedIn()) {
        Utils.info("Login Attempt while already logged in");
      }
    } catch(err) {
      Utils.error("Error in LoginComponent.constructor {0}", err);
    }
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
    //this.loginWithCreds('celeron', 'passWord@1');
    //return;
    try {
      this.clearTimerHandles();
      this.setupSoundHandling();
      let prevUsername = this.authProvider.getUserName();
      this.loginForm.controls['username'].setValue(prevUsername || '');
    } catch(err){
      Utils.error("Error in LoginComponent.ngOnInit {0}", err);
    }
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
    if (DeviceServices.isDeviceOffline) {
      DeviceServices.warnAboutNetworkConnection();
      return;
    }
    let clearUsernamePwd = ()=>{
      this.loginForm.controls['username'].setValue('');
      this.loginForm.controls['password'].setValue('');
    }
    let modal: Modal = this.modalCtrl.create(AccountComponent, {create: true});
    modal.onDidDismiss(clearUsernamePwd)
    modal.present().then(clearUsernamePwd);
  }

  forgotPassword() {
    if (DeviceServices.isDeviceOffline) {
      DeviceServices.warnAboutNetworkConnection();
      return;
    }

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
          Utils.presentTopToast(me.toastCtrl,
            "Oops! That username was never registered, or... it's possible you've never verified your email (that option is available on the dashboard once you log in). You can create a new account and remember to verify your email, or contact questions@revvolve.io for assistance (" + err.name + ")");
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
                [{name: "newPassword", type: 'password', label: 'New Password', placeholder:'New Password'}]);
            }),
            "Provide Verification Code",
            [{name: "verificationCode", type:'number', label: 'Verification Code', placeholder:'Verification Code'}],
            "The verification code was just sent to your registered email address");
        }
      });
    }), 'What is your username', [{name: "username", label: 'User Name', placeholder:'username'}]);
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

    if (DeviceServices.isDeviceOffline) {
      DeviceServices.warnAboutNetworkConnection();
      return;
    }

    let username: string = this.loginForm.controls['username'].value.trim().toLowerCase();
    let password: string = this.loginForm.controls['password'].value.trim();
    if (Utils.nullOrEmptyString(password) || Utils.nullOrEmptyString(username)) {
      Utils.presentInvalidEntryAlert(this.alertCtrl, "Please provide a username and password");
      return;
    }
    Utils.showSpinner();
    setTimeout(()=>{
      this.loginWithCreds(username, password);
    }, 100);
  }

  loginWithCreds(username: string, password: string) {
    // Start new session and dismiss loading screen on success/failure (this dismiss step is required for ios/not for web)
    this.authProvider.login(username, password)
      .then((account: Account)=>{
        Config.CUSTOMER = account;
        Config.CUSTOMERID = account.customerId;
        this.serviceFactory.resetRegisteredServices()
          .then(()=> {
            SpinnerDialog.hide();
            AwsClient.reInitialize();
            this.navigateToDashboardPage();
          })
          .catch((err)=>{
            SpinnerDialog.hide();
            let errorMsg = "Ooops! There was a problem reaching our backend servers. Please contact questions@revvolve.io if this issue persists! Error: {0}";
            Utils.error(errorMsg, err);
            Utils.presentTopToast(this.toastCtrl, Utils.format(errorMsg, err));
          });
      })
      .catch((err)=>{
        SpinnerDialog.hide();
        if (DeviceServices.isDeviceOffline) {
          Utils.presentTopToast(this.toastCtrl, "Oops! Is the network down? It might help if you can verify your network is working and try again. If that doesn't work, please email questions@revvolve.io to get help!");
          return;
        }
        Utils.error("LoginComponent.login().startNewSession:" + err);
        Utils.presentTopToast(this.toastCtrl, "Login Failed with error: " + err);
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
      return Promise.resolve();
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

}
