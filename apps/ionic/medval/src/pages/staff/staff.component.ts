import {Component} from "@angular/core";
import {NavController, AlertController, ModalController, ToastController} from "ionic-angular";
import {Staff} from "../../services/staff/schema";
import {Utils} from "../../shared/stuff/utils";
import {StaffService} from "../../services/staff/delegator";
import {AdminComponent} from "../admin.component";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {StaffEditComponent} from "./staff.edit.component";

@Component({
  templateUrl: 'staff.component.html',
  providers: [ ]
})
export class StaffComponent extends AdminComponent  {

  // Dummy staff and staff member to avoid blowing up the view on startup.
  public staffList: Staff[] = [Staff.newStaffMember()];

  constructor(
    navCtrl: NavController,
    tokenProvider: AccessTokenService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private staffSvc : StaffService) {

    super(tokenProvider, navCtrl);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.listenToUpdatesAndRefresh();
    this.getStaffList();
  }

  public cancel() {
    this.navCtrl.pop();
  }

  public add() {
    if (!this.currentUserIsAdmin()) {
      Utils.presentInvalidEntryAlert(this.alertCtrl, "Only administrators can add users");
      return;
    }
    Utils.presentProfileModal(this.modalCtrl, StaffEditComponent, {})
  }

  public edit(staff : Staff) {
    if (!this.currentUserIs(staff.username) && !this.currentUserIsAdmin()) {
      Utils.presentInvalidEntryAlert(this.alertCtrl, "You can only edit your own data!");
      return;
    }
    Utils.presentProfileModal(this.modalCtrl, StaffEditComponent, {staffMember: staff});
  }

  public delete(staffMember: Staff) {
    if (!this.currentUserIsAdmin()) {
      Utils.presentInvalidEntryAlert(this.alertCtrl, "Only administrators can delete users");
      return;
    }
    Utils.showLoadingBar();
    this.staffSvc.delete(staffMember.username)
      .then((deleted: boolean) : void => {
        if (deleted) {
          this.staffList = this.staffList.filter((el: Staff) => {
            return el.username != staffMember.username
          });
          Utils.presentTopToast(this.toastCtrl, "Deleted", 3000)
        }
      })
      .catch((err) => Utils.presentTopToast(this.toastCtrl, err || "Could not delete staff member", 3000))
  }

  //TODO Fix this.
  private currentUserIsAdmin() : boolean {
    let loggedInUser : string = this.tokenProvider.getUserName();
    let admins : Staff[] = this.staffList.filter((staff) => {
      return staff.role == "ADMIN" && staff.username == loggedInUser;
    })
    if (admins && admins.length == 1) {
      return true;
    }
    return false;
  }

  private listenToUpdatesAndRefresh() {
    this.staffSvc.onUpdate.subscribe(()=>this.getStaffList());
    this.staffSvc.onDelete.subscribe(()=>this.getStaffList());
    this.staffSvc.onCreate.subscribe(()=>this.getStaffList());
  }

  private getStaffList() {
    this.staffSvc.list()
      .then((staffMap: Staff[]) =>
        this.staffList = staffMap
      )
      .catch(err => {
        Utils.presentTopToast(this.toastCtrl, err || "Could not get staff list!");
        Utils.error("StaffComponnet.getStaffList(): {0}", err);
      });
  }

  private currentUserIs(username: string) {
    return this.tokenProvider.getUserName() == username;
  }
}
