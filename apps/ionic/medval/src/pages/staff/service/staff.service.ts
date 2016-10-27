import {Injectable} from '@angular/core';

import {AWSConfig} from "../../../shared/aws/config";
import {InterfaceStaffService} from "./interface.staff.service";
import {MockStaffService} from "./mock.staff.service";
import {Staff} from "../staff";
import {LiveStaffService} from "./live.staff.service";

@Injectable()
export class StaffService implements InterfaceStaffService {

  private delegate : InterfaceStaffService;

  constructor(
    private mockService: MockStaffService,
    private liveService: LiveStaffService) {

    if (AWSConfig.isMockData()) {
      this.delegate = mockService;
    } else {
      this.delegate = liveService;
    }
  }

  listStaff(): Promise<Staff[]> {
    return this.delegate.listStaff();
  }

  saveStaff(staffMember: Staff): Promise<Staff[]> {
    return this.delegate.updateStaff(staffMember);
  }

  deleteStaff(staffMember: Staff): Promise<boolean> {
    return this.delegate.deleteStaff(staffMember);
  }

}
