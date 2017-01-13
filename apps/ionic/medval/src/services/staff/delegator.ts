import {Injectable} from "@angular/core";
import {MockStaffService} from "./mock";
import {Staff} from "./schema";
import {LiveStaffService} from "./live";
import {DelegatingService} from "../../shared/service/delegating.service";
import {RegisterService} from "../service.factory";

@Injectable()
@RegisterService
export class StaffService extends DelegatingService<Staff> {
  constructor(
    mockService: MockStaffService,
    liveService: LiveStaffService) {

    super(mockService, liveService, Staff);
  }

  getId(member: Staff): string {
    return member.username;
  }

  getOnly(role: string): Staff {
    let ret = this.listCached().filter((staff: Staff) => {
      return staff.role == role;
    });
    if (ret.length == 1) {
      return ret[0];
    }
    return null;
  }

  getStaffFirstNamesInRole(role: string) : string {
    let ret = this.listCached().filter((staff: Staff) => {
      return staff.role == role;
    }).map((staff: Staff)=> {
      return staff.properties.firstName
    });
    if (ret.length > 0 && ret.length < 4) {
      return ret.join(', ');
    } else if (ret.length >= 4) {
      return ret.slice(0, 3).join(", ");
    }
    return null;
  }
}
