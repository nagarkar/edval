/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Injectable} from "@angular/core";
import {Account} from "./schema";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {AbstractService} from "../../shared/service/abstract.service";
import {Http} from "@angular/http";
import {Config} from "../../shared/config";

@Injectable()
export class LiveAccountService extends AbstractService<Account> {

  constructor(
    http: Http,
    accessProvider: AccessTokenService) {

    super(accessProvider, http, Account);
  }

  getPath(): string {
    return "/api/customers";
  }

  getId(member: Account): string {
    return member.customerId;
  }

  reset() {
    this.clearCache();
    this.get(Config.CUSTOMERID);
  }

}
