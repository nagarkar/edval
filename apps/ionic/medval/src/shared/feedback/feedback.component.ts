import {Component, Output} from '@angular/core';

import { NavController } from 'ionic-angular';
import {MedvalComponent} from "../stuff/medval.component";
import {AccessTokenService} from "../aws/access.token.service";
import {Utils} from "../stuff/utils";
import {EventEmitter} from "@angular/common/src/facade/async";

@Component({
  templateUrl: 'feedback.component.html',
  selector:'textFeedback'
})
export class FeedbackComponent extends MedvalComponent {

  textValue: string = "";
  @Output() textValueChange : EventEmitter<string> = new EventEmitter<string>();

  constructor(tokenProvider: AccessTokenService,
              navCtrl: NavController,
              utils: Utils) {

    super(tokenProvider, navCtrl, utils);
    //alert("In save feedback const");
  }

  saveFeedback() {
    //alert("In save feedback");
    this.textValueChange.emit(this.textValue);
  }
}
