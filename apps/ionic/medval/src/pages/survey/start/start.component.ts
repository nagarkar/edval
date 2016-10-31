import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {SurveyComponent} from "../survey.component";
import {LoginComponent} from "../../login/login.component";

@Component({
  templateUrl: 'start.component.html'
})
export class StartComponent {
  showNoThanks = false;
  constructor(private navCtrl: NavController) {}

  gotoLogin() {
    this.navCtrl.setRoot(LoginComponent);
  }

  noThanks() {
    this.showNoThanks = true;
    setTimeout(()=> {
      this.showNoThanks = false;
    }, 1000)
  }

  startSurvey(){
    this.navCtrl.setRoot(SurveyComponent, {
      directPage: true
    });
  }
}
