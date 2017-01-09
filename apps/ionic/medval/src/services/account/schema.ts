import {Utils} from "../../shared/stuff/utils";

export class Account {

  customerId: string;
  lockingVersion: string;
  properties : {
    verticalId?: string,
    customerName?: string,
    contactName?: string,
    logo?: string,
    address: {
      street1?: string;
      street2?: string;
      pobox?:string;
      zip?: string;
      city?:string;
      state?:string;
      country?: string;
    },
    configuration?: {
      [key: string] : string
    }
  };


  constructor() {
    this.properties = {
      customerName: "",
      contactName: '',
      logo: '',
      address: {}
    };
    this.properties.configuration = {};
  }

  toString() {
    return Utils.stringify(this);
  }

  getStandardRoles(): string[] {
    let roles: string[] = [];
    if (!this.properties.configuration["STANDARD_ROLES"]) {
      return roles;
    }
    return roles;
  }
}
