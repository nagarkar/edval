import { Account } from '../account';

export interface InterfaceAccountService {
  getAccount(): Promise<Account>;
  saveAccount(company:Account) : Promise<boolean>;
}
