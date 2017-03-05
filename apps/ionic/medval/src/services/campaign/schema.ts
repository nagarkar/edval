/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Config} from "../../shared/config";
import {Type} from "class-transformer";

export class Campaign {

  static DEFAULT_CAMPAIGN_ID: string = "default";
  customerId: string;
  campaignId: string;
  softwareVersion: string = Config.SOFTWARE_VERSION;

  @Type(() => CampaignProperties)
  properties: CampaignProperties = new CampaignProperties();

  constructor() {
    this.customerId = Config.CUSTOMERID;
    this.softwareVersion = Config.SOFTWARE_VERSION;
  }
}

export class CampaignProperties {
  startDate?: number;
  endDate?: number;
  firstSessionId?: number;
  lastSessionId?: number;
  name: string;                             // Short display name (< 20 chars)
  goals?: string[];                         // Description of goals.
  roles?: string[];                         // List of roles we are trying to target.
  staff?: string[];                         // List of staff we are trying to target
  metrics?: string[];                       // List of Metric Ids we expect to be impacted.
  timeToAffectChange?: MeasurementWindow;   // How long is it expected to affect change?
}

export enum MeasurementWindow {
  Quarter, Month, Week
}
