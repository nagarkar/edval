import {Config} from "../../shared/aws/config";
export class Staff {

  constructor () {
    this.properties = this.properties || { title: "Dr."};
  }

  customerId: string;
  username: string;
  role: string;
  entityStatus:string;

  public properties: {
    title?: string;
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
    email?: string;
    phoneNumber?: string;
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
