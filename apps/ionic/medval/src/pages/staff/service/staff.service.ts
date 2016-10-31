import {Injectable} from '@angular/core';

import {Config} from "../../../shared/aws/config";
import {InterfaceStaffService} from "./interface.staff.service";
import {MockStaffService} from "./mock.staff.service";
import {Staff} from "../staff";
import {LiveStaffService} from "./live.staff.service";
import {EventEmitter} from "@angular/common/src/facade/async";

@Injectable()
export class StaffService implements InterfaceStaffService {

  onCreate: EventEmitter<Staff>;
  onUpdate: EventEmitter<Staff>;
  onDelete: EventEmitter<Staff>;

  private delegate : InterfaceStaffService;

  constructor(
    private mockService: MockStaffService,
    private liveService: LiveStaffService) {

    if (Config.isMockData()) {
      this.delegate = mockService;
    } else {
      this.delegate = liveService;
    }
    this.delegateEventEmitters();
  }

  listStaff(): Promise<Staff[]> {
    return this.delegate.listStaff();
  }

  createStaff(staffMember: Staff): Promise<Staff> {
    return this.delegate.createStaff(staffMember);
  }

  updateStaff(staffMember: Staff): Promise<Staff> {
    return this.delegate.updateStaff(staffMember);
  }

  deleteStaff(staffMember: Staff): Promise<boolean> {
    return this.delegate.deleteStaff(staffMember);
  }

  private delegateEventEmitters() {
    this.onCreate = this.delegate.onCreate;
    this.onDelete = this.delegate.onDelete;
    this.onUpdate = this.delegate.onUpdate;
  }
}
