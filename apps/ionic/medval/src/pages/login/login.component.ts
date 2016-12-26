import {Component, EventEmitter} from "@angular/core";
import {FormGroup, Validators, FormControl} from "@angular/forms";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService, AuthResult} from "../../shared/aws/access.token.service";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {NavController, Loading} from "ionic-angular";
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
    private authProvider: AccessTokenService,
    private serviceFactory: ServiceFactory,
    private utils: Utils) {

    authProvider.logout();
  }

  public login() {

    let username: string = this.loginForm.controls[ 'username' ].value.trim();
    let password: string = this.loginForm.controls[ 'password' ].value.trim();

    console.log("Presenting loading");
    let loading: Loading = this.utils.presentLoading(2000);
    console.log("finished presenting loading");

    // Start new session and dismiss loading screen on success/failure (this dismiss step is required for ios/not for web)
    let subscription: Subject<AuthResult> = this.authProvider.startNewSession(username, password).subscribe(
      (token: AuthResult) => {
        console.log("in subscribe success");
        this.navigateToDashboardPage();
        subscription.unsubscribe();
        loading.dismissAll();
      },
      (err) => {
        console.log("in subscribe error:"+err);
        this.utils.presentTopToast("Login Failed with error: " + err + ". Please try again!");
        loading.dismissAll();
      },
      () => {
        loading.dismissAll();
      });
  }

  private navigateToDashboardPage() {
    console.log("about to navigate to dashboard");
    this.utils.setRoot(this.navCtrl, DashboardComponent);
  }

  public gotoHome() {
    this.navCtrl.setRoot(LoginComponent);
  }

  public gotoSettings() {
    this.navCtrl.push(SettingsComponent);
  }
}
