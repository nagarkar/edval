import {OnInit} from "@angular/core";
import {AccessTokenService} from "../shared/aws/access.token.service";
import {NavController} from "ionic-angular";
import {LoginComponent} from "./login/login.component";
import {Utils} from "../shared/stuff/utils";
import {Session} from "../services/session/schema";
import {Config} from "../shared/config";

/**
 * Subclasses should implement ngOnInit() and call super.ngOnInit() before calling the account to load
 * data.
 */
export abstract class AdminComponent implements OnInit {

  constructor(protected  tokenProvider: AccessTokenService,
              protected  navCtrl: NavController,
              protected  utils: Utils) { }

  ngOnInit() {
    if(!Config.isMockData(new Session()) && !this.tokenProvider.getAuthResult()) {
      this.utils.setRoot(this.navCtrl, LoginComponent)
    }
  }

}
