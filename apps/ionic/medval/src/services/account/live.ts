import {Injectable} from '@angular/core';

import { Account } from './schema';
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService, AuthResult} from "../../shared/aws/access.token.service";
import {HttpClient} from "../../shared/stuff/http.client";
import {AbstractService} from "../../shared/service/abstract.service";
import {ErrorType} from "../../shared/stuff/error.types";

@Injectable()
export class LiveAccountService extends AbstractService<Account> {

  constructor(
    utils : Utils,
    httpClient: HttpClient,
    accessProvider: AccessTokenService) {

    super(utils, httpClient, accessProvider);
    Utils.log("created account account");
  }

  getPath(): string {
    return "/api/customers";
  }

  getId(member: Account): string {
    return member.customerId;
  }
}
