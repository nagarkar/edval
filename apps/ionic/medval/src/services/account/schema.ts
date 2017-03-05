/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Utils} from "../../shared/stuff/utils";
import {Config} from "../../shared/config";

export interface AccountConfiguration {
  STANDARD_ROLES: string;
  SWEEPSTAKES_INTERVAL: number;
  SWEEPSTAKES_SHOW_WHEEL: boolean;
  SWEEPSTAKES_AWARD_AMOUNT: number;
  SWEEPSTAKES_COST_PER_USE: number;
  SHOW_JOKES_ON_THANK_YOU_PAGE: boolean;
  REVIEW_URL_FACEBOOK?: string; // url
  REVIEW_URL_GOOGLE?: string;   // url
  REVIEW_URL_YELP?: string;     // url
}

export class Account {

  customerId: string;
  softwareVersion: string = Config.SOFTWARE_VERSION;
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
    configuration?: AccountConfiguration
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
    this.softwareVersion = Config.SOFTWARE_VERSION;
  }

  toString() {
    return Utils.stringify(this);
  }

  getStandardRoles(): string[] {
    if (!this.properties.configuration.STANDARD_ROLES) {
      this.properties.configuration = Account.StandardConfiguration[this.properties.verticalId];
    }
    return this.properties.configuration.STANDARD_ROLES.split(',');
  }

  isInvalid() {
    let nou = Utils.nullOrEmptyString;
    return nou(this.customerId) ||
      nou(this.properties.customerName) ||
      nou(this.properties.verticalId);
  }

  static ORTHODONTIC_CLINIC: string = "OrthodonticClinic";

  static StandardConfiguration: any = {
    OrthodonticClinic: {
      STANDARD_ROLES: "Orthodontic Assistant,DDS,FrontOffice",
      SWEEPSTAKES_INTERVAL:1,
      SWEEPSTAKES_SHOW_WHEEL: false,
      SWEEPSTAKES_AWARD_AMOUNT: 5,
      SWEEPSTAKES_COST_PER_USE: 1,
      SHOW_JOKES_ON_THANK_YOU_PAGE: true,
    },
  }
}
