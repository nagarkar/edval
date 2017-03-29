/**
 * Created by Chinmay Nagarkar on 9/30/2016.
 * Copyright HC Technology Inc.
 * Please do not copy without permission. This code may not be used outside
 * of this application without permission. Copying and re-posting on another
 * site or application without licensing is strictly prohibited.
 */
import {Injectable} from "@angular/core";
import {AbstractService} from "../../shared/service/abstract.service";
import {Config} from "../../shared/config";
import {Staff} from "./schema";
import {Http} from "@angular/http";

@Injectable()
export class LiveStaffService extends AbstractService<Staff> {

  constructor(http: Http) {

    super(http, Staff);
  }

  getId(member: Staff): string {
    return member.username;
  }

  getPath(): string {
    return "/api/customers" + "/" + Config.CUSTOMERID + "/staff";
  }
}
