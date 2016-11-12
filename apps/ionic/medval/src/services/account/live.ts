import {Injectable} from '@angular/core';

import { Account } from './schema';
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService, AuthResult} from "../../shared/aws/access.token.service";
import {HttpClient} from "../../shared/stuff/http.client";
import {AbstractService} from "../../shared/service/abstract.service";
import {ErrorType} from "../../shared/stuff/error.types";
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
