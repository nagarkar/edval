import {Config} from "../../shared/aws/config";
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
    photoUrl?: string;
    email?: string;
    phoneNumber?: string;
  }

  toString() {
    return Utils.stringify(this);
  }

  get displayName(): string {
    return [this.properties.title, this.properties.firstName, this.properties.lastName].join(' ');
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
