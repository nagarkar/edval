import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {Logger} from "../../shared/logger.service";
import {AccessTokenProvider, AuthResult} from "../../shared/aws/access.token.service";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {NavController, Nav, App} from "ionic-angular";
import {HttpClient} from "../../shared/stuff/http.client";

//import { UserComponent } from "../user/user.component";
//import { CognitoService } from "../../shared/aws";

//import { LoggedInCallback } from "../../shared/aws/cognito.service";
//import { StartComponent } from "../start";

@Component({
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {

  //@ViewChild(Nav) nav;

  public errorMessage: string;
  public loginForm: FormGroup;
  private authResult: AuthResult;

  constructor(
    public navCtrl: NavController,
    private httpClient: HttpClient<string>,
    private fb: FormBuilder,
    @Inject(AccessTokenProvider) private authProvider,
    @Inject(Logger) private logger) {

  }

  public ngOnInit() : void {
    this.initValidation();
    this.initSubscriptions();
  }

  private initValidation() {
    this.loginForm = this.fb.group({
      'username': [ '', Validators.required ],
      'password': [ '', Validators.required ]
    });
  }

  public login() {
    this.errorMessage = '';

    let username: string = this.loginForm.controls[ 'username' ].value.trim();
    let password: string = this.loginForm.controls[ 'password' ].value.trim();

    this.authProvider.startNewSession(username, password).then(
      (token) => {
        this.processToken(token);
        this.navigateToDashboardPage();
      },
      (err) => this.processError(err));
  }


  private navigateToDashboardPage() {
    this.navCtrl.setRoot(DashboardComponent)
  }

  public gotoHome() {
    //this.navCtrl.setRoot(StartComponent);
  }

  private initSubscriptions() {
    this.authProvider.tokenObservable.subscribe(
      next => this.processToken(next),
      err => this.processError(err),
      () => {}
    )
  }

  private processToken(tokens: AuthResult) {
    this.authResult = tokens;
    this.errorMessage = null;

    this.httpClient.ping()
      .then(
        res => alert(res),
        error => {
          this.errorMessage = <any>error;
          alert(error);
        }
      );
    this.logger.log("Login component got accessTokey \n" + this.authResult);
  }

  private processError(err) : void {
    this.authResult = null;
    this.errorMessage = err;
    this.logger.log("Error \n" + this.errorMessage);
  }
}
