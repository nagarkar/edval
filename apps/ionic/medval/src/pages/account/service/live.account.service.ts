import {Injectable} from '@angular/core';

import { Account } from '../account';
import {Logger} from "../../../shared/logger.service";
import {AccessTokenProvider} from "../../../shared/aws/access.token.service";
import {HttpClient} from "../../../shared/stuff/http.client";
import {AbstractService} from "../../../shared/stuff/abstract.service";
import {AWSConfig} from "../../../shared/aws/config";
import {InterfaceAccountService} from "./interface.account.service";

@Injectable()
export class LiveAccountService extends AbstractService implements InterfaceAccountService {

  private account : Account;
  private static URL : string = "/api/customers";

  constructor(
    private logger : Logger,
    private httpClient: HttpClient<Account>,
    protected accessProvider: AccessTokenProvider) {

    super(accessProvider);
    this.logger.log("created account service)");
  }

  getAccount(): Promise<Account> {
    super.checkGate();
    return this.httpClient.get(LiveAccountService.URL, "/" + AWSConfig.CUSTOMERID);
  }

  saveAccount(account: Account) : Promise<boolean> {
    super.checkGate();
    return this.httpClient.put(LiveAccountService.URL, "/" + AWSConfig.CUSTOMERID, account);
  }
}
