import {Component} from "@angular/core";
import {FormGroup, Validators, FormControl} from "@angular/forms";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService, AuthResult} from "../../shared/aws/access.token.service";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {NavController, LoadingController, ToastController} from "ionic-angular";
import {SettingsComponent} from "../settings/settings.component";
import {ServiceFactory} from "../../services/service.factory";
import {Subject} from "rxjs";

@Component({
  templateUrl: 'login.component.html'
})

export class LoginComponent {

  loginForm = new FormGroup({
    'username': new FormControl('', Validators.required),
    'password': new FormControl('', Validators.required)
  });

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authProvider: AccessTokenService) {

    authProvider.logout();
  }

  public login() {

    // TODO Remove before launch
    //this.navigateToDashboardPage();
    //if (1 == 1) return;
    // TODO end


    let username: string = this.loginForm.controls[ 'username' ].value.trim();
    let password: string = this.loginForm.controls[ 'password' ].value.trim();

    console.log("Before loading create: " + Date.now());
    let loading = this.loadingCtrl.create({spinner: 'ios', duration: 4000, dismissOnPageChange: true});
    loading.present();
    console.log("After loading create: " + Date.now());

    // Start new session and dismiss loading screen on success/failure (this dismiss step is required for ios/not for web)
    this.authProvider.startNewSession(username, password,
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
