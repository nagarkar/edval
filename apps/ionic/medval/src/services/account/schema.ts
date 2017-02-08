/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
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
      address: {},
      verticalId: Account.ORTHODONTIC_CLINIC
    };
    this.properties.configuration = Account.StandardConfiguration[this.properties.verticalId];
  }

  toString() {
    return Utils.stringify(this);
  }

  getStandardRoles(): string[] {
    if (!this.properties.configuration["STANDARD_ROLES"]) {
      this.properties.configuration = Account.StandardConfiguration[this.properties.verticalId];
    }
    return this.properties.configuration["STANDARD_ROLES"].split(',');
  }

  isInvalid() {
    let nou = Utils.nullOrEmptyString;
    return nou(this.customerId) ||
      nou(this.properties.customerName) ||
      nou(this.properties.verticalId);
  }

  static ORTHODONTIC_CLINIC: string = "OrthodonticClinic";

  static StandardConfiguration: any = {
    'OrthodonticClinic': {
      STANDARD_ROLES: "Orthodontic Assistant,DDS,FrontOffice"
    }
  }
}
