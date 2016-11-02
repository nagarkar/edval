import {Component, AfterViewChecked, AfterViewInit} from '@angular/core';

import { NavController} from 'ionic-angular';
import {Config} from "../../../shared/aws/config";
import {StartComponent} from "../start/start.component";
import {Utils} from "../../../shared/stuff/utils";
import {SessionService} from "../../../services/session/delegator";
import {MedvalComponent} from "../../../shared/stuff/medval.component";
import {AccessTokenService} from "../../../shared/aws/access.token.service";

@Component({
  templateUrl: 'thanks.component.html',
})
export class ThanksComponent extends MedvalComponent implements AfterViewInit {

  constructor(
    tokenProvider: AccessTokenService,
    private sessionService: SessionService,
    private config: Config,
    navCtrl: NavController,
    utils: Utils
    ) {
    super(tokenProvider, navCtrl, utils);
  }

  public restartSurvey() {
    this.sessionService.closeCurrentSession();
    this.utils.push(this.navCtrl, StartComponent);
  }

  public ngAfterViewInit() {
    setTimeout(()=> {
      this.restartSurvey();
    }, this.config.timeOutAfterThanks)
  }
}
