import {Config} from "../../shared/config";
import {Utils} from "../../shared/stuff/utils";
export class Staff {

  constructor () {
    this.properties = this.properties || { title: "Dr."};
  }

  customerId: string;
  username: string;
  role: string;
  entityStatus:string;
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
    return [this.properties.title, this.properties.firstName, this.properties.lastName].join(' ');
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
