import {Component, Inject, OnInit} from '@angular/core';

import {ActionSheetController, AlertController, Alert} from 'ionic-angular';
import {CameraImageSelector} from "../../shared/stuff/camera.imageselector";
import {StaffService} from "./service/mock.staff.service";
import {Staff } from "./staff";
import {Logger} from "../../shared/logger.service";
import {InputBase} from "ionic-angular/components/input/input-base";
import {ComponentUtils} from "../../shared/stuff/component.utils";

@Component({
  templateUrl: 'staff.component.html',
  providers: [ StaffService ]
})
export class StaffComponent implements OnInit  {
  public message: string;
  // Dummy staff and staff member to avoid blowing up the view on startup.
  public staffList: Staff[] = [this.newStaffMember()];
  public staffMember: Staff = this.newStaffMember();

  constructor(
    @Inject(Logger) private logger,
    @Inject(StaffService) private staffSvc,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private cameraImageSelector: CameraImageSelector
  ) { }

  ngOnInit(): void {
    this.staffSvc.listStaff()
      .then((staffMap: Staff[]) =>
        this.staffList = staffMap
      )
      .catch(err => {
        this.message = err;
        this.logger.log(err)
      });
  }

  public focusOn(element: InputBase) {
    element.setFocus();
  }

  public collectUrl() {
    ComponentUtils.collectUrl(
      this.actionSheetCtrl,
      this.alertCtrl,
      this.cameraImageSelector,
      (value) => {
        this.staffMember.imageUrl = value;
      });
  }

  public add() {
    if (!this.validateNewStaff()) {
      return;
    }
    StaffComponent.addStaffIdIfNecessary(this.staffMember, this.staffList);
    this.staffSvc.updateStaff(this.staffMember)
      .then((staffList : Staff[]) => {
        this.staffList = staffList
        this.staffMember = this.newStaffMember();
      })
      .catch(this.errorMessage());
  }

  public edit(staff : Staff) {
    this.staffMember = JSON.parse(JSON.stringify(staff));
  }

  public delete(staffMember: Staff) {
    ComponentUtils.showLoadingBar();
    this.staffSvc.deleteStaff(staffMember)
      .then((staffMap: Staff[]) : void => {
        this.staffList = staffMap;
      })
      .catch(this.errorMessage())
  }

  private assign()  {
    return (staffMap: Staff[]) : void => {
      this.staffList = staffMap;
    }
  }

  private errorMessage() {
    return (err) : void => {
      window.alert("Errro while saving staff: " + err);
    }
  }

  private hideMessage() {
    setTimeout(() => this.message = '', 2000);
  }

  private static addStaffIdIfNecessary(staff: Staff, staffList: Staff[]) {
    if (staff.id === null || staff.id === '') {
      staff.id = this.getRandomId(staffList);
    }
  }

  private static getRandomId(staffList : Staff[]) : string {
    let count : number = 0;
    let id: string = "id" + count;
    while (staffList.find((value, index, arr) => {return value.id === id})) {
      count++;
      id = "id" + count;
    }
    return id;
  }

  private newStaffMember() {
    return {
      id: '',
      name: '',
      email: '',
      imageUrl: '',
      role: ''
    };
  }

  private validateNewStaff() : boolean {
    let s = this.staffMember;
    let isValid : boolean =
      s.email && s.email.length > 0 &&
      s.name && s.name.length > 0 &&
      s.imageUrl && s.imageUrl.length > 0 &&
      s.role && s.role.length > 0;
    if (!isValid) {
      this.presentInvalidEntryAlert("Please provide all values");
    }
    return isValid;
  }

  private presentInvalidEntryAlert(message: string) {
    let alert : Alert = this.alertCtrl.create({
      title: 'Invalid Entry',
      subTitle: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
