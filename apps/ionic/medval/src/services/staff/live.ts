import {Injectable} from "@angular/core";
import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {AbstractService} from "../../shared/service/abstract.service";
import {Config} from "../../shared/config";
import {Staff} from "./schema";
import {Http} from "@angular/http";

@Injectable()
export class LiveStaffService extends AbstractService<Staff> {

  constructor(
    utils : Utils,
    http: Http,
    accessProvider: AccessTokenService) {

    super(utils, accessProvider, http, new Staff());
    Utils.log("created account account");
  }

  getId(member: Staff): string {
    return member.username;
  }

  getPath(): string {
    return "/api/customers" + "/" + Config.CUSTOMERID + "/staff";
  }

  reset() {
    super.reset();
    this.list();
  }
}
