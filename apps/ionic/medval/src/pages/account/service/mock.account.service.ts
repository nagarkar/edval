import {Injectable, Inject} from '@angular/core';

import { Account } from '../account';
import {Logger} from "../../../shared/logger.service";
import {AccessTokenProvider} from "../../../shared/aws/access.token.service";
import {ErrorType} from "../../../shared/stuff/error.types";
import {HttpClient} from "../../../shared/stuff/http.client";
import {AbstractService} from "../../../shared/stuff/abstract.service";
import {AWSConfig} from "../../../shared/aws/config";
import {InterfaceAccountService} from "./interface.account.service";

@Injectable()
export class MockAccountService extends AbstractService implements InterfaceAccountService {

  private static MOCK_CUSTOMER : Account =  {
    customerId: AWSConfig.CUSTOMERID,
    properties: {
      logo: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTUobvzZgwqeFcJ9Y2d_Q58AL8n_FHMB1J49yjnpYFdxtDt1Xyf",
      customerName: "Dr. Nagarkar"
    }
  };

  constructor(
    @Inject(Logger) private logger,
    @Inject(AccessTokenProvider) protected accessProvider) {

    super(accessProvider);
    this.logger.log("created account service)");
  }

  getAccount(): Promise<Account> {
    if (super.checkGate()) {
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
