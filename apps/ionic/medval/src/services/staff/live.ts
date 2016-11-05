import {Injectable, EventEmitter} from '@angular/core';

import {Utils} from "../../shared/stuff/utils";
import {AccessTokenService} from "../../shared/aws/access.token.service";
import {HttpClient} from "../../shared/stuff/http.client";
import {AbstractService} from "../../shared/service/abstract.service";
import {Config} from "../../shared/aws/config";
import {Staff} from "./schema";

@Injectable()
export class LiveStaffService extends AbstractService<Staff> {

  constructor(
    utils : Utils,
    httpClient: HttpClient,
    accessProvider: AccessTokenService) {

    super(utils, httpClient, accessProvider);
    Utils.log("created account account");
  }

  getId(member: Staff): string {
    return member.username;
  }

  getPath(): string {
    return "/api/customers" + "/" + Config.CUSTOMERID + "/staff";
  }

}
