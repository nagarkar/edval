import {Injectable} from '@angular/core';

import { Account } from '../account';
import {AWSConfig} from "../../../shared/aws/config";
import {MockAccountService} from "./mock.account.service";
import {LiveAccountService} from "./live.account.service";
import {InterfaceAccountService} from "./interface.account.service";

@Injectable()
export class AccountService implements InterfaceAccountService {

  private delegate : InterfaceAccountService;

  constructor(
    private mockService: MockAccountService,
    private liveService: LiveAccountService) {

    if (AWSConfig.isMockData()) {
      this.delegate = mockService;
    } else {
      this.delegate = liveService;
    }
  }

  getAccount(): Promise<Account> {
    return this.delegate.getAccount();
  }

  saveAccount(account:Account) : Promise<boolean> {
    return this.delegate.saveAccount(account);
  }
}
