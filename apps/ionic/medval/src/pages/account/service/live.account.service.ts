import {Injectable} from '@angular/core';

import { Account } from '../account';
import {Utils} from "../../../shared/stuff/utils";
import {AccessTokenService, AuthResult} from "../../../shared/aws/access.token.service";
import {HttpClient} from "../../../shared/stuff/http.client";
import {AbstractService} from "../../../shared/stuff/abstract.service";
import {Config} from "../../../shared/aws/config";
import {InterfaceAccountService} from "./interface.account.service";
import {Http, Response, RequestOptionsArgs, Headers} from "@angular/http";
import {ErrorType} from "../../../shared/stuff/error.types";
import {Observable} from "rxjs";
import {ErrorObservable} from "rxjs/observable/ErrorObservable";

@Injectable()
export class LiveAccountService extends AbstractService implements InterfaceAccountService {

  private static URL : string = "/api/customers";

  constructor(
    private utils : Utils,
    private httpClient: HttpClient,
    private http: Http,
    protected accessProvider: AccessTokenService) {

    super(accessProvider);
    this.utils.log("created account service");
  }

  getAccount(): Promise<Account> {
    super.checkGate();
    return this.httpClient.get<Account>(LiveAccountService.URL, Config.CUSTOMERID);
  }

  saveAccount(account: Account) : Promise<boolean> {
    super.checkGate();
    return this.httpClient.put(LiveAccountService.URL, Config.CUSTOMERID, account);
  }

  private createRequestOptionsArgs() : RequestOptionsArgs {
    if (!this.accessProvider.getAuthResult()) {
      return Observable.throw(ErrorType.NotLoggedIn);
    }
    let result : AuthResult = this.accessProvider.getAuthResult();
    return {
      headers: new Headers({
        'X-AccessToken': result.accessToken,
        'X-IdToken': result.idToken,
        'Content-Type': "application/json",
        'Accept': 'application/json'
        //'Access-Control-Request-Headers': 'X-AccessToken, X-IdToken, Content-Type',
        //'Access-Control-Request-Method': method
      })
    }
  }
}
