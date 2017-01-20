import {Injectable} from "@angular/core";
import {Account} from "./schema";
import {DelegatingService} from "../../shared/service/delegating.service";
import {MockAccountService} from "./mock";
import {LiveAccountService} from "./live";
import {RegisterService} from "../service.factory";
import {Utils} from "../../shared/stuff/utils";

@Injectable()
@RegisterService
export class AccountService extends DelegatingService<Account> {

  constructor(
    mockService: MockAccountService,
    liveService: LiveAccountService) {

    super(mockService, liveService, Account);
  }

  getId(member: Account): string {
    return member.customerId;
  }

  listCached(): Account[] {
    throw Utils.unsupportedOperationError("listCached", this);
  }

  list(): Promise<Account[]> {
    return Promise.reject<Account[]>(Utils.unsupportedOperationError("list", this));
  }

  create(TMember: Account): Promise<Account> {
    return Promise.reject<Account>(Utils.unsupportedOperationError("create", this));
  }

  delete(id: string): Promise<void> {
    return Promise.reject<void>(Utils.unsupportedOperationError("delete", this));
  }

}
