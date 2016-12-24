import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {NavController} from "ionic-angular";
import {SettingsComponent} from "../settings/settings.component";
import {ServiceFactory} from "../../services/service.factory";

@Component({
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {

  public loginForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    private fb: FormBuilder,
    private authProvider: AccessTokenService,
    private serviceFactory: ServiceFactory,
    private utils: Utils) {

  }

  public ngOnInit() : void {
    this.initValidation();
  }

  private initValidation() {
    this.loginForm = this.fb.group({
      'username': [ '', Validators.required ],
      'password': [ '', Validators.required ]
    });
  }

  public login() {

    let username: string = this.loginForm.controls[ 'username' ].value.trim();
    let password: string = this.loginForm.controls[ 'password' ].value.trim();

    this.authProvider.startNewSession(username, password).then(
      (token) => {
        this.serviceFactory.resetRegisteredServices();
        this.navigateToDashboardPage();
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
