/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component, ViewChild} from "@angular/core";
import {Utils} from "../../shared/stuff/utils";
import {Staff} from "../../services/staff/schema";
import {StaffService} from "../../services/staff/delegator";
import {
  NavParams,
  NavController,
  AlertController,
  ActionSheetController,
  ToastController,
  TextInput
} from "ionic-angular";

@Component({
  templateUrl: "./staff.edit.component.html"
})

export class StaffEditComponent {

  @ViewChild('username')
  usernameField: TextInput;

  staffMember: Staff;

  isEdit: boolean;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private staffSvc: StaffService,
    private params: NavParams,
    public navCtrl: NavController,
    private alertCtrl: AlertController
  ) {
      let staff: Staff = params.get("staffMember");
      if (staff) {
        this.isEdit = true;
        this.staffMember = staff;
      } else {
        this.isEdit = false;
        this.staffMember = Staff.newStaffMember();
      }
  }

  collectUrl() {
    Utils.collectUrl(this.alertCtrl, this.actionSheetCtrl, (value) => {
      this.staffMember.properties.photoUrl = value;
    });
  }

  cancel() {
    this.navCtrl.pop();
  }

  addEdit() {
    if (!this.validateNewStaff()) {
      return;
    }
    let resultPromise : Promise<Staff>;
    if (this.isEdit) {
      this.staffMember.entityStatus =  "ACTIVE";
      resultPromise = this.staffSvc.update(this.staffMember)
    } else {
      this.staffMember.entityStatus =  "ACTIVE";
      resultPromise = this.staffSvc.create(this.staffMember)
    };
    resultPromise
      .then(() => {
        this.navCtrl.pop();
        Utils.presentTopToast(this.toastCtrl, "Staff Member Updated");
      })
      .catch((reason) => {
        this.navCtrl.pop();
        Utils.presentTopToast(this.toastCtrl, reason || "Could not update Staff Member");
      });
  }

  private validateNewStaff() : boolean {
    let s = this.staffMember;
    let isValid : boolean =
      s.username && s.username.length > 0 &&
      s.properties.firstName && s.properties.firstName.length > 0 &&
      //s.properties.photoUrl && s.properties.photoUrl.length > 0 &&
      s.role && s.role.length > 0;

    if (!isValid) {
      Utils.presentInvalidEntryAlert(this.alertCtrl, "Please provide all values");
    }
    return isValid;
  }
}
