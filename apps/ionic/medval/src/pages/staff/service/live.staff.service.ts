import {Injectable, Inject} from '@angular/core';

import {Logger} from "../../../shared/logger.service";
import {AccessTokenProvider} from "../../../shared/aws/access.token.service";
import {HttpClient} from "../../../shared/stuff/http.client";
import {AbstractService} from "../../../shared/stuff/abstract.service";
import {AWSConfig} from "../../../shared/aws/config";
import {InterfaceStaffService} from "./interface.staff.service";
import {Staff} from "../staff";

@Injectable()
export class LiveStaffService extends AbstractService implements InterfaceStaffService {

  private static staffArray: Map<string, Staff>
  private static URL : string = "/api/customers" + "/" + AWSConfig.CUSTOMERID + "/staff";

  constructor(
    private logger : Logger,
    private httpClient: HttpClient<Staff>,
    protected accessProvider: AccessTokenProvider) {

    super(accessProvider);
    this.logger.log("created account service)");
  }

  listStaff(): Promise<Staff[]> {
    super.checkGate();
    return this.httpClient.list(LiveStaffService.URL);
  }

  updateStaff(staffMember: Staff): Promise<Staff[]> {
    super.checkGate();
    return this.httpClient.put(LiveStaffService.URL, staffMember.id, staffMember);
  }

  deleteStaff(staffMember: Staff): Promise<Staff[]> {
    return this.httpClient.delete(LiveStaffService.URL, staffMember.id);
  }

  /*
  getAccount(): Promise<Account> {
    super.checkGate();
    return this.httpClient.get(LiveAccountService.URL, "/" + AWSConfig.CUSTOMERID);
  }

  saveAccount(account: Account) : Promise<boolean> {
    super.checkGate();
    return this.httpClient.put(LiveAccountService.URL, "/" + AWSConfig.CUSTOMERID, account);
  }*/
}
