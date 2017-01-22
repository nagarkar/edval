import {Component} from "@angular/core";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService, AuthResult} from "../../shared/aws/access.token.service";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {NavController, LoadingController, ToastController, AlertController} from "ionic-angular";
import {SettingsComponent} from "../settings/settings.component";
import {AccountComponent} from "../account/account.component";
import {AccountSetupService} from "../../services/accountsetup/account.setup.service";
import {Config} from "../../shared/config";

@Component({
  templateUrl: './login.component.html'
})

export class LoginComponent {

  username: string;
  password: string;

  showNewAccount: boolean = Config.SHOW_NEW_ACCOUNT;

  showForgotPwd: boolean = Config.SHOW_FORGOT_PASSWORD;

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private accSetupSvc: AccountSetupService,
    private authProvider: AccessTokenService) {

    if (authProvider.supposedToBeLoggedIn()) {
      Utils.error("Login Attempt while already logged in");
    }
  }

  invalid() {
    return this.username == null || this.password == null;
  }

  setupNewAccount() {
    this.navCtrl.push(AccountComponent, {create: true});
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

    let loading = this.loadingCtrl.create();
    loading.present();

    let finishedLoginProcess = false;
    setTimeout(()=>{
      if (!finishedLoginProcess) {
        Utils.presentTopToast(
          this.toastCtrl, "Could not reach login server. Are you sure your device has a working internet connection?");
      }
    }, 3 * 60 * 1000)
    // Start new session and dismiss loading screen on success/failure (this dismiss step is required for ios/not for web)
    this.authProvider.startNewSession(this.username.toLowerCase(), this.password,
      (token: AuthResult, err: any): void => {
        if(token) {
          this.navigateToDashboardPage();
          finishedLoginProcess = true;
          loading.dismissAll();
        }
        if(err) {
          Utils.error("LoginComponent.login().startNewSession:" + err);
          Utils.presentTopToast(this.toastCtrl, "Login Failed with error: " + err + ". Please try again!");
          finishedLoginProcess = true;
          loading.dismissAll();
        }
      });
  }

  private navigateToDashboardPage() {
    Utils.log("about to navigate to dashboard");
    this.navCtrl.setRoot(DashboardComponent);
  }

  public gotoHome() {
    this.navCtrl.setRoot(LoginComponent);
  }

  public gotoSettings() {
    this.navCtrl.push(SettingsComponent);
  }
}
