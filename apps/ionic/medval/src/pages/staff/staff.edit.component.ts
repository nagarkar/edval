import {Component} from "@angular/core";
import {Utils} from "../../shared/stuff/utils";
import {Staff} from "../../services/staff/schema";
import {StaffService} from "../../services/staff/delegator";
import {NavParams, NavController, AlertController, ActionSheetController, ToastController} from "ionic-angular";
import {final} from "../../app/app.module";

@Component({
  templateUrl: "./staff.edit.component.html"
})

export class StaffEditComponent {

  @final
  staffMember: Staff;

  @final
  isEdit: boolean;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private staffSvc: StaffService,
    private params: NavParams,
    public navCtrl: NavController,
    private alertCtrl: AlertController
  ) {
      this.isEdit = params.get("staffMember");
      if (this.isEdit) {
        this.staffMember = params.get("staffMember");
      } else {
        this.staffMember = Staff.newStaffMember();
      }
  }

  public collectUrl() {
    Utils.collectUrl(this.alertCtrl, this.actionSheetCtrl, (value) => {
      this.staffMember.properties.photoUrl = value;
    });
  }

  public cancel() {
    this.navCtrl.pop();
  }

  public add() {
    if (!this.validateNewStaff()) {
      return;
    }
    let resultPromise : Promise<Staff>;
    if (this.isEdit) {
      resultPromise = this.staffSvc.update(this.staffMember)
    } else {
      this.staffMember.entityStatus =  "ACTIVE";
      resultPromise = this.staffSvc.create(this.staffMember)
    };
    resultPromise
      .then(() => {
        this.navCtrl.pop();
      })
      .catch((reason) => {
        Utils.presentTopToast(this.toastCtrl, reason || "Could not update Staff Member", 3000);
        this.navCtrl.pop();
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
