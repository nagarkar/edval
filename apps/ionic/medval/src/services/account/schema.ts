/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Utils} from "../../shared/stuff/utils";
import {Config} from "../../shared/config";
import {ValidationService} from "../../shared/components/validation/validation.service";

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
  SPEAK_GREETING: boolean;
  SPEAK_GREETING_RATE: number;
  CHIME_INTERVAL: number;
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

  static ORTHODONTIC_CLINIC: string = "OrthodonticClinic";

  static StandardConfiguration: any = {
    OrthodonticClinic: {
      STANDARD_ROLES: "Orthodontic Assistant,DDS,FrontOffice",
      SWEEPSTAKES_INTERVAL:1,
      SWEEPSTAKES_SHOW_WHEEL: false,
      SWEEPSTAKES_AWARD_AMOUNT: 5,
      SWEEPSTAKES_COST_PER_USE: 1,
      SHOW_JOKES_ON_THANK_YOU_PAGE: true,
      SPEAK_GREETING: false,
      SPEAK_GREETING_RATE: undefined,
      CHIME_INTERVAL: 1
    },
  }

  cleanupConfiguration(): string {
    let config: AccountConfiguration = this.properties.configuration;
    if (!config) {
      return;
    }
    let errors = [];
    if (config.REVIEW_URL_FACEBOOK && !ValidationService.urlValidator.test(config.REVIEW_URL_FACEBOOK)){
      errors.push("The Facebook URL is invalid");
      config.REVIEW_URL_FACEBOOK = undefined;
    }
    if (config.REVIEW_URL_GOOGLE && !ValidationService.urlValidator.test(config.REVIEW_URL_GOOGLE)){
      errors.push("The Google URL is invalid");
      config.REVIEW_URL_GOOGLE = undefined;
    }
    if (config.REVIEW_URL_YELP && !ValidationService.urlValidator.test(config.REVIEW_URL_YELP)){
      errors.push("The Yelp URL is invalid");
      config.REVIEW_URL_YELP = undefined;
    }
    if(config.SPEAK_GREETING_RATE && config.SPEAK_GREETING_RATE > 2) {
      errors.push("The Voice Speed should not exceed 2");
      config.SPEAK_GREETING_RATE = 1.1;
    }
    if(config.CHIME_INTERVAL && (config.CHIME_INTERVAL < .1 || config.CHIME_INTERVAL > 100)) {
      errors.push("The Chime Interval is between .1 and 100 (minutes)");
      config.CHIME_INTERVAL = 1;
    }
    if (errors.length == 0) {
      return null;
    }
    return errors.join("\n");
  }

}
