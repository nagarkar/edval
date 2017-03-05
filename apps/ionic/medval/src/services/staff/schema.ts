/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Config} from "../../shared/config";
import {Utils} from "../../shared/stuff/utils";
export class Staff {

  constructor () {
    this.properties = this.properties || { title: "Dr."};
    this.softwareVersion = Config.SOFTWARE_VERSION;
  }

  customerId: string;
  username: string;
  role: string;
  entityStatus:string;
  softwareVersion: string = Config.SOFTWARE_VERSION;
  properties: {
    title?: string;
    firstName?: string;
    lastName?: string;
    sex?: string;
    photoUrl?: string;
    email?: string;
    phoneNumber?: string;
  }

  posessivePronoun() {
    if(this.properties.sex == "male") {
      return "his";
    } else {
      return "her";
    }
  }

  personalPronoun (midSentence: boolean) {
    if (this.properties.sex == "male") {
      return midSentence ? "he" : "He";
    } else {
      return midSentence ? "she" : "She";
    }
  }
  toString() {
    return Utils.stringify(this);
  }

  get displayName(): string {
    return [this.properties.title, this.properties.firstName].join(' ');
  }

  public static getUsernames(staffSet: Set<Staff>): string[] {
    let usernames: string[] = [];
    staffSet.forEach((value: Staff)=>{
      usernames.push(value.username);
    })
    return usernames;
  }

  public static newStaffMember() {
    return Object.assign(new Staff(), {
      customerId: Config.CUSTOMERID,
      username: "",
      entityStatus: "",
      role: "",
      properties: {
        firstName: "",
        lastName: "",
        email: "",
        photoUrl: ""
      }
    });
  }
}

export interface StaffMap {[s: string]: Staff};
