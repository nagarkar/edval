import { Account } from '../account';
import {Observable} from "rxjs";

export interface InterfaceAccountService {
  getAccount(): Promise<Account>;
  saveAccount(company:Account) : Promise<boolean>;
}
