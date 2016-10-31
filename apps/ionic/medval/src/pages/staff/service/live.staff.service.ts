import {Injectable, EventEmitter} from '@angular/core';

import {Utils} from "../../../shared/stuff/utils";
import {AccessTokenService} from "../../../shared/aws/access.token.service";
import {HttpClient} from "../../../shared/stuff/http.client";
import {AbstractService} from "../../../shared/stuff/abstract.service";
import {Config} from "../../../shared/aws/config";
import {InterfaceStaffService} from "./interface.staff.service";
import {Staff} from "../staff";

@Injectable()
export class LiveStaffService extends AbstractService implements InterfaceStaffService {

  public onCreate: EventEmitter<Staff> = new EventEmitter<Staff>();
  public onUpdate: EventEmitter<Staff> = new EventEmitter<Staff>();
  public onDelete: EventEmitter<Staff> = new EventEmitter<Staff>();

  private static URL : string = "/api/customers" + "/" + Config.CUSTOMERID + "/staff";

  constructor(
    private utils : Utils,
    private httpClient: HttpClient,
    protected accessProvider: AccessTokenService) {

    super(accessProvider);
    this.utils.log("created account service");
  }

  listStaff(): Promise<Staff[]> {
    super.checkGate();
    return this.httpClient.list(LiveStaffService.URL);
  }

  createStaff(staffMember: Staff): Promise<Staff> {
    super.checkGate();
    let promise : Promise<Staff> = this.httpClient.post(LiveStaffService.URL, staffMember);
    promise.then((staff: Staff) => {
      this.onCreate.emit(staff);
    })
    return promise;
  }

  updateStaff(staffMember: Staff): Promise<Staff> {
    super.checkGate();
    let promise : Promise<Staff> =  this.httpClient.put(LiveStaffService.URL, staffMember.username, staffMember);
    promise.then((staff: Staff) => {
      this.onUpdate.emit(staff);
    });
    return promise;
  }

  deleteStaff(staffMember: Staff): Promise<boolean> {
    let promise : Promise<boolean> =  this.httpClient.delete(LiveStaffService.URL, staffMember.username);
    promise.then(() => {
      this.onDelete.emit(staffMember);
    });
    return promise;
  }

  /*
  getAccount(): Promise<Account> {
    super.checkGate();
    return this.httpClient.get(LiveAccountService.URL, "/" + Config.CUSTOMERID);
  }

  saveAccount(account: Account) : Promise<boolean> {
    super.checkGate();
    return this.httpClient.put(LiveAccountService.URL, "/" + Config.CUSTOMERID, account);
  }*/
}
