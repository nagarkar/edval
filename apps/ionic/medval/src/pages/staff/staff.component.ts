/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Component} from "@angular/core";
import {NavController, ModalController, ToastController, AlertController} from "ionic-angular";
import {Staff} from "../../services/staff/schema";
import {Utils} from "../../shared/stuff/utils";
import {StaffService} from "../../services/staff/delegator";
import {AdminComponent} from "../admin.component";
import {StaffEditComponent} from "./staff.edit.component";

@Component({
  templateUrl: './staff.component.html'
})
export class StaffComponent extends AdminComponent  {

  // Dummy staff and staff member to avoid blowing up the view on startup.
  public staffList: Staff[] = [Staff.newStaffMember()];

  constructor(
    navCtrl: NavController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private staffSvc : StaffService) {

    super(navCtrl);
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
    Utils.push(this.navCtrl, StaffEditComponent, {}).then(()=>{
      this.getStaffList();
    });
  }

  public edit(staff : Staff) {
    Utils.push(this.navCtrl, StaffEditComponent, {staffMember: staff}).then(()=>{
      this.getStaffList();
    });
  }

  public delete(staffMember: Staff) {
    Utils.presentProceedCancelPrompt(this.alertCtrl, ()=> {
      Utils.showLoadingBar();
      this.staffSvc.delete(staffMember.username)
        .then(() => {
          this.getStaffList();
          Utils.presentTopToast(this.toastCtrl, "Deleted", 3000)
        })
        .catch((err) => Utils.presentTopToast(this.toastCtrl, err || "Could not delete staff member", 3000))
    }, "You can't undo this action")

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
}
