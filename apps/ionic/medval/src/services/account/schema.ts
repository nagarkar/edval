import {Utils} from "../../shared/stuff/utils";

export class Role {
  roleId: string;
  roleName: string;
}
export class Account {

  customerId: string;
  properties : {
    accountName?: string,
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
    }
  };
  configuration?: {
    [key: string] : string
  }

  constructor() {
    this.properties = {
      accountName: "",
      contactName: '',
      logo: '',
      address: {}
    };
    this.configuration = {};
  }

  toString() {
    return Utils.stringify(this);
  }

  getStandardRoles(): Role[] {
    let roles: Role[] = [];
    if (!this.configuration["STANDARD_ROLES"]) {
      return roles;
    }
    let parsedRoles = JSON.parse(this.configuration["STANDARD_ROLES"]);
    if (Array.isArray(parsedRoles)) {
      roles = (parsedRoles as Array<Role>).map((role: any) => {
        return Object.assign<Role, any>(new Role(), role);
      })
    } else {
      roles = [Object.assign<Role, any>(new Role(), parsedRoles)];
    }
    return roles;
  }
}
