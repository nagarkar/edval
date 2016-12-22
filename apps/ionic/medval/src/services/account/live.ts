import {Injectable} from '@angular/core';

import { Account } from './schema';
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {AbstractService} from "../../shared/service/abstract.service";
import {Http} from "@angular/http";
import {Config} from "../../shared/aws/config";

@Injectable()
export class LiveAccountService extends AbstractService<Account> {

  constructor(
    utils : Utils,
    http: Http,
    accessProvider: AccessTokenService) {

    super(utils, accessProvider, http, new Account());
    Utils.log("created account account");
  }

  getPath(): string {
    return "/api/customers";
  }

  getId(member: Account): string {
    return member.customerId;
  }

  reset() {
    super.reset();
    this.get(Config.CUSTOMERID);
  }

}
