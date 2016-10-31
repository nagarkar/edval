import {Component} from "@angular/core";
import {Utils} from "../../shared/stuff/utils";
import {Staff} from "./staff";
import {StaffService} from "./service/staff.service";
import {NavParams, NavController} from "ionic-angular";
import {final} from "../../app/app.module";
import {MockStaffService} from "./service/mock.staff.service";
import {LiveStaffService} from "./service/live.staff.service";

@Component({
  templateUrl: "staff.edit.component.html",
  providers: [ StaffService, MockStaffService, LiveStaffService]
})

export class StaffEditComponent {

  @final
  staffMember: Staff;

  @final
  isEdit: boolean;

  constructor(
    private utils: Utils,
    private staffSvc: StaffService,
    private params: NavParams,
    public navCtrl: NavController
  ) {
      this.isEdit = params.get("staffMember");
      if (this.isEdit) {
        this.staffMember = params.get("staffMember");
      } else {
        this.staffMember = Staff.newStaffMember();
      }
  }

  public collectUrl() {
    this.utils.collectUrl((value) => {
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
      resultPromise = this.staffSvc.updateStaff(this.staffMember)
    } else {
      this.staffMember.entityStatus =  "ACTIVE";
      resultPromise = this.staffSvc.createStaff(this.staffMember)
    };
    resultPromise
      .then(() => {
        this.navCtrl.pop();
      })
      .catch((reason) => {
        this.utils.presentTopToast(reason, 3000);
        this.navCtrl.pop();
      });
  }

  private validateNewStaff() : boolean {
    let s = this.staffMember;
    let isValid : boolean =
      s.username && s.username.length > 0 &&
      s.properties.photoUrl && s.properties.photoUrl.length > 0 &&
      s.role && s.role.length > 0;

    if (!isValid) {
      this.utils.presentInvalidEntryAlert("Please provide all values");
    }
    return isValid;
  }
}
