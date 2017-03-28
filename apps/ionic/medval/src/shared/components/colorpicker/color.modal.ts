/**
 * Created by chinmay on 3/26/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {Component} from "@angular/core";
import {NavParams, NavController} from "ionic-angular";

@Component({
  template: `
   <ion-content>
    <color-picker [hexColor]="colorObj.color" (colorChanged)="setColor($event)"></color-picker>
    <ion-grid>
      <ion-row>
        <ion-col align-self-center width-20><div style="text-align: center" [ngStyle]="{background: colorObj.color}">Your&nbsp;Choice&nbsp;&nbsp;&nbsp;&nbsp;</div></ion-col>
        <ion-col width-20><button ion-button small (tap)="close()">close</button></ion-col>
      </ion-row>
    </ion-grid>
   </ion-content>

  `
})
export class ColorModal {

  colorObj: any = {};
  setColor(ev) {
    this.colorObj.color = ev;
  }

  constructor(navParams: NavParams, private navCtrl: NavController) {
    this.colorObj = navParams.get('colorObj') || {color: '#04ad67'};
  }

  close() {
    this.navCtrl.pop();
  }

}
