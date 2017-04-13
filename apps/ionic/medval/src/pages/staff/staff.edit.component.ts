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
import {AnyComponent} from "../any.component";

@Component({
  templateUrl: "./staff.edit.component.html"
})

export class StaffEditComponent extends AnyComponent {

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
      super();
      let staff: Staff = params.get("staffMember");
      if (staff) {
        this.isEdit = true;
        this.staffMember = staff;
      } else {
        this.isEdit = false;
        this.staffMember = Staff.newStaffMember();
        this.staffMember.properties.photoUrl = this.placeHolderImage;
        this.staffMember.role = "DDS";
      }
  }

  updateImage() {
    Utils.updateImage(this.staffMember.properties, 'photoUrl', "4:5").then((result:boolean)=>{
      if (result) {
        Utils.presentTopToast(this.toastCtrl, 'Updated Image');
      }
    })
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
        Utils.presentTopToast(this.toastCtrl, "Staff Member Updated", 2*1000);
      })
      .catch((reason) => {
        this.navCtrl.pop();
        Utils.presentTopToast(this.toastCtrl, reason || "Could not update Staff Member");
      });
  }

  private validateNewStaff() : boolean {
    let s = this.staffMember;
    let msg = "";
    if (Utils.nullOrEmptyString(s.username)) {
      msg += "Please provide a non-empty username\n"
    }
    if (Utils.nullOrEmptyString(s.properties.firstName)) {
      msg += "Please provide a non-empty first name\n"
    }
    if (Utils.nullOrEmptyString(s.role)) {
      msg += "Please provide a role\n"
    }

    if (!Utils.nullOrEmptyString(msg)) {
      Utils.presentInvalidEntryAlert(this.alertCtrl, msg);
      return false;
    }
    return true;
  }
}
