import {Injectable} from "@angular/core";
import {Account} from "./schema";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {AbstractService} from "../../shared/service/abstract.service";
import {Http} from "@angular/http";
import {Config} from "../../shared/config";

@Injectable()
export class LiveAccountService extends AbstractService<Account> {

  constructor(
    http: Http,
    accessProvider: AccessTokenService) {

    super(accessProvider, http, Account);
  }

  getPath(): string {
    return "/api/customers";
  }

  getId(member: Account): string {
    return member.customerId;
  }

  reset() {
    this.clearCache();
    this.get(Config.CUSTOMERID);
  }

}
