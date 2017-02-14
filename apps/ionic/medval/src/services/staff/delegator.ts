/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
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

  getStaffNamesInListForRole(staffList: Staff[], role: string) : string {
    let staffNames: string;
    let staffListIntermediate: Staff[];
    if (staffList && role) {
      staffListIntermediate = this.filterStaffByRole(staffList, role);
    }
    if (!staffListIntermediate || staffListIntermediate.length == 0 && role) {
      staffListIntermediate = this.getStaffByRole(role);
    }
    if (!staffListIntermediate && staffListIntermediate.length == 0 && staffList) {
      staffListIntermediate = staffList;
    }
    return this.getFirstNames(staffListIntermediate);
  }

  filterStaffByRole(staffList: Staff[], role: string) : Staff[]{
    return staffList.filter((staff: Staff) => {
      return staff.role == role;
    })
  }

  getStaffByRole(role: string) : Staff[]{
    let staffList: Staff[] = this.listCached();
    return staffList.filter((staff: Staff) => {
      return staff.role == role;
    })
  }

  private getFirstNames(staffList?: Staff[]): string {
    if (!staffList) {
      return null;
    }
    let names =  staffList.map((staff: Staff)=>{
      return staff.properties.firstName;
    })
    return this.truncate(names);
  }

  truncate(names: string[]): string {
    if (names.length > 0 && names.length < 4) {
      return names.join(', ');
    } else if (names.length >= 4) {
      return names.slice(0, 2).join(", ") + "...";
    }
    return undefined;
  }

  getRoleUserNameMap() : Map<string, Set<string>> {
    let map: Map<string, Set<string>> = new Map<string, Set<string>>();
    let ret = this.listCached().forEach((staff: Staff) => {
      if (!map.has(staff.role)) {
        map.set(staff.role, new Set<string>());
      }
      map.get(staff.role).add(staff.username);
    });
    return map;
  }
}
