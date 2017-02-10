/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
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

  constructor(protected  navCtrl: NavController) { }

  ngOnInit() {
    Utils.logoutIfNecessary(this.navCtrl);
  }

}
