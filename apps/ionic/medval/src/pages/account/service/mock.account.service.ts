import {Injectable, Inject} from '@angular/core';

import { Account } from '../account';
import {Utils} from "../../../shared/stuff/utils";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {ErrorType} from "../../../shared/stuff/error.types";
import {AbstractService} from "../../../shared/stuff/abstract.service";
import {Config} from "../../../shared/aws/config";
import {InterfaceAccountService} from "./interface.account.service";
import {Observable} from "rxjs";

@Injectable()
export class MockAccountService extends AbstractService implements InterfaceAccountService {

  private static MOCK_CUSTOMER : Account =  {
    customerId: Config.CUSTOMERID,
    properties: {
      logo: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTUobvzZgwqeFcJ9Y2d_Q58AL8n_FHMB1J49yjnpYFdxtDt1Xyf",
      customerName: "Dr. Nagarkar"
    }
  };

  constructor(
    @Inject(Utils) private utils,
    @Inject(AccessTokenService) protected accessProvider) {

    super(accessProvider);
    this.utils.log("created account service");
  }

  getAccount(): Promise<Account> {
    if (super.checkGate()) {
      //return Observable.throw(ErrorType.NotLoggedIn);
      return Promise.reject(ErrorType.NotLoggedIn);
    }
    return Promise.resolve(MockAccountService.MOCK_CUSTOMER);
  }

  saveAccount(company:Account) : Promise<boolean> {
    return new Promise((resolve, reject) => {
      MockAccountService.MOCK_CUSTOMER = company;
      resolve(true);
    });
  }
}
