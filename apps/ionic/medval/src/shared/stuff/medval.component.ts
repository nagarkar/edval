import {OnInit} from "@angular/core";
import {AccessTokenService} from "../aws/access.token.service";
import {NavController} from "ionic-angular";
import {LoginComponent} from "../../pages/login/login.component";
import {Utils} from "./utils";
/**
 * Created by chinmay on 10/29/16.
 */


/**
 * Subclasses should implement ngOnInit() and call super.ngOnInit() before calling the service to load
 * data.
 */
export abstract class MedvalComponent implements OnInit {

  constructor(protected  tokenProvider: AccessTokenService,
              protected  navCtrl: NavController,
              protected  utils: Utils) { }

  ngOnInit() {
    if(!this.tokenProvider.getAuthResult()) {
      setTimeout(() => this.navCtrl.setRoot(LoginComponent), 2000);
    }
    this.utils.showLoading();
  }

}
