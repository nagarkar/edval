/**
 * Created by chinmay on 3/25/17.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */

import {Component} from "@angular/core";
import {AdminComponent} from "../admin.component";
import {Http} from "@angular/http";
import {NavController, ToastController, ModalController, Modal, AlertController} from "ionic-angular";
import {AccountService} from "../../services/account/delegator";
import {Config} from "../../shared/config";
import {Account, Branding} from "../../services/account/schema";
import {Utils} from "../../shared/stuff/utils";
import {ColorModal} from "../../shared/components/colorpicker/color.modal";

@Component({
  templateUrl:"./account.branding.html",
  selector: 'account-brand'
})
export class AccountBranding extends AdminComponent {

  count = 0;

  constructor(http:Http, navCtrl: NavController, private accSvc: AccountService,
      private toastCtrl: ToastController, private modalCtrl: ModalController, alertCtrl: AlertController) {
    super(navCtrl, alertCtrl, http);
  }

  updateImage(attr: string, crop: string) {
    Utils.updateImage(this, attr, crop)
      .then((result:boolean)=>{
        if (result) {
          Utils.presentTopToast(this.toastCtrl, 'Updated Image');
        }
        //location.reload();
      });
  }

  /*
  clicked() {
    Utils.log("Clicked");
    this.count = (this.count + 1) % 10;
  }

  tapped() {
    Utils.log("Tapped");
    this.count = (this.count + 1) % 10;
  }
  */

  swiped() {
    Utils.log("Swiped");
    this.count = (this.count + 1) % 10;
  }

  openColorPicker(attr: string) {
    let colorObj = {color:this[attr]};
    let modal: Modal = this.modalCtrl.create(ColorModal, {colorObj: colorObj});
    modal.onDidDismiss(()=>{
      this[attr] = colorObj.color;
    });
    modal.present();
  }

  updateColor(attr: string, color: string) {
    this[attr] = color;
  }

  save() {
    let acc: Account = this.accSvc.getCached(Config.CUSTOMERID);
    let branding: Branding = this as Branding;
    acc.setBranding(branding);
    this.accSvc.update(acc)
      .then(()=>{
        Config.CUSTOMER = acc;
        Utils.presentInvalidEntryAlert(this.alertCtrl, "Please logout and log back in to see branding changes!");
        this.navCtrl.pop();
      })
      .catch((errResp)=>{
        this.navCtrl.pop();
        Utils.error(errResp);
        Utils.presentTopToast(this.toastCtrl, errResp);
        throw errResp;
      })
  }

  cancel() {
    this.navCtrl.pop();
  }

}
