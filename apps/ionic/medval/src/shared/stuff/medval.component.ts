import {OnInit} from "@angular/core";
import {AccessTokenService} from "../aws/access.token.service";
import {NavController} from "ionic-angular";
import {LoginComponent} from "../../pages/login/login.component";
import {Utils} from "./utils";
import {Session} from "../../services/session/schema";
import {Config} from "../aws/config";

/**
 * Subclasses should implement ngOnInit() and call super.ngOnInit() before calling the account to load
 * data.
 */
export abstract class MedvalComponent implements OnInit {

  constructor(protected  tokenProvider: AccessTokenService,
              protected  navCtrl: NavController,
              protected  utils: Utils) { }

  ngOnInit() {
    if(!Config.isMockData(new Session()) && !this.tokenProvider.getAuthResult()) {
      this.gotoLogin();
    }
  }

  gotoLogin() {
    this.utils.setRoot(this.navCtrl, LoginComponent)
  }

}
