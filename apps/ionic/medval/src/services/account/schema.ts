import {Utils} from "../../shared/stuff/utils";

export class Role {
  roleId: string;
  roleName: string;
}
export class Account {

  customerId: string;
  properties : {
    customerName: string,
    contactName: string,
    logo: string
  };
  configuration?: {
    [key: string] : string
  }

  constructor() {
    this.properties = {
      customerName: "",
      contactName: '',
      logo: ''
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
