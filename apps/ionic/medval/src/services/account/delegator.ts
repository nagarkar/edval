import {Injectable} from "@angular/core";
import {Account} from "./schema";
import {DelegatingService} from "../../shared/service/delegating.service";
import {MockAccountService} from "./mock";
import {LiveAccountService} from "./live";
import {ErrorType} from "../../shared/stuff/error.types";
import {RegisterService} from "../service.factory";

@Injectable()
@RegisterService
export class AccountService extends DelegatingService<Account> {

  constructor(
    mockService: MockAccountService,
    liveService: LiveAccountService) {

    super(mockService, liveService);
  }

  getId(member: Account): string {
    return member.customerId;
  }

  list(): Promise<Account[]> {
    return Promise.reject<Account[]>(ErrorType.UnsupportedOperation("list"));
  }

  create(TMember: Account): Promise<Account> {
    return Promise.reject<Account>(ErrorType.UnsupportedOperation("create"));
  }

  delete(id: string): Promise<void> {
    return Promise.reject<void>(ErrorType.UnsupportedOperation("delete"));
  }
}
