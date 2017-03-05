/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {AbstractService} from "../../shared/service/abstract.service";
import {Campaign} from "./schema";
import {Config} from "../../shared/config";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
/**
 * Created by chinmay on 10/31/16.
 */
@Injectable()
export class LiveCampaignService extends AbstractService<Campaign> {

  constructor(
    http: Http,
    accessProvider: AccessTokenService) {

    super(accessProvider, http, Campaign);
  }

  getId(member: Campaign): string {
    return member.campaignId;
  }

  getPath(): string {
    return "/api/customers" + "/" + Config.CUSTOMERID + "/campaign";
  }
}
