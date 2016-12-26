import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService, AuthResult} from "../../shared/aws/access.token.service";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {NavController} from "ionic-angular";
import {SettingsComponent} from "../settings/settings.component";
import {ServiceFactory} from "../../services/service.factory";

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

  }

  public login() {

    let username: string = this.loginForm.controls[ 'username' ].value.trim();
    let password: string = this.loginForm.controls[ 'password' ].value.trim();

    this.authProvider.startNewSession(username, password).then(
      (token: AuthResult) => {
        this.serviceFactory.resetRegisteredServices();
        this.navigateToDashboardPage();
        return token;
      },
      (err) => {
        Utils.error(err);
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
