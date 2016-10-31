import {Component, AfterViewChecked} from '@angular/core';

import { NavController} from 'ionic-angular';
import {Config} from "../../../shared/aws/config";
import {StartComponent} from "../start/start.component";

@Component({
  templateUrl: 'thanks.component.html',
})
export class ThanksComponent implements AfterViewChecked {

  constructor(
    private navCtrl: NavController,
    private config: Config) { }


  public restartSurvey() {
    this.navCtrl.setRoot(StartComponent);
  }

  public ngAfterViewChecked() {
    setTimeout(()=> {
      this.restartSurvey();
    }, this.config.timeOutAfterThanks)
  }
}
