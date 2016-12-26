import {Component, EventEmitter} from "@angular/core";
import {FormGroup, Validators, FormControl} from "@angular/forms";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService, AuthResult} from "../../shared/aws/access.token.service";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {NavController} from "ionic-angular";
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

    let numTrials = 2;
    let firstLogin: boolean = true;
    //let loginEvent: EventEmitter<AuthResult>;
    //loginEvent = ;
    this.utils.presentLoading(2000);
    let subscription: Subject<AuthResult> = this.authProvider.startNewSession(username, password).subscribe(
      (token: AuthResult) => {
        this.navigateToDashboardPage();
        //loginEvent.complete();
        subscription.unsubscribe();
      },
      (err) => {
        this.utils.presentTopToast("Login Failed with error: " + err + ". Please try again!");
      });

  }

  private navigateToDashboardPage() {
    this.utils.setRoot(this.navCtrl, DashboardComponent);
  }

  public gotoHome() {
    this.navCtrl.setRoot(LoginComponent);
  }

  public gotoSettings() {
    this.navCtrl.push(SettingsComponent);
  }
}
