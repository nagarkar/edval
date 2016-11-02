import {Component} from '@angular/core';

import {NavController} from 'ionic-angular';
import {Staff } from "../../services/staff/schema";
import {Utils} from "../../shared/stuff/utils";
import {StaffService} from "../../services/staff/delegator";
import {MedvalComponent} from "../../shared/stuff/medval.component";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {StaffEditComponent} from "./staff.edit.component";

@Component({
  templateUrl: 'staff.component.html',
  providers: [ ]
})
export class StaffComponent extends MedvalComponent  {

  // Dummy staff and staff member to avoid blowing up the view on startup.
  public staffList: Staff[] = [Staff.newStaffMember()];

  constructor(
    protected tokenProvider: AccessTokenService,
    public navCtrl: NavController,
    protected utils: Utils,
    private staffSvc : StaffService) {

    super(tokenProvider, navCtrl, utils);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.listenToUpdatesAndRefresh();
    this.getStaffList();
  }

  public cancel() {
    this.utils.pop(this.navCtrl);
  }

  public add() {
    if (!this.currentUserIsAdmin()) {
      this.utils.presentInvalidEntryAlert("Only administrators can add users");
      return;
    }
    this.utils.presentProfileModal(StaffEditComponent, {})
  }

  public edit(staff : Staff) {
    if (!this.currentUserIs(staff.username) && !this.currentUserIsAdmin()) {
      this.utils.presentInvalidEntryAlert("You can only edit your own data!");
      return;
    }
    this.utils.presentProfileModal(StaffEditComponent, {staffMember: staff});
  }

  public delete(staffMember: Staff) {
    if (!this.currentUserIsAdmin()) {
      this.utils.presentInvalidEntryAlert("Only administrators can delete users");
      return;
    }
    this.utils.showLoadingBar();
    this.staffSvc.delete(staffMember)
      .then((deleted: boolean) : void => {
        if (deleted) {
          this.staffList = this.staffList.filter((el: Staff) => {
            return el.username != staffMember.username
          });
          this.utils.presentTopToast("Deleted", 3000)
        }
      })
      .catch((err) => this.utils.presentTopToast(err || "Could not delete staff member", 3000))
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
        this.utils.presentTopToast(err || "Could not get staff list!");
        this.utils.log(err)
      });
  }

  private currentUserIs(username: string) {
    return this.tokenProvider.getUserName() == username;
  }
}
