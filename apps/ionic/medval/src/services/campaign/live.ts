import {AbstractService} from "../../shared/service/abstract.service";
import {Campaign} from "./schema";
import {Config} from "../../shared/config";
import {Utils} from "../../shared/stuff/utils";
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
    Utils.log("Created LiveCampaignService: " + typeof this);
  }

  getId(member: Campaign): string {
    return member.campaignId;
  }

  getPath(): string {
    return "/api/customers" + "/" + Config.CUSTOMERID + "/campaign";
  }
}
