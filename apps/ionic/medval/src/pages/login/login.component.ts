import {Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService, AuthResult} from "../../shared/aws/access.token.service";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {NavController} from "ionic-angular";
import {HttpClient} from "../../shared/stuff/http.client";

@Component({
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  private authResult: AuthResult;

  constructor(
    public navCtrl: NavController,
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private authProvider: AccessTokenService,
    private utils: Utils) {

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
    this.utils.setRoot(this.navCtrl, DashboardComponent);
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
    Utils.log("Login component got accessTokey \n" + this.authResult);
  }

  private processError(err) : void {
    this.authResult = null;
    Utils.error("Error \n" + err);
  }
}
