import {Component} from "@angular/core";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService, AuthResult} from "../../shared/aws/access.token.service";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {NavController, LoadingController, ToastController} from "ionic-angular";
import {SettingsComponent} from "../settings/settings.component";

@Component({
  templateUrl: './login.component.html'
})

export class LoginComponent {

  username: string;
  password: string;

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authProvider: AccessTokenService) {

  }

  invalid() {
    return this.username == null || this.password == null;
  }

  public login() {

    // TODO Remove before launch
    //this.navigateToDashboardPage();
    //if (1 == 1) return;
    // TODO end


    console.log("Before loading create: " + Date.now());
    let loading = this.loadingCtrl.create();
    loading.present();
    console.log("After loading presented: " + Date.now());

    // Start new session and dismiss loading screen on success/failure (this dismiss step is required for ios/not for web)
    this.authProvider.startNewSession(this.username.toLowerCase(), this.password,
      (token: AuthResult, err: any): void => {
        if(token) {
          console.log("After Authresult: " + Date.now());
          this.navigateToDashboardPage();
          console.log("After navigate to dashboard: " + Date.now());
          loading.dismissAll();
        }
        if(err) {
          Utils.error("LoginComponent.login().startNewSession:" + err);
          Utils.presentTopToast(this.toastCtrl, "Login Failed with error: " + err + ". Please try again!");
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
